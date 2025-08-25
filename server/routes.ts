import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTravelPlanSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Travel plan routes
  app.get('/api/travel-plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { search, destination, startDate, endDate } = req.query;
      
      let plans;
      if (search === 'discover') {
        plans = await storage.searchTravelPlans(destination, startDate, endDate);
        // Filter out current user's plans
        plans = plans.filter(plan => plan.userId !== userId);
      } else {
        plans = await storage.getTravelPlans(userId);
      }
      
      res.json(plans);
    } catch (error) {
      console.error("Error fetching travel plans:", error);
      res.status(500).json({ message: "Failed to fetch travel plans" });
    }
  });

  app.post('/api/travel-plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const planData = insertTravelPlanSchema.parse(req.body);
      
      const newPlan = await storage.createTravelPlan({ ...planData, userId });
      res.status(201).json(newPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid travel plan data", errors: error.errors });
      }
      console.error("Error creating travel plan:", error);
      res.status(500).json({ message: "Failed to create travel plan" });
    }
  });

  app.put('/api/travel-plans/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      // Check if user owns the travel plan
      const existingPlan = await storage.getTravelPlan(id);
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this travel plan" });
      }
      
      const updates = req.body;
      const updatedPlan = await storage.updateTravelPlan(id, updates);
      
      if (!updatedPlan) {
        return res.status(404).json({ message: "Travel plan not found" });
      }
      
      res.json(updatedPlan);
    } catch (error) {
      console.error("Error updating travel plan:", error);
      res.status(500).json({ message: "Failed to update travel plan" });
    }
  });

  app.delete('/api/travel-plans/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      // Check if user owns the travel plan
      const existingPlan = await storage.getTravelPlan(id);
      if (!existingPlan || existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this travel plan" });
      }
      
      const deleted = await storage.deleteTravelPlan(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Travel plan not found" });
      }
      
      res.json({ message: "Travel plan deleted successfully" });
    } catch (error) {
      console.error("Error deleting travel plan:", error);
      res.status(500).json({ message: "Failed to delete travel plan" });
    }
  });

  // Message routes
  app.get('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { recipientId } = req.query;
      
      const messages = await storage.getMessages(userId, recipientId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse(req.body);
      
      const newMessage = await storage.sendMessage({ ...messageData, senderId });
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.put('/api/messages/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const success = await storage.markMessageAsRead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Match routes
  app.get('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const matches = await storage.getMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.post('/api/matches', isAuthenticated, async (req: any, res) => {
    try {
      const userOneId = req.user.claims.sub;
      const { userTwoId, travelPlanOneId, travelPlanTwoId } = req.body;
      
      const match = await storage.createMatch(userOneId, userTwoId, travelPlanOneId, travelPlanTwoId);
      res.status(201).json(match);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

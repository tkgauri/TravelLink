import {
  users,
  travelPlans,
  messages,
  matches,
  type User,
  type UpsertUser,
  type TravelPlan,
  type InsertTravelPlan,
  type Message,
  type InsertMessage,
  type Match,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, gte, lte, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Travel plan operations
  getTravelPlans(userId?: string): Promise<TravelPlan[]>;
  getTravelPlan(id: string): Promise<TravelPlan | undefined>;
  createTravelPlan(travelPlan: InsertTravelPlan & { userId: string }): Promise<TravelPlan>;
  updateTravelPlan(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan | undefined>;
  deleteTravelPlan(id: string): Promise<boolean>;
  searchTravelPlans(destination?: string, startDate?: string, endDate?: string): Promise<(TravelPlan & { user: User })[]>;
  
  // Message operations
  getMessages(userId: string, recipientId?: string): Promise<(Message & { sender: User; recipient: User })[]>;
  sendMessage(message: InsertMessage & { senderId: string }): Promise<Message>;
  markMessageAsRead(messageId: string): Promise<boolean>;
  
  // Match operations
  getMatches(userId: string): Promise<Match[]>;
  createMatch(userOneId: string, userTwoId: string, travelPlanOneId: string, travelPlanTwoId: string): Promise<Match>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Travel plan operations
  async getTravelPlans(userId?: string): Promise<TravelPlan[]> {
    if (userId) {
      return await db.select().from(travelPlans).where(eq(travelPlans.userId, userId)).orderBy(desc(travelPlans.createdAt));
    }
    return await db.select().from(travelPlans).where(eq(travelPlans.isActive, 1)).orderBy(desc(travelPlans.createdAt));
  }

  async getTravelPlan(id: string): Promise<TravelPlan | undefined> {
    const [plan] = await db.select().from(travelPlans).where(eq(travelPlans.id, id));
    return plan;
  }

  async createTravelPlan(travelPlan: InsertTravelPlan & { userId: string }): Promise<TravelPlan> {
    const [plan] = await db.insert(travelPlans).values(travelPlan).returning();
    return plan;
  }

  async updateTravelPlan(id: string, updates: Partial<TravelPlan>): Promise<TravelPlan | undefined> {
    const [plan] = await db
      .update(travelPlans)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(travelPlans.id, id))
      .returning();
    return plan;
  }

  async deleteTravelPlan(id: string): Promise<boolean> {
    const result = await db.update(travelPlans).set({ isActive: 0 }).where(eq(travelPlans.id, id));
    return result.rowCount > 0;
  }

  async searchTravelPlans(destination?: string, startDate?: string, endDate?: string): Promise<(TravelPlan & { user: User })[]> {
    let query = db
      .select({
        id: travelPlans.id,
        userId: travelPlans.userId,
        destination: travelPlans.destination,
        startDate: travelPlans.startDate,
        endDate: travelPlans.endDate,
        description: travelPlans.description,
        interests: travelPlans.interests,
        isActive: travelPlans.isActive,
        createdAt: travelPlans.createdAt,
        updatedAt: travelPlans.updatedAt,
        user: users,
      })
      .from(travelPlans)
      .innerJoin(users, eq(travelPlans.userId, users.id))
      .where(eq(travelPlans.isActive, 1));

    return await query.orderBy(desc(travelPlans.createdAt));
  }

  // Message operations
  async getMessages(userId: string, recipientId?: string): Promise<(Message & { sender: User; recipient: User })[]> {
    let whereClause = or(eq(messages.senderId, userId), eq(messages.recipientId, userId));
    
    if (recipientId) {
      whereClause = and(
        or(eq(messages.senderId, userId), eq(messages.recipientId, userId)),
        or(eq(messages.senderId, recipientId), eq(messages.recipientId, recipientId))
      );
    }

    return await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        recipientId: messages.recipientId,
        travelPlanId: messages.travelPlanId,
        content: messages.content,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        sender: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          bio: users.bio,
          location: users.location,
          dateOfBirth: users.dateOfBirth,
          interests: users.interests,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        recipient: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          bio: users.bio,
          location: users.location,
          dateOfBirth: users.dateOfBirth,
          interests: users.interests,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
      })
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .innerJoin(users, eq(messages.recipientId, users.id))
      .where(whereClause)
      .orderBy(desc(messages.createdAt));
  }

  async sendMessage(message: InsertMessage & { senderId: string }): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(messageId: string): Promise<boolean> {
    const result = await db.update(messages).set({ isRead: 1 }).where(eq(messages.id, messageId));
    return result.rowCount > 0;
  }

  // Match operations
  async getMatches(userId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(or(eq(matches.userOneId, userId), eq(matches.userTwoId, userId)))
      .orderBy(desc(matches.createdAt));
  }

  async createMatch(userOneId: string, userTwoId: string, travelPlanOneId: string, travelPlanTwoId: string): Promise<Match> {
    const [match] = await db
      .insert(matches)
      .values({
        userOneId,
        userTwoId,
        travelPlanOneId,
        travelPlanTwoId,
      })
      .returning();
    return match;
  }
}

export const storage = new DatabaseStorage();

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INTEREST_OPTIONS = [
  "Adventure", "Culture", "Food", "Nightlife", 
  "Photography", "Wellness", "Nature", "History", 
  "Beach", "Mountains", "Art", "Music"
];

export default function CreateTripModal({ isOpen, onClose }: CreateTripModalProps) {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    description: "",
    interests: [] as string[],
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTripMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest("POST", "/api/travel-plans", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travel-plans"] });
      toast({
        title: "Success",
        description: "Trip created successfully!",
      });
      onClose();
      setFormData({
        destination: "",
        startDate: "",
        endDate: "",
        description: "",
        interests: [],
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create trip. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Error", 
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    createTripMutation.mutate(formData);
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Plan Your Trip</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="button-close-modal"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Destination Input */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Where are you going?</Label>
              <div className="relative mt-2">
                <Input
                  type="text"
                  placeholder="Enter destination..."
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  data-testid="input-destination"
                />
                <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mt-2"
                  data-testid="input-start-date"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mt-2"
                  data-testid="input-end-date"
                />
              </div>
            </div>
            
            {/* Trip Description */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Describe your trip</Label>
              <Textarea
                placeholder="What are you planning to do? What kind of travel buddy are you looking for?"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none mt-2"
                data-testid="input-description"
              />
            </div>
            
            {/* Interest Tags */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-3 block">Trip Interests</Label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <Button
                    key={interest}
                    type="button"
                    variant={formData.interests.includes(interest) ? "default" : "secondary"}
                    size="sm"
                    onClick={() => toggleInterest(interest)}
                    className="rounded-full text-sm font-medium"
                    data-testid={`button-interest-${interest.toLowerCase()}`}
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={createTripMutation.isPending}
              className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg h-14"
              data-testid="button-create-trip"
            >
              {createTripMutation.isPending ? "Creating..." : "Create Trip"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

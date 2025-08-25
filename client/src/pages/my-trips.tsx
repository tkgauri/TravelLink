import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Calendar, MapPin, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import CreateTripModal from "@/components/create-trip-modal";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

export default function MyTrips() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: myTrips = [], isLoading } = useQuery({
    queryKey: ["/api/travel-plans"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/travel-plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/travel-plans"] });
      toast({
        title: "Success",
        description: "Trip deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to delete trip",
        variant: "destructive",
      });
    },
  });

  const handleDeleteTrip = (id: string) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">My Trips</h1>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            data-testid="button-add-trip"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-blue-100">Plan your next adventure</p>
      </header>

      {/* Trip Cards */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-32" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : myTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-6">
              <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2" data-testid="text-no-trips">No trips yet</h2>
              <p className="text-gray-600" data-testid="text-no-trips-desc">Start planning your first adventure!</p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white"
              data-testid="button-create-first-trip"
            >
              Create Your First Trip
            </Button>
          </div>
        ) : (
          myTrips.map((trip: any) => (
            <Card key={trip.id} className="overflow-hidden shadow-sm border border-gray-100" data-testid={`card-trip-${trip.id}`}>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 flex items-center justify-center text-white">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">{trip.destination}</h3>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg" data-testid={`text-destination-${trip.id}`}>
                      {trip.destination}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span data-testid={`text-dates-${trip.id}`}>
                        {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {trip.description && (
                  <p className="text-gray-700 text-sm mb-4" data-testid={`text-description-${trip.id}`}>
                    {trip.description}
                  </p>
                )}
                
                {trip.interests && trip.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trip.interests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs" data-testid={`badge-interest-${trip.id}-${index}`}>
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-gray-700"
                    data-testid={`button-edit-${trip.id}`}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteTrip(trip.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${trip.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}

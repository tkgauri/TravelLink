import { Heart, MessageCircle, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TravelPlanCardProps {
  plan: any;
}

export default function TravelPlanCard({ plan }: TravelPlanCardProps) {
  const getDestinationImage = (destination: string) => {
    const images: { [key: string]: string } = {
      "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      "Bali": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      "Paris": "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200",
      "default": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200"
    };
    return images[destination] || images.default;
  };

  const user = plan.user;
  const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous';
  
  return (
    <Card className="overflow-hidden shadow-sm border border-gray-100" data-testid={`card-travel-plan-${plan.id}`}>
      <img 
        src={getDestinationImage(plan.destination)} 
        alt={plan.destination}
        className="w-full h-48 object-cover"
      />
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg" data-testid={`text-destination-${plan.id}`}>
              {plan.destination}
            </h3>
            <p className="text-gray-600 text-sm" data-testid={`text-dates-${plan.id}`}>
              {format(new Date(plan.startDate), 'MMM dd')} - {format(new Date(plan.endDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-accent p-2"
            data-testid={`button-favorite-${plan.id}`}
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center mb-3">
          <Avatar className="w-10 h-10 mr-3">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback>
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium text-gray-900" data-testid={`text-user-name-${plan.id}`}>
              {fullName}
            </p>
            <p className="text-sm text-gray-600">
              25 • {user?.interests?.slice(0, 2).join(', ') || 'Adventure, Culture'}
            </p>
          </div>
          <div className="flex items-center text-secondary">
            <Star className="h-4 w-4 mr-1 fill-current" />
            <span className="text-sm font-medium">4.9</span>
          </div>
        </div>
        
        {plan.description && (
          <p className="text-gray-700 text-sm mb-4" data-testid={`text-description-${plan.id}`}>
            {plan.description}
          </p>
        )}
        
        {plan.interests && plan.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {plan.interests.slice(0, 3).map((interest: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs" data-testid={`badge-interest-${plan.id}-${index}`}>
                {interest}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-3">
          <Button 
            className="flex-1 bg-primary text-white rounded-xl"
            data-testid={`button-message-${plan.id}`}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl"
            data-testid={`button-profile-${plan.id}`}
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

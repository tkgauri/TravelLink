import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Settings, LogOut, Edit, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Profile() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  
  return (
    <div className="pb-20">
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            data-testid="button-edit-profile"
          >
            <Edit className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20 border-4 border-white/30">
            <AvatarImage src={user.profileImageUrl} />
            <AvatarFallback className="text-xl">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-xl font-bold" data-testid="text-username">{fullName}</h2>
            <div className="flex items-center text-blue-100 mb-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span data-testid="text-location">{user.location || "Location not set"}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-secondary mr-1" />
              <span className="text-sm font-medium">4.9</span>
              <span className="text-blue-200 text-sm ml-1">(23 reviews)</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary" data-testid="stat-trips">12</div>
              <div className="text-sm text-gray-600">Trips</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-secondary" data-testid="stat-countries">8</div>
              <div className="text-sm text-gray-600">Countries</div>
            </CardContent>
          </Card>
          <Card className="text-center shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600" data-testid="stat-buddies">15</div>
              <div className="text-sm text-gray-600">Buddies</div>
            </CardContent>
          </Card>
        </div>

        {/* About */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">About Me</h3>
            <p className="text-gray-700 text-sm leading-relaxed" data-testid="text-bio">
              {user.bio || "Adventure seeker and culture enthusiast! I love exploring new destinations, trying local cuisines, and meeting fellow travelers."}
            </p>
          </CardContent>
        </Card>

        {/* Travel Interests */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Travel Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" data-testid={`badge-interest-${index}`}>
                    {interest}
                  </Badge>
                ))
              ) : (
                <>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Adventure</Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Culture</Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">Photography</Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">Food</Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Trips */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Trips</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60" 
                  alt="Nepal mountains" 
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Nepal</p>
                  <p className="text-sm text-gray-600">Dec 2023</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=60" 
                  alt="Portugal coast" 
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Portugal</p>
                  <p className="text-sm text-gray-600">Oct 2023</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="shadow-sm overflow-hidden">
          <Button 
            variant="ghost" 
            className="w-full p-4 justify-between text-left h-auto"
            data-testid="button-settings"
          >
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-900">Settings</span>
            </div>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full p-4 justify-between text-left border-t border-gray-100 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <div className="flex items-center space-x-3">
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </div>
          </Button>
        </Card>
      </div>
    </div>
  );
}

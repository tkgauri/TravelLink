import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Bell, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TravelPlanCard from "@/components/travel-plan-card";
import CreateTripModal from "@/components/create-trip-modal";
import { useAuth } from "@/hooks/useAuth";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user } = useAuth();

  const { data: travelPlans = [], isLoading } = useQuery({
    queryKey: ["/api/travel-plans", { search: "discover" }],
  });

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Discover</h1>
            <p className="text-blue-100" data-testid="text-location">
              {user?.location || "Location not set"}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative p-2 text-white hover:bg-white/20"
            data-testid="button-notifications"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 rounded-2xl text-gray-900 bg-white/90 backdrop-blur-sm placeholder-gray-500 border-0 focus-visible:ring-2 focus-visible:ring-white/50"
            data-testid="input-search"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
      </header>

      {/* Quick Filters */}
      <div className="p-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          <Button variant="default" size="sm" className="bg-primary text-white rounded-full whitespace-nowrap" data-testid="filter-this-week">
            This Week
          </Button>
          <Button variant="secondary" size="sm" className="bg-gray-200 text-gray-700 rounded-full whitespace-nowrap" data-testid="filter-next-month">
            Next Month
          </Button>
          <Button variant="secondary" size="sm" className="bg-gray-200 text-gray-700 rounded-full whitespace-nowrap" data-testid="filter-weekend">
            Weekend
          </Button>
          <Button variant="secondary" size="sm" className="bg-gray-200 text-gray-700 rounded-full whitespace-nowrap" data-testid="filter-same-age">
            Same Age
          </Button>
        </div>
      </div>

      {/* Travel Buddy Cards */}
      <div className="px-4 space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
              <Skeleton className="w-full h-48 rounded-xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/2 mb-1" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
              <Skeleton className="h-16 w-full mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-12" />
              </div>
            </div>
          ))
        ) : travelPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4" data-testid="text-no-plans">No travel plans found</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-white"
              data-testid="button-create-first-plan"
            >
              Create Your First Trip
            </Button>
          </div>
        ) : (
          travelPlans.map((plan: any) => (
            <TravelPlanCard key={plan.id} plan={plan} />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-24 right-6 bg-gradient-to-r from-secondary to-orange-500 text-white w-14 h-14 rounded-full shadow-lg z-40 hover:shadow-xl transition-all duration-200 p-0"
        data-testid="button-create-trip"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </div>
  );
}

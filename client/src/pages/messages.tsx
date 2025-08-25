import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages"],
  });

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-blue-600 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 rounded-2xl text-gray-900 bg-white/90 backdrop-blur-sm placeholder-gray-500 border-0 focus-visible:ring-2 focus-visible:ring-white/50"
            data-testid="input-search-messages"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
        </div>
      </header>

      {/* Messages List */}
      <div className="p-4">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <Card key={i} className="mb-3 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2" data-testid="text-no-messages">No messages yet</h2>
            <p className="text-gray-600" data-testid="text-no-messages-desc">Start a conversation with a travel buddy!</p>
          </div>
        ) : (
          messages.map((message: any) => (
            <Card key={message.id} className="mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-message-${message.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={message.sender.profileImageUrl} />
                    <AvatarFallback>
                      {message.sender.firstName?.[0]}{message.sender.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate" data-testid={`text-sender-${message.id}`}>
                        {message.sender.firstName} {message.sender.lastName}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500" data-testid={`text-time-${message.id}`}>
                          {format(new Date(message.createdAt), 'MMM dd')}
                        </span>
                        {!message.isRead && (
                          <Badge variant="default" className="h-2 w-2 p-0 bg-primary" data-testid={`badge-unread-${message.id}`} />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate" data-testid={`text-content-${message.id}`}>
                      {message.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

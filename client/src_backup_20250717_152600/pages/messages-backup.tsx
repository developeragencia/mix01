import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, MessageCircle, ArrowLeft, Heart, Star } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { Match, Message, Profile } from "@shared/schema";

type Conversation = {
  match: Match;
  lastMessage: Message | null;
  profile: Profile;
};

export default function Messages() {
  const isMobile = useMobile();
  const [, setLocation] = useLocation();
  const [currentUserId] = useState(1); // Demo user ID

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: [`/api/conversations/${currentUserId}`],
  });

  const openConversation = (matchId: number) => {
    setLocation(`/chat/${matchId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--mix-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {!isMobile && <DesktopSidebar currentSection="messages" />}
      
      {/* Header */}
      <header className="bg-transparent sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setLocation('/discover')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MIX</span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="text-white">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </header>
      
      <main className={`${!isMobile ? 'lg:ml-80' : ''} min-h-screen px-4 pb-20`}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Mensagens</h1>
          <p className="text-white/80">{conversations.length} conversas ativas</p>
        </div>
        
        {conversations.length > 0 ? (
          <div className="max-w-md mx-auto space-y-4">
            {/* New Matches Section */}
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold mb-3">Deu Match!</h3>
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {conversations.filter(conv => !conv.lastMessage).slice(0, 5).map((conversation) => (
                  <div 
                    key={conversation.match.id}
                    className="flex-shrink-0 text-center cursor-pointer"
                    onClick={() => openConversation(conversation.match.id)}
                  >
                    <div className="relative">
                      {conversation.profile.photos?.[0] ? (
                        <img 
                          src={conversation.profile.photos[0]} 
                          alt={conversation.profile.name}
                          className="w-16 h-16 rounded-full border-2 border-white/40 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full border-2 border-white/40 bg-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {conversation.profile.name[0]}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Heart className="w-2 h-2 text-white" />
                      </div>
                    </div>
                    <p className="text-xs mt-1 text-white/80 truncate w-16">
                      {conversation.profile.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Messages List */}
            <div className="space-y-3">
              <h3 className="text-white text-lg font-semibold mb-4">Suas mensagens</h3>
              
              {conversations.length > 0 ? (
                <div className="space-y-4">
                  {conversations.filter(conv => conv.lastMessage).map((conversation) => (
                    <div 
                      key={conversation.match.id}
                      className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      onClick={() => openConversation(conversation.match.id)}
                    >
                      {conversation.profile.photos[0] ? (
                        <img 
                          src={conversation.profile.photos[0]} 
                          alt={conversation.profile.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                          <span className="text-white font-bold">
                            {conversation.profile.name[0]}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white truncate">
                            {conversation.profile.name}
                          </h4>
                          <span className="text-xs text-white/60">
                            {conversation.lastMessage && formatTimeAgo(new Date(conversation.lastMessage.createdAt))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.content || "Comece a conversa..."}
                        </p>
                      </div>
                      
                      {conversation.lastMessage && !conversation.lastMessage.isRead && (
                        <Badge className="bg-[var(--mix-pink)] text-white">
                          Novo
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhuma conversa ainda
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Seus matches aparecerão aqui quando vocês começarem a conversar
                  </p>
                  <Button 
                    onClick={() => setLocation('/matches')}
                    className="gradient-bg text-white"
                  >
                    Ver Matches
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {isMobile && <MobileNav currentSection="messages" />}
    </div>
  );
}

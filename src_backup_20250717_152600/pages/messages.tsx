import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { ArrowLeft, Heart, Star, MessageCircle, Filter } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { Match, Message, Profile } from "@shared/schema";

type Conversation = {
  match: Match;
  lastMessage: Message | null;
  profile: Profile;
};

export default function Messages() {
  const [, setLocation] = useLocation();
  const [currentUserId] = useState(1);

  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: [`/api/conversations/${currentUserId}`],
  });

  const openConversation = (matchId: number) => {
    setLocation(`/chat/${matchId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
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

      {/* Content */}
      <main className="px-4 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Mensagens</h1>
          <p className="text-white/80">{conversations.length} conversas ativas</p>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-16">
            <MessageCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Nenhuma mensagem ainda</p>
            <p className="text-white/40">Comece a conversar com seus matches!</p>
          </div>
        ) : (
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
              
              {conversations.filter(conv => conv.lastMessage).map((conversation) => (
                <div 
                  key={conversation.match.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-200"
                  onClick={() => openConversation(conversation.match.id)}
                >
                  <div className="flex items-center space-x-3">
                    {conversation.profile.photos?.[0] ? (
                      <img 
                        src={conversation.profile.photos[0]} 
                        alt={conversation.profile.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center border-2 border-white/30">
                        <span className="text-white font-bold">
                          {conversation.profile.name[0]}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-white truncate">
                          {conversation.profile.name}
                        </h4>
                        <span className="text-xs text-white/60">
                          {conversation.lastMessage && formatTimeAgo(new Date(conversation.lastMessage.createdAt))}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm truncate">
                        {conversation.lastMessage?.content || "Diga olá!"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
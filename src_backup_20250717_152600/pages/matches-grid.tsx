import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, Star, MessageCircle } from "lucide-react";
import type { Match, Profile } from "@shared/schema";

export default function MatchesGrid() {
  const [, setLocation] = useLocation();
  const [currentUserId] = useState(1);

  const { data: matches = [], isLoading } = useQuery<(Match & { profile: Profile })[]>({
    queryKey: [`/api/matches/${currentUserId}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Carregando matches...</p>
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
            <div className="w-6 h-6 rounded-full bg-white/20"></div>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Matches</h1>
          <p className="text-white/80">Pessoas que curtiram você de volta</p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Nenhum match ainda</p>
            <p className="text-white/40">Continue navegando para encontrar matches!</p>
          </div>
        ) : (
          <>
            {/* Featured Match */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src={matches[0]?.profile.photos?.[0] || '/placeholder-avatar.png'} 
                      alt={matches[0]?.profile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-300" />
                      <span className="text-sm font-medium">Match Especial</span>
                    </div>
                    <h3 className="text-lg font-bold">{matches[0]?.profile.name}</h3>
                    <p className="text-white/80 text-sm">Nova mensagem</p>
                  </div>
                  <Button 
                    className="bg-white/20 hover:bg-white/30 text-white border-white/40"
                    onClick={() => setLocation(`/chat/${matches[0]?.id}`)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </Card>
            </div>

            {/* Matches Grid */}
            <div className="grid grid-cols-2 gap-4">
              {matches.slice(1).map((match) => (
                <Card 
                  key={match.id}
                  className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/20 transition-all duration-200"
                  onClick={() => setLocation(`/chat/${match.id}`)}
                >
                  <div className="aspect-[3/4] relative">
                    <img 
                      src={match.profile.photos?.[0] || '/placeholder-avatar.png'} 
                      alt={match.profile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-semibold text-sm mb-1">
                        {match.profile.name}
                      </h3>
                      <p className="text-white/80 text-xs">
                        {match.profile.age} anos
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="flex justify-around py-3">
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-white/60"
            onClick={() => setLocation('/discover')}
          >
            <Heart className="w-5 h-5" />
            <span className="text-xs">Descobrir</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-white"
          >
            <Star className="w-5 h-5" />
            <span className="text-xs">Matches</span>
          </Button>
          <Button 
            variant="ghost" 
            className="flex flex-col items-center space-y-1 text-white/60"
            onClick={() => setLocation('/messages')}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">Mensagens</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import type { Match, Message, Profile } from "@shared/schema";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

type Conversation = {
  match: Match;
  lastMessage: Message | null;
  profile: Profile;
};

export default function Matches() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // ⚡ OTIMIZADO: Configuração eficiente de cache e polling
  const { data: matchesData = [], isLoading, error, refetch } = useQuery<Conversation[]>({
    queryKey: ['/api/matches'],
    refetchInterval: 30000, // Polling: 30 segundos
    staleTime: 20000, // Cache válido por 20 segundos
    gcTime: 5 * 60 * 1000, // Garbage collection: 5 minutos
    refetchOnWindowFocus: true, // Atualizar ao voltar para a aba
    refetchOnMount: true, // Atualizar ao montar componente
    retry: 2, // Tentar 2 vezes em caso de erro
    retryDelay: 1000, // 1 segundo entre tentativas
  });

  // TODOS os matches aparecem em "Deu MIX" (matches retribuídos)
  const newMatches = matchesData;
  // Conversas são apenas os que TÊM mensagens
  const conversations = matchesData.filter(conv => conv.lastMessage !== null);
  
  console.log("📊 Matches - Dados carregados:", {
    total: matchesData.length,
    newMatches: newMatches.length,
    conversations: conversations.length
  });
  
  const unreadMessagesCount = conversations.filter((c: any) => 
    c.lastMessage?.senderId === c.profile?.userId
  ).length;

  const openConversation = (matchId: number) => {
    setLocation(`/chat/${matchId}`);
  };

  const openMatchProfile = (userId: number) => {
    setLocation(`/match-profile/${userId}`);
  };

  if (isLoading) {
    return <LoadingSpinner message="Carregando matches..." />;
  }

  if (error) {
    console.log("❌ Matches - Erro ao carregar:", error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center px-4 max-w-md">
          <div className="mb-8">
            <img src={mixLogo} alt="MIX" className="h-12 w-auto mx-auto mb-6" />
            <div className="text-6xl mb-6">💬</div>
          </div>
          <h1 className="text-white text-2xl font-bold mb-4">
            Seus Matches Esperam por Você!
          </h1>
          <p className="text-gray-400 text-base mb-8 leading-relaxed">
            Faça login para ver seus matches, conversas e começar a se conectar com pessoas incríveis
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => setLocation('/login')}
              className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold py-3"
            >
              Fazer Login
            </Button>
            <Button 
              onClick={() => setLocation('/')}
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-900 py-3"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black border-b border-gray-800 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <img src={mixLogo} alt="MIX" className="h-8 w-auto" data-testid="img-logo" />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:bg-gray-900 w-10 h-10 p-0 rounded-full"
              data-testid="button-shield"
            >
              <Shield className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/settings')}
              className="text-gray-400 hover:bg-gray-900 w-10 h-10 p-0 rounded-full"
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-24">
        {/* Campo de busca */}
        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder={`Buscar ${matchesData.length} Matches`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border-none"
              data-testid="input-search-matches"
            />
          </div>
        </div>

        {/* Seção: Novos Matches */}
        {newMatches.length > 0 && (
          <div className="mb-6 px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-xl flex items-center gap-2">
                Deu MIX
                <span className="bg-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {newMatches.length}
                </span>
              </h2>
            </div>

            {/* Carrossel horizontal de novos matches */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {/* Card "+99" se tiver muitos matches */}
              {newMatches.length > 5 && (
                <button
                  onClick={() => setLocation('/discover')}
                  className="flex-shrink-0"
                  data-testid="button-see-all-matches"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">+{newMatches.length - 4}</span>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-white text-sm font-medium">Curtidas</p>
                    </div>
                  </div>
                </button>
              )}

              {/* Fotos dos novos matches */}
              {newMatches.slice(0, newMatches.length > 5 ? 4 : 10).map((conv) => (
                <button
                  key={conv.match.id}
                  onClick={() => openMatchProfile(conv.profile.userId)}
                  className="flex-shrink-0"
                  data-testid={`new-match-${conv.match.id}`}
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500">
                      <img
                        src={conv.profile.photos?.[0] || `https://ui-avatars.com/api/?name=${conv.profile.name}&background=ec4899&color=fff&size=100`}
                        alt={conv.profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {conv.profile.isVerified && (
                      <div className="absolute bottom-1 right-1">
                        <VerifiedBadge className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-white text-sm font-medium truncate w-20">
                      {conv.profile.name.split(' ')[0]}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Seção: Mensagens */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              Mensagens
              {unreadMessagesCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadMessagesCount}
                </span>
              )}
            </h2>
          </div>

          {/* Lista de conversas */}
          {conversations.length === 0 && newMatches.length === 0 ? (
            // Estado vazio
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-8 relative">
                <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
                  <rect x="40" y="50" width="120" height="160" rx="12" fill="#2D2D2D" transform="rotate(-5 100 130)" />
                  <rect x="40" y="40" width="120" height="160" rx="12" fill="#1F2937" stroke="#10B981" strokeWidth="3" />
                  <text x="100" y="120" textAnchor="middle" fill="#10B981" fontSize="24" fontWeight="bold" fontFamily="Arial">
                    LIKE
                  </text>
                  <rect x="40" y="40" width="120" height="160" rx="12" fill="url(#glow)" opacity="0.3" />
                  <defs>
                    <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <h2 className="text-white text-2xl font-bold mb-4">
                Comece a deslizar
              </h2>
              <p className="text-gray-400 text-base leading-relaxed max-w-sm px-4">
                Quando você der um Match com outros usuários, eles aparecerão aqui para que você possa enviar mensagens
              </p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">
                Diga olá para seus novos matches! 👋
              </p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-gray-800">
              {conversations
                .filter(conv => 
                  searchQuery === "" || 
                  conv.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((conversation) => {
                  const isOnline = false;
                  
                  return (
                    <button
                      key={conversation.match.id}
                      onClick={() => openConversation(conversation.match.id)}
                      className="w-full p-4 hover:bg-gray-900/50 transition-colors text-left"
                      data-testid={`conversation-${conversation.match.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <img
                              src={conversation.profile.photos?.[0] || `https://ui-avatars.com/api/?name=${conversation.profile.name}&background=ec4899&color=fff&size=100`}
                              alt={conversation.profile.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {isOnline && (
                            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-black rounded-full"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white text-base">
                              {conversation.profile.name.split(' ')[0]}
                            </h3>
                            {conversation.profile.isVerified && (
                              <VerifiedBadge className="w-4 h-4" />
                            )}
                            {conversation.match.user2Id === conversation.profile.userId && (
                              <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                                CURTIU VOCÊ
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <p className="text-gray-400 text-sm truncate">
                              {conversation.lastMessage?.content || "Diga olá! 👋"}
                            </p>
                            {conversation.lastMessage && 
                             conversation.lastMessage.senderId === conversation.profile.userId && (
                              <span className="bg-white text-black text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0">
                                Sua vez
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

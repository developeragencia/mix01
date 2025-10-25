import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Search, Shield, Settings } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Messages() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // ⚡ OTIMIZADO: Configuração eficiente de cache e polling
  const { data, isLoading, error, refetch } = useQuery<any[]>({
    queryKey: ['/api/matches'],
    refetchInterval: 30000, // Polling: 30 segundos
    staleTime: 20000, // Cache válido por 20 segundos
    gcTime: 5 * 60 * 1000, // Garbage collection: 5 minutos
    refetchOnWindowFocus: true, // Atualizar ao voltar para a aba
    refetchOnMount: true, // Atualizar ao montar componente
    retry: 2, // Tentar 2 vezes em caso de erro
    retryDelay: 1000, // 1 segundo entre tentativas
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-500 mb-4">Erro ao carregar mensagens</p>
          <button 
            onClick={() => setLocation('/login')}
            className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-2 rounded-full"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  const matchesData = data || [];
  // TODOS os matches aparecem em "Deu MIX" (matches retribuídos)
  const newMatches = matchesData.filter((m: any) => m.profile);
  // Conversas são apenas os que TÊM mensagens
  const conversations = matchesData.filter((m: any) => m.lastMessage && m.profile);
  
  console.log("📊 Messages - Dados carregados:", {
    total: matchesData.length,
    newMatches: newMatches.length,
    conversations: conversations.length
  });
  
  const filteredConversations = searchQuery 
    ? conversations.filter((conv: any) => 
        conv.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const unreadCount = conversations.filter((c: any) => 
    c.lastMessage?.senderId === c.profile?.userId
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pb-24">
      {/* Header com logo MIX */}
      <div className="sticky top-0 z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 px-4 py-3 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <img 
            src={mixLogo} 
            alt="MIX" 
            className="h-8 w-auto" 
            data-testid="img-logo" 
          />
          <div className="flex gap-2">
            <button 
              className="text-gray-400 hover:bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              data-testid="button-shield"
            >
              <Shield className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setLocation('/settings')}
              className="text-gray-400 hover:bg-gray-900 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              data-testid="button-settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Campo de busca estilo Tinder */}
        <div className="px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder={`Buscar ${matchesData.length} Matches`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 border-none placeholder:text-gray-500"
              data-testid="input-search-matches"
            />
          </div>
        </div>

        {/* Seção: Deu MIX (Novos Matches) */}
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
                    <div className="w-[84px] h-[84px] rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">+{newMatches.length - 4}</span>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-white text-sm font-medium">Curtidas</p>
                    </div>
                  </div>
                </button>
              )}

              {/* Fotos dos novos matches */}
              {newMatches.slice(0, newMatches.length > 5 ? 4 : 10).map((conv: any) => (
                <button
                  key={conv.id}
                  onClick={() => setLocation(`/match-profile/${conv.profile.userId}`)}
                  className="flex-shrink-0"
                  data-testid={`new-match-${conv.id}`}
                >
                  <div className="relative">
                    <div className="w-[84px] h-[84px] rounded-2xl overflow-hidden border-4 border-pink-500">
                      <img
                        src={conv.profile.photos?.[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.profile.name || 'Match')}&background=ec4899&color=fff&size=120`}
                        alt={conv.profile.name || 'Match'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {conv.profile.isVerified && (
                      <div className="absolute bottom-0 right-0">
                        <VerifiedBadge className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-2 w-[84px]">
                    <p className="text-white text-sm font-medium truncate">
                      {conv.profile.name?.split(' ')[0] || 'Match'}
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
              {unreadCount > 0 && (
                <span className="bg-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>

          {/* Lista de conversas */}
          {conversations.length === 0 && newMatches.length === 0 ? (
            // Estado vazio - sem nenhum match
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
            // Tem novos matches mas nenhuma conversa ainda
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm">
                Diga olá para seus novos matches! 👋
              </p>
            </div>
          ) : (
            // Lista de conversas ativas
            <div className="space-y-0 divide-y divide-gray-800">
              {filteredConversations.map((conversation: any) => {
                if (!conversation?.profile) return null;
                
                const isOnline = false;
                const isUnread = conversation.lastMessage?.senderId === conversation.profile.userId;
                const isCurtiu = conversation.user2Id === conversation.profile.userId;
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setLocation(`/chat/${conversation.id}`)}
                    className="w-full p-4 hover:bg-gray-900/50 transition-colors text-left"
                    data-testid={`conversation-${conversation.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden">
                          <img
                            src={conversation.profile.photos?.[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(conversation.profile.name || 'Match')}&background=ec4899&color=fff&size=100`}
                            alt={conversation.profile.name || 'Match'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {isOnline && (
                          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-4 border-black rounded-full"></div>
                        )}
                      </div>

                      {/* Informações da conversa */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-base">
                            {conversation.profile.name || 'Match'}
                          </h3>
                          {conversation.profile.isVerified && (
                            <VerifiedBadge className="w-4 h-4" />
                          )}
                          {isCurtiu && (
                            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                              CURTIU VOCÊ
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm truncate ${isUnread ? 'text-white font-semibold' : 'text-gray-400'}`}>
                            {conversation.lastMessage?.content || "Diga olá! 👋"}
                          </p>
                          {isUnread && (
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

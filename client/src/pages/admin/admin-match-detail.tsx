import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Heart,
  MessageSquare,
  Calendar,
  Users,
  MapPin,
  Trash2,
  Ban,
  Eye,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MatchUser {
  id: number;
  name: string;
  age: number;
  profession?: string;
  photo: string;
  location?: string;
  verified: boolean;
}

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface MatchData {
  id: number;
  user1: MatchUser;
  user2: MatchUser;
  matchedAt: string;
  status: 'active' | 'inactive' | 'blocked';
  messages: Message[];
  stats: {
    totalMessages: number;
    lastActivity: string;
    conversationStarted: string;
    responseTime: string;
  };
  reports: any[];
  compatibility: number;
}

export default function AdminMatchDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'messages' | 'timeline'>('overview');

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: match, isLoading, error } = useQuery<MatchData>({
    queryKey: ['/api/admin/matches', id],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/matches/${id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Erro ao carregar match');
      }
      
      return res.json();
    },
    enabled: !!id,
    retry: 1
  });

  const deleteMatchMutation = useMutation({
    mutationFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/matches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Erro ao remover match');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/matches'] });
      toast({
        title: "✅ Sucesso",
        description: "Match removido com sucesso"
      });
      setLocation("/admin/matches");
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Erro",
        description: error.message || "Não foi possível remover o match",
        variant: "destructive"
      });
    }
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          badge: <Badge className="bg-green-500/20 text-green-300 border-green-500/30 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Ativo
          </Badge>,
          color: 'green'
        };
      case 'inactive':
        return {
          badge: <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Inativo
          </Badge>,
          color: 'gray'
        };
      case 'blocked':
        return {
          badge: <Badge className="bg-red-500/20 text-red-300 border-red-500/30 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Bloqueado
          </Badge>,
          color: 'red'
        };
      default:
        return {
          badge: <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{status}</Badge>,
          color: 'blue'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes do Match">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-96 bg-blue-800/50 rounded"></div>
            <div className="h-96 bg-blue-800/50 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Erro ao carregar match">
        <Card className="p-8 bg-red-900/20 backdrop-blur-sm border-red-500/30 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-200 text-xl font-bold mb-2">Erro ao carregar dados</h3>
          <p className="text-red-300 text-sm mb-4">{(error as Error).message}</p>
          <Button
            onClick={() => setLocation("/admin/matches")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à lista
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  if (!match) {
    return (
      <AdminLayout title="Match não encontrado">
        <Card className="p-8 bg-blue-800/30 backdrop-blur-sm border-blue-700/50 text-center">
          <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <p className="text-blue-200 mb-4">Match não encontrado.</p>
          <Button
            onClick={() => setLocation("/admin/matches")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à lista
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  const statusConfig = getStatusConfig(match.status);

  return (
    <AdminLayout title={`Match #${match.id}`}>
      <div className="space-y-6">
        {/* Header with Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/matches")}
              variant="outline"
              size="sm"
              className="bg-blue-900/50 border-blue-700/50 text-blue-200 hover:bg-blue-800/50 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Match #{match.id}</h1>
              {statusConfig.badge}
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {match.compatibility}% compatibilidade
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => toast({ title: "Em breve", description: "Funcionalidade em desenvolvimento" })}
              variant="outline"
              size="sm"
              className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
            >
              <Activity className="w-4 h-4 mr-2" />
              Atividade
            </Button>
          <Button
              onClick={() => {
                if (confirm('Tem certeza que deseja remover este match?')) {
                  deleteMatchMutation.mutate();
                }
              }}
            disabled={deleteMatchMutation.isPending}
            variant="outline"
              size="sm"
            className="border-red-600/50 text-red-300 hover:bg-red-700/50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
              Remover
          </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total Mensagens</p>
                <p className="text-white text-2xl font-bold mt-1">{match.stats.totalMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-sm border-purple-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Compatibilidade</p>
                <p className="text-white text-2xl font-bold mt-1">{match.compatibility}%</p>
              </div>
              <Heart className="w-8 h-8 text-purple-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-sm border-pink-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm font-medium">Tempo Resposta</p>
                <p className="text-white text-2xl font-bold mt-1">{match.stats.responseTime}</p>
              </div>
              <Clock className="w-8 h-8 text-pink-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm border-green-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Status</p>
                <p className="text-white text-lg font-bold mt-1 capitalize">{match.status}</p>
              </div>
              <Activity className="w-8 h-8 text-green-400" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10">
          <button
            onClick={() => setSelectedTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'overview'
                ? 'text-pink-400 border-b-2 border-pink-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setSelectedTab('messages')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'messages'
                ? 'text-pink-400 border-b-2 border-pink-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Mensagens
          </button>
          <button
            onClick={() => setSelectedTab('timeline')}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedTab === 'timeline'
                ? 'text-pink-400 border-b-2 border-pink-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Timeline
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTab === 'overview' && (
              <>
            {/* Users Info */}
                <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                    Participantes do Match
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User 1 */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                      <div className="relative bg-blue-800/50 rounded-xl p-4 border border-blue-700/50 hover:border-pink-500/50 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                  <img
                    src={match.user1.photo}
                    alt={match.user1.name}
                              className="w-16 h-16 rounded-full bg-blue-700/50 object-cover border-2 border-pink-500/50"
                            />
                            {match.user1.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{match.user1.name}</h4>
                      {match.user1.verified && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-blue-200 text-sm">{match.user1.age} anos</p>
                            {match.user1.profession && (
                    <p className="text-blue-200 text-sm">{match.user1.profession}</p>
                            )}
                            {match.user1.location && (
                    <p className="text-blue-300 text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {match.user1.location}
                    </p>
                            )}
                    <Button
                      size="sm"
                      variant="outline"
                              className="mt-3 w-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-400/50 text-pink-300 hover:from-pink-500/20 hover:to-purple-500/20"
                      onClick={() => setLocation(`/admin/users/${match.user1.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver Perfil
                    </Button>
                          </div>
                        </div>
                  </div>
                </div>

                {/* User 2 */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                      <div className="relative bg-blue-800/50 rounded-xl p-4 border border-blue-700/50 hover:border-purple-500/50 transition-all">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                  <img
                    src={match.user2.photo}
                    alt={match.user2.name}
                              className="w-16 h-16 rounded-full bg-blue-700/50 object-cover border-2 border-purple-500/50"
                            />
                            {match.user2.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{match.user2.name}</h4>
                      {match.user2.verified && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          Verificado
                        </Badge>
                      )}
                    </div>
                    <p className="text-blue-200 text-sm">{match.user2.age} anos</p>
                            {match.user2.profession && (
                    <p className="text-blue-200 text-sm">{match.user2.profession}</p>
                            )}
                            {match.user2.location && (
                    <p className="text-blue-300 text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {match.user2.location}
                    </p>
                            )}
                    <Button
                      size="sm"
                      variant="outline"
                              className="mt-3 w-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/50 text-purple-300 hover:from-purple-500/20 hover:to-blue-500/20"
                      onClick={() => setLocation(`/admin/users/${match.user2.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver Perfil
                    </Button>
                          </div>
                        </div>
                  </div>
                </div>
              </div>
            </Card>

                {/* Match Info */}
                <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
                  <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Informações do Match
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-800/30 rounded-lg p-4">
                      <p className="text-blue-300 text-sm mb-1">Match criado</p>
                      <p className="text-white font-medium">{formatDate(match.matchedAt)}</p>
                    </div>
                    <div className="bg-blue-800/30 rounded-lg p-4">
                      <p className="text-blue-300 text-sm mb-1">Última atividade</p>
                      <p className="text-white font-medium">{formatDate(match.stats.lastActivity)}</p>
                    </div>
                    <div className="bg-blue-800/30 rounded-lg p-4">
                      <p className="text-blue-300 text-sm mb-1">Conversa iniciada</p>
                      <p className="text-white font-medium">{formatDate(match.stats.conversationStarted)}</p>
                    </div>
                    <div className="bg-blue-800/30 rounded-lg p-4">
                      <p className="text-blue-300 text-sm mb-1">Total de mensagens</p>
                      <p className="text-white font-medium">{match.stats.totalMessages}</p>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {selectedTab === 'messages' && (
              <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Histórico de Mensagens ({match.messages.length})
              </h3>
              
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {match.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === match.user1.id ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.senderId === match.user1.id
                            ? 'bg-blue-700/50 text-white rounded-tl-none'
                            : 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-white rounded-tr-none'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold opacity-90">{message.senderName}</span>
                          <span className="text-xs opacity-60">{formatTimeAgo(message.sentAt)}</span>
                      </div>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      {!message.isRead && (
                        <div className="flex justify-end mt-1">
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

                {match.messages.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                    <p className="text-blue-300">Nenhuma mensagem ainda</p>
                  </div>
                )}
              </Card>
            )}

            {selectedTab === 'timeline' && (
              <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Linha do Tempo
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-blue-700/50"></div>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-white font-medium">Match criado</p>
                      <p className="text-blue-300 text-sm">{formatDate(match.matchedAt)}</p>
                      <p className="text-blue-400 text-xs mt-1">Os usuários deram match mútuo</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
                        <Send className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="w-0.5 h-16 bg-blue-700/50"></div>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-white font-medium">Primeira mensagem</p>
                      <p className="text-blue-300 text-sm">{formatDate(match.stats.conversationStarted)}</p>
                      <p className="text-blue-400 text-xs mt-1">A conversa foi iniciada</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-white font-medium">Última atividade</p>
                      <p className="text-blue-300 text-sm">{formatDate(match.stats.lastActivity)}</p>
                      <p className="text-blue-400 text-xs mt-1">Atividade mais recente registrada</p>
                    </div>
                  </div>
                </div>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white justify-start"
                  onClick={() => setLocation(`/admin/users/${match.user1.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver {match.user1.name}
                </Button>
                
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white justify-start"
                  onClick={() => setLocation(`/admin/users/${match.user2.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver {match.user2.name}
                </Button>
                
                <Button
                  className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50 justify-start"
                  variant="outline"
                  onClick={() => toast({ title: "Em breve", description: "Funcionalidade em desenvolvimento" })}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ver Todas Mensagens
                </Button>
                
                <Button
                  className="w-full border-red-600/50 text-red-300 hover:bg-red-700/50 justify-start"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja desfazer este match?')) {
                      deleteMatchMutation.mutate();
                    }
                  }}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Desfazer Match
                </Button>
              </div>
            </Card>

            {/* Compatibility Card */}
            <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border-purple-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Compatibilidade</h3>
              
              <div className="text-center">
                <div className="relative inline-block">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-blue-900/50"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - match.compatibility / 100)}`}
                      className="text-pink-500 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{match.compatibility}%</span>
                  </div>
                </div>
                <p className="text-blue-300 text-sm mt-4">
                  {match.compatibility >= 80 ? '🔥 Excelente compatibilidade!' : 
                   match.compatibility >= 60 ? '✨ Boa compatibilidade' : 
                   '⚡ Compatibilidade moderada'}
                </p>
              </div>
            </Card>

            {/* Reports Card */}
            {match.reports && match.reports.length > 0 && (
              <Card className="p-6 bg-red-900/20 backdrop-blur-sm border-red-700/50">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Denúncias
                </h3>
                <p className="text-red-300 text-sm">
                  {match.reports.length} denúncia(s) registrada(s)
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-3 border-red-600/50 text-red-300 hover:bg-red-700/50"
                  onClick={() => toast({ title: "Em breve", description: "Ver detalhes das denúncias" })}
                >
                  Ver Detalhes
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 58, 138, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </AdminLayout>
  );
}

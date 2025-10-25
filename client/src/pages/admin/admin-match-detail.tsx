import { useEffect } from "react";
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
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMatchDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: match, isLoading, error } = useQuery({
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
        title: "Sucesso",
        description: "Match removido com sucesso"
      });
      setLocation("/admin/matches");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível remover o match",
        variant: "destructive"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Inativo</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Bloqueado</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{status}</Badge>;
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
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias atrás`;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes do Match">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="h-64 bg-blue-800/50 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Erro ao carregar match">
        <Card className="p-8 bg-red-900/50 backdrop-blur-sm border-red-700/50 text-center">
          <p className="text-red-200 mb-4">Erro ao carregar os detalhes do match.</p>
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
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
          <p className="text-blue-200">Match não encontrado.</p>
          <Button
            onClick={() => setLocation("/admin/matches")}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            Voltar à lista
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Match: ${match.user1.name} + ${match.user2.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/matches")}
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Match #{match.id}</h1>
              {getStatusBadge(match.status)}
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {match.compatibility}% compatibilidade
              </Badge>
            </div>
          </div>

          <Button
            onClick={() => deleteMatchMutation.mutate()}
            disabled={deleteMatchMutation.isPending}
            variant="outline"
            className="border-red-600/50 text-red-300 hover:bg-red-700/50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Remover Match
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Users Info */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Usuários do Match
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User 1 */}
                <div className="flex items-start gap-4 p-4 bg-blue-700/30 rounded-lg">
                  <img
                    src={match.user1.photo}
                    alt={match.user1.name}
                    className="w-16 h-16 rounded-full bg-blue-700/50"
                  />
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
                    <p className="text-blue-200 text-sm">{match.user1.profession}</p>
                    <p className="text-blue-300 text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {match.user1.location}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setLocation(`/admin/users/${match.user1.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver Perfil
                    </Button>
                  </div>
                </div>

                {/* User 2 */}
                <div className="flex items-start gap-4 p-4 bg-blue-700/30 rounded-lg">
                  <img
                    src={match.user2.photo}
                    alt={match.user2.name}
                    className="w-16 h-16 rounded-full bg-blue-700/50"
                  />
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
                    <p className="text-blue-200 text-sm">{match.user2.profession}</p>
                    <p className="text-blue-300 text-xs flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {match.user2.location}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setLocation(`/admin/users/${match.user2.id}`)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver Perfil
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Messages */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Histórico de Mensagens ({match.messages.length})
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {match.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === match.user1.id ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === match.user1.id
                          ? 'bg-blue-700/50 text-white'
                          : 'bg-purple-600/50 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">{message.senderName}</span>
                        <span className="text-xs opacity-70">{formatTimeAgo(message.sentAt)}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {!message.isRead && (
                        <div className="flex justify-end mt-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Stats */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Estatísticas do Match</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Status:</span>
                  {getStatusBadge(match.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Compatibilidade:</span>
                  <span className="text-white font-bold">{match.compatibility}%</span>
                </div>
                <div>
                  <span className="text-blue-200 text-sm">Match criado:</span>
                  <p className="text-white">{formatDate(match.matchedAt)}</p>
                </div>
                <div>
                  <span className="text-blue-200 text-sm">Última atividade:</span>
                  <p className="text-white">{formatDate(match.stats.lastActivity)}</p>
                </div>
                <div>
                  <span className="text-blue-200 text-sm">Conversa iniciada:</span>
                  <p className="text-white">{formatDate(match.stats.conversationStarted)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Total mensagens:</span>
                  <span className="text-white font-bold">{match.stats.totalMessages}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Tempo resposta:</span>
                  <span className="text-white font-bold">{match.stats.responseTime}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  onClick={() => setLocation(`/admin/messages?match=${match.id}`)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ver Todas Mensagens
                </Button>
                
                <Button
                  className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/users/${match.user1.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver {match.user1.name}
                </Button>
                
                <Button
                  className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/users/${match.user2.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver {match.user2.name}
                </Button>
                
                <Button
                  className="w-full border-red-600/50 text-red-300 hover:bg-red-700/50"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja remover este match?')) {
                      deleteMatchMutation.mutate();
                    }
                  }}
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Desfazer Match
                </Button>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Match criado</p>
                    <p className="text-blue-300 text-xs">{formatDate(match.matchedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Primeira mensagem</p>
                    <p className="text-blue-300 text-xs">{formatDate(match.stats.conversationStarted)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Última atividade</p>
                    <p className="text-blue-300 text-xs">{formatDate(match.stats.lastActivity)}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
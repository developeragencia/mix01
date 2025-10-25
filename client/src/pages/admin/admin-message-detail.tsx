import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  MessageSquare,
  User,
  Calendar,
  AlertTriangle,
  Trash2,
  Ban,
  Eye,
  Flag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminMessageDetail() {
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

  const { data: message, isLoading } = useQuery({
    queryKey: ['/api/admin/messages', id],
    queryFn: async () => {
      // TODO: Connect to real database
      return {
        id: parseInt(id || '1'),
        match: {
          id: 1,
          user1: {
            id: 1,
            name: "Maria Silva",
            photo: "/api/placeholder/64/64",
            verified: true
          },
          user2: {
            id: 2,
            name: "João Santos", 
            photo: "/api/placeholder/64/64",
            verified: true
          }
        },
        sender: {
          id: 1,
          name: "Maria Silva",
          photo: "/api/placeholder/64/64"
        },
        content: "Oi João! Tudo bem? Vi que você também trabalha com tecnologia. Que legal! Sempre tive interesse em conhecer pessoas da área tech.",
        sentAt: "2024-01-28T14:30:00Z",
        isRead: true,
        readAt: "2024-01-28T14:32:00Z",
        status: "active",
        reports: [
          {
            id: 1,
            reportedBy: {
              id: 2,
              name: "João Santos"
            },
            reason: "spam",
            description: "Mensagem repetitiva enviada várias vezes",
            reportedAt: "2024-01-28T15:00:00Z",
            status: "pending"
          }
        ],
        metadata: {
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          deviceType: "mobile",
          location: "São Paulo, SP"
        },
        isDeleted: false,
        isBlocked: false
      };
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async () => {
      // TODO: Connect to real API
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Sucesso",
        description: "Mensagem removida com sucesso"
      });
      setLocation("/admin/messages");
    }
  });

  const blockMessageMutation = useMutation({
    mutationFn: async () => {
      // TODO: Connect to real API  
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages', id] });
      toast({
        title: "Sucesso",
        description: "Mensagem bloqueada"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Ativa</Badge>;
      case 'deleted':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Removida</Badge>;
      case 'blocked':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Bloqueada</Badge>;
      case 'reported':
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Denunciada</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{status}</Badge>;
    }
  };

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Resolvido</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Descartado</Badge>;
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

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes da Mensagem">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="h-64 bg-blue-800/50 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!message) {
    return (
      <AdminLayout title="Mensagem não encontrada">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
          <p className="text-blue-200">Mensagem não encontrada.</p>
          <Button
            onClick={() => setLocation("/admin/messages")}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            Voltar à lista
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Mensagem de ${message.sender.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/messages")}
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Mensagem #{message.id}</h1>
              {getStatusBadge(message.status)}
              {message.reports.length > 0 && (
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                  <Flag className="w-3 h-3 mr-1" />
                  {message.reports.length} denúncia(s)
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {!message.isBlocked && (
              <Button
                onClick={() => blockMessageMutation.mutate()}
                disabled={blockMessageMutation.isPending}
                variant="outline"
                className="border-yellow-600/50 text-yellow-300 hover:bg-yellow-700/50"
              >
                <Ban className="w-4 h-4 mr-2" />
                Bloquear
              </Button>
            )}
            <Button
              onClick={() => {
                if (confirm('Tem certeza que deseja remover esta mensagem?')) {
                  deleteMessageMutation.mutate();
                }
              }}
              disabled={deleteMessageMutation.isPending}
              variant="outline"
              className="border-red-600/50 text-red-300 hover:bg-red-700/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remover
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Content */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conteúdo da Mensagem
              </h3>
              
              <div className="bg-blue-700/30 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={message.sender.photo}
                    alt={message.sender.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="text-white font-medium">{message.sender.name}</h4>
                    <p className="text-blue-300 text-sm">{formatDate(message.sentAt)}</p>
                  </div>
                </div>
                <p className="text-white leading-relaxed">{message.content}</p>
                
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="text-blue-300">
                    Enviada: {formatDate(message.sentAt)}
                  </span>
                  {message.isRead && message.readAt && (
                    <span className="text-green-300">
                      Lida: {formatDate(message.readAt)}
                    </span>
                  )}
                </div>
              </div>
            </Card>

            {/* Match Context */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Contexto do Match</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-700/30 rounded-lg">
                  <img
                    src={message.match.user1.photo}
                    alt={message.match.user1.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-white font-medium">{message.match.user1.name}</h4>
                    {message.match.user1.verified && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs mt-1">
                        Verificado
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-700/30 rounded-lg">
                  <img
                    src={message.match.user2.photo}
                    alt={message.match.user2.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="text-white font-medium">{message.match.user2.name}</h4>
                    {message.match.user2.verified && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs mt-1">
                        Verificado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                onClick={() => setLocation(`/admin/matches/${message.match.id}`)}
              >
                Ver Match Completo
              </Button>
            </Card>

            {/* Reports */}
            {message.reports.length > 0 && (
              <Card className="p-6 bg-red-800/20 backdrop-blur-sm border-red-700/50">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Denúncias ({message.reports.length})
                </h3>
                
                <div className="space-y-4">
                  {message.reports.map((report) => (
                    <div key={report.id} className="bg-red-700/20 p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-medium">Denunciado por: {report.reportedBy.name}</h4>
                          {getReportStatusBadge(report.status)}
                        </div>
                        <span className="text-red-300 text-sm">{formatDate(report.reportedAt)}</span>
                      </div>
                      <p className="text-red-200 text-sm mb-2">
                        <strong>Motivo:</strong> {report.reason}
                      </p>
                      <p className="text-red-200 text-sm">
                        <strong>Descrição:</strong> {report.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Message Info */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Informações</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Status:</span>
                  {getStatusBadge(message.status)}
                </div>
                <div>
                  <span className="text-blue-200 text-sm">Enviada em:</span>
                  <p className="text-white">{formatDate(message.sentAt)}</p>
                </div>
                {message.isRead && message.readAt && (
                  <div>
                    <span className="text-blue-200 text-sm">Lida em:</span>
                    <p className="text-white">{formatDate(message.readAt)}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Denúncias:</span>
                  <span className="text-white font-bold">{message.reports.length}</span>
                </div>
              </div>
            </Card>

            {/* Sender Info */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Remetente</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={message.sender.photo}
                  alt={message.sender.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="text-white font-medium">{message.sender.name}</h4>
                  <p className="text-blue-200 text-sm">ID: {message.sender.id}</p>
                </div>
              </div>
              
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                onClick={() => setLocation(`/admin/users/${message.sender.id}`)}
              >
                <User className="w-4 h-4 mr-2" />
                Ver Perfil
              </Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  onClick={() => setLocation(`/admin/matches/${message.match.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Match
                </Button>
                
                <Button
                  className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/messages?match=${message.match.id}`)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Outras Mensagens
                </Button>
                
                {message.reports.length > 0 && (
                  <Button
                    className="w-full border-orange-600/50 text-orange-300 hover:bg-orange-700/50"
                    variant="outline"
                    onClick={() => setLocation(`/admin/reports?message=${message.id}`)}
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Ver Denúncias
                  </Button>
                )}
              </div>
            </Card>

            {/* Metadata */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Metadados</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-blue-200">IP Address:</span>
                  <p className="text-white font-mono">{message.metadata.ipAddress}</p>
                </div>
                <div>
                  <span className="text-blue-200">Device:</span>
                  <p className="text-white capitalize">{message.metadata.deviceType}</p>
                </div>
                <div>
                  <span className="text-blue-200">Localização:</span>
                  <p className="text-white">{message.metadata.location}</p>
                </div>
                <div>
                  <span className="text-blue-200">User Agent:</span>
                  <p className="text-white text-xs break-all">{message.metadata.userAgent}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
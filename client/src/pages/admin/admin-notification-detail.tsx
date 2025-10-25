import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Bell,
  Users,
  Target,
  BarChart3,
  Send,
  Eye,
  Clock,
  CheckCircle,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminNotificationDetail() {
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

  const { data: notification, isLoading } = useQuery({
    queryKey: ['/api/admin/notifications', id],
    queryFn: async () => {
      // TODO: Connect to real database
      return {
        id: parseInt(id || '1'),
        title: "Promoção Especial de Inverno",
        message: "🔥 50% OFF na assinatura Premium! Aproveite o inverno para encontrar seu amor verdadeiro. Oferta válida até 31/01/2024.",
        type: "promotional",
        status: "sent",
        targeting: {
          segment: "free_users",
          userCount: 1247,
          criteria: {
            subscription: "free",
            lastLogin: "last_7_days",
            ageRange: "18-35",
            location: "Brazil"
          }
        },
        schedule: {
          type: "immediate",
          scheduledFor: null,
          timezone: "America/Sao_Paulo"
        },
        delivery: {
          channels: ["push", "email"],
          pushSent: 1134,
          emailSent: 1203,
          pushDelivered: 1089,
          emailDelivered: 1178,
          pushOpened: 234,
          emailOpened: 301,
          clicked: 89,
          converted: 23
        },
        createdBy: {
          id: 1,
          name: "Admin MIX",
          email: "admin@mixapp.com"
        },
        createdAt: "2024-01-28T09:00:00Z",
        sentAt: "2024-01-28T09:30:00Z",
        completedAt: "2024-01-28T10:15:00Z",
        metadata: {
          campaign: "winter_promo_2024",
          source: "admin_panel",
          budget: 500.00,
          cpa: 21.74
        }
      };
    }
  });

  const resendNotificationMutation = useMutation({
    mutationFn: async () => {
      // TODO: Connect to real API
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications', id] });
      toast({
        title: "Sucesso",
        description: "Notificação reenviada"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Rascunho</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Agendada</Badge>;
      case 'sending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Enviando</Badge>;
      case 'sent':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Enviada</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Falhou</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'promotional':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Promocional</Badge>;
      case 'transactional':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Transacional</Badge>;
      case 'marketing':
        return <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">Marketing</Badge>;
      case 'system':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Sistema</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{type}</Badge>;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const calculateDeliveryRate = (delivered: number, sent: number) => {
    return sent > 0 ? ((delivered / sent) * 100).toFixed(1) : '0.0';
  };

  const calculateOpenRate = (opened: number, delivered: number) => {
    return delivered > 0 ? ((opened / delivered) * 100).toFixed(1) : '0.0';
  };

  const calculateClickRate = (clicked: number, opened: number) => {
    return opened > 0 ? ((clicked / opened) * 100).toFixed(1) : '0.0';
  };

  const calculateConversionRate = (converted: number, clicked: number) => {
    return clicked > 0 ? ((converted / clicked) * 100).toFixed(1) : '0.0';
  };

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes da Notificação">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="h-64 bg-blue-800/50 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!notification) {
    return (
      <AdminLayout title="Notificação não encontrada">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
          <p className="text-blue-200">Notificação não encontrada.</p>
          <Button
            onClick={() => setLocation("/admin/notifications")}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            Voltar à lista
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Notificação: ${notification.title}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/notifications")}
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{notification.title}</h1>
              {getStatusBadge(notification.status)}
              {getTypeBadge(notification.type)}
            </div>
          </div>

          {notification.status === 'sent' && (
            <Button
              onClick={() => resendNotificationMutation.mutate()}
              disabled={resendNotificationMutation.isPending}
              variant="outline"
              className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
            >
              <Send className="w-4 h-4 mr-2" />
              Reenviar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Content */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Conteúdo da Mensagem
              </h3>
              
              <div className="bg-blue-700/30 p-4 rounded-lg">
                <h4 className="text-white font-bold text-lg mb-2">{notification.title}</h4>
                <p className="text-blue-200 leading-relaxed">{notification.message}</p>
              </div>
            </Card>

            {/* Targeting */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Segmentação
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-blue-200 text-sm">Segmento</label>
                  <p className="text-white font-medium capitalize">{notification.targeting.segment.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Usuários alcançados</label>
                  <p className="text-white font-bold text-xl">{notification.targeting.userCount.toLocaleString()}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-blue-200 text-sm mb-2 block">Critérios de segmentação</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-700/30 p-3 rounded-lg">
                      <span className="text-blue-200 text-sm">Assinatura:</span>
                      <p className="text-white capitalize">{notification.targeting.criteria.subscription}</p>
                    </div>
                    <div className="bg-blue-700/30 p-3 rounded-lg">
                      <span className="text-blue-200 text-sm">Último login:</span>
                      <p className="text-white">{notification.targeting.criteria.lastLogin.replace('_', ' ')}</p>
                    </div>
                    <div className="bg-blue-700/30 p-3 rounded-lg">
                      <span className="text-blue-200 text-sm">Faixa etária:</span>
                      <p className="text-white">{notification.targeting.criteria.ageRange} anos</p>
                    </div>
                    <div className="bg-blue-700/30 p-3 rounded-lg">
                      <span className="text-blue-200 text-sm">Localização:</span>
                      <p className="text-white">{notification.targeting.criteria.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Performance Metrics */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Métricas de Performance
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-700/30 p-4 rounded-lg text-center">
                  <p className="text-blue-200 text-sm">Push Enviados</p>
                  <p className="text-white font-bold text-xl">{notification.delivery.pushSent.toLocaleString()}</p>
                </div>
                <div className="bg-blue-700/30 p-4 rounded-lg text-center">
                  <p className="text-blue-200 text-sm">Email Enviados</p>
                  <p className="text-white font-bold text-xl">{notification.delivery.emailSent.toLocaleString()}</p>
                </div>
                <div className="bg-green-700/30 p-4 rounded-lg text-center">
                  <p className="text-green-200 text-sm">Push Entregues</p>
                  <p className="text-white font-bold text-xl">{notification.delivery.pushDelivered.toLocaleString()}</p>
                  <p className="text-green-300 text-xs">{calculateDeliveryRate(notification.delivery.pushDelivered, notification.delivery.pushSent)}%</p>
                </div>
                <div className="bg-green-700/30 p-4 rounded-lg text-center">
                  <p className="text-green-200 text-sm">Email Entregues</p>
                  <p className="text-white font-bold text-xl">{notification.delivery.emailDelivered.toLocaleString()}</p>
                  <p className="text-green-300 text-xs">{calculateDeliveryRate(notification.delivery.emailDelivered, notification.delivery.emailSent)}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-yellow-700/30 p-4 rounded-lg text-center">
                  <p className="text-yellow-200 text-sm">Push Abertos</p>
                  <p className="text-white font-bold text-xl">{notification.delivery.pushOpened.toLocaleString()}</p>
                  <p className="text-yellow-300 text-xs">{calculateOpenRate(notification.delivery.pushOpened, notification.delivery.pushDelivered)}%</p>
                </div>
                <div className="bg-yellow-700/30 p-4 rounded-lg text-center">
                  <p className="text-yellow-200 text-sm">Email Abertos</p>
                  <p className="text-white font-bold text-xl">{notification.delivery.emailOpened.toLocaleString()}</p>
                  <p className="text-yellow-300 text-xs">{calculateOpenRate(notification.delivery.emailOpened, notification.delivery.emailDelivered)}%</p>
                </div>
                <div className="bg-purple-700/30 p-4 rounded-lg text-center">
                  <p className="text-purple-200 text-sm">Cliques</p>
                  <p className="text-white font-bold text-xl">{notification.delivery.clicked.toLocaleString()}</p>
                  <p className="text-purple-300 text-xs">{calculateClickRate(notification.delivery.clicked, notification.delivery.pushOpened + notification.delivery.emailOpened)}%</p>
                </div>
                <div className="bg-pink-700/30 p-4 rounded-lg text-center">
                  <p className="text-pink-200 text-sm">Conversões</p>
                  <p className="text-white font-bold text-xl">{notification.delivery.converted.toLocaleString()}</p>
                  <p className="text-pink-300 text-xs">{calculateConversionRate(notification.delivery.converted, notification.delivery.clicked)}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Timeline */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-white text-sm">Criada</p>
                    <p className="text-blue-300 text-xs">{formatDate(notification.createdAt)}</p>
                  </div>
                </div>
                
                {notification.sentAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-white text-sm">Enviada</p>
                      <p className="text-blue-300 text-xs">{formatDate(notification.sentAt)}</p>
                    </div>
                  </div>
                )}
                
                {notification.completedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div>
                      <p className="text-white text-sm">Finalizada</p>
                      <p className="text-blue-300 text-xs">{formatDate(notification.completedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Creator Info */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Criado por</h3>
              
              <div className="space-y-2">
                <p className="text-white font-medium">{notification.createdBy.name}</p>
                <p className="text-blue-200 text-sm">{notification.createdBy.email}</p>
                <p className="text-blue-300 text-xs">ID: {notification.createdBy.id}</p>
              </div>
            </Card>

            {/* Campaign Metrics */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Métricas da Campanha</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Orçamento:</span>
                  <span className="text-white font-bold">{formatCurrency(notification.metadata.budget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">CPA:</span>
                  <span className="text-white font-bold">{formatCurrency(notification.metadata.cpa)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">ROI:</span>
                  <span className="text-green-300 font-bold">
                    {((notification.delivery.converted * 29.90) / notification.metadata.budget * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  onClick={() => setLocation(`/admin/notifications/create?template=${notification.id}`)}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Duplicar Notificação
                </Button>
                
                <Button
                  className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/users?segment=${notification.targeting.segment}`)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Ver Usuários Segmentados
                </Button>
                
                <Button
                  className="w-full border-purple-600/50 text-purple-300 hover:bg-purple-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/analytics?campaign=${notification.metadata.campaign}`)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics da Campanha
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
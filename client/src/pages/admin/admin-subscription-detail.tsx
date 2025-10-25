import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft,
  Crown,
  Star,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  Clock,
  Ban,
  CheckCircle,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Eye
} from "lucide-react";

interface SubscriptionDetail {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  isActive: boolean;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  paymentHistory: Array<{
    id: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

export default function AdminSubscriptionDetail() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: subscription, isLoading, refetch } = useQuery<SubscriptionDetail>({
    queryKey: ['/api/admin/subscription-details', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/subscription-details/${id}`);
      if (!response.ok) throw new Error('Failed to fetch subscription details');
      return response.json();
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/subscriptions/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to cancel subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscription-details', id] });
      toast({
        title: "✅ Assinatura Cancelada",
        description: "A assinatura foi cancelada com sucesso",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao cancelar assinatura",
        variant: "destructive"
      });
    }
  });

  const reactivateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/subscriptions/${id}/reactivate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to reactivate subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscription-details', id] });
      toast({
        title: "✅ Assinatura Reativada",
        description: "A assinatura foi reativada com sucesso",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao reativar assinatura",
        variant: "destructive"
      });
    }
  });

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
    }).format(amount / 100);
  };

  const getPlanIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'premium':
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'vip':
        return <Star className="w-6 h-6 text-purple-400" />;
      default:
        return <CreditCard className="w-6 h-6 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300';
      case 'canceled':
        return 'bg-red-500/20 text-red-300';
      case 'past_due':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes da Assinatura">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!subscription) {
    return (
      <AdminLayout title="Assinatura Não Encontrada">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
          <h3 className="text-lg font-semibold text-white mb-2">Assinatura não encontrada</h3>
          <p className="text-blue-200 mb-4">A assinatura solicitada não existe ou foi removida.</p>
          <Button
            onClick={() => setLocation("/admin/subscriptions")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar às Assinaturas
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Detalhes da Assinatura">
      <div className="space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Header with Back Button */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/admin/subscriptions")}
                className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                {getPlanIcon(subscription.planType)}
                <h2 className="text-lg font-semibold text-white">
                  Assinatura #{subscription.id}
                </h2>
              </div>
            </div>
            <Badge className={`${getStatusColor(subscription.status)} text-sm`}>
              {subscription.status === 'active' ? 'Ativa' : 
               subscription.status === 'canceled' ? 'Cancelada' : 'Pendente'}
            </Badge>
          </div>
        </Card>

        {/* Subscription Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informações do Usuário
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-200 text-sm">Nome:</span>
                <span className="text-white text-sm font-medium">{subscription.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200 text-sm">Email:</span>
                <span className="text-white text-sm">{subscription.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200 text-sm">ID do Usuário:</span>
                <span className="text-white text-sm">#{subscription.userId}</span>
              </div>
              <div className="pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLocation(`/admin/user-details/${subscription.userId}`)}
                  className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50 text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Perfil do Usuário
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Detalhes da Assinatura
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-blue-200 text-sm">Plano:</span>
                <span className="text-white text-sm font-medium">{subscription.planType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200 text-sm">Status:</span>
                <Badge className={`${getStatusColor(subscription.status)} text-xs`}>
                  {subscription.isActive ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200 text-sm">Valor:</span>
                <span className="text-white text-sm font-bold">{formatCurrency(subscription.amount)}/mês</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200 text-sm">Stripe ID:</span>
                <span className="text-white text-xs font-mono truncate max-w-32">
                  {subscription.stripeSubscriptionId}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Period Information */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Período da Assinatura
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Início</div>
              <div className="text-white text-sm font-medium">
                {formatDate(subscription.currentPeriodStart)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Próxima Cobrança</div>
              <div className="text-white text-sm font-medium">
                {formatDate(subscription.currentPeriodEnd)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Cancelamento</div>
              <div className="text-white text-sm font-medium">
                {subscription.cancelAtPeriodEnd ? 'Fim do período' : 'Não agendado'}
              </div>
            </div>
          </div>
        </Card>

        {/* Payment History */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Histórico de Pagamentos
          </h3>
          <div className="space-y-2">
            {subscription.paymentHistory && subscription.paymentHistory.length > 0 ? (
              subscription.paymentHistory.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-2 bg-blue-700/30 rounded">
                  <div>
                    <div className="text-white text-sm">{formatCurrency(payment.amount)}</div>
                    <div className="text-blue-200 text-xs">{formatDate(payment.date)}</div>
                  </div>
                  <Badge className={`text-xs ${payment.status === 'paid' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {payment.status === 'paid' ? 'Pago' : 'Falhou'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center text-blue-200 text-sm py-4">
                Nenhum histórico de pagamento disponível
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Ações Administrativas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Dados
            </Button>
            
            {subscription.isActive ? (
              <Button
                onClick={() => {
                  if (confirm('Tem certeza que deseja cancelar esta assinatura?')) {
                    cancelSubscriptionMutation.mutate();
                  }
                }}
                disabled={cancelSubscriptionMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                <Ban className="w-4 h-4 mr-2" />
                {cancelSubscriptionMutation.isPending ? 'Cancelando...' : 'Cancelar Assinatura'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (confirm('Tem certeza que deseja reativar esta assinatura?')) {
                    reactivateSubscriptionMutation.mutate();
                  }
                }}
                disabled={reactivateSubscriptionMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {reactivateSubscriptionMutation.isPending ? 'Reativando...' : 'Reativar Assinatura'}
              </Button>
            )}
            
            <Button
              onClick={() => window.open(`https://dashboard.stripe.com/subscriptions/${subscription.stripeSubscriptionId}`, '_blank')}
              variant="outline"
              className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50 text-sm"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Ver no Stripe
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, adminRequest } from "@/lib/admin-fetch";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Crown,
  Star,
  Calendar,
  DollarSign,
  Eye,
  Ban,
  CheckCircle,
  Plus,
  Edit
} from "lucide-react";

interface Subscription {
  id: number;
  userId: number;
  userName: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  stripeSubscriptionId: string;
  isActive: boolean;
}

export default function AdminSubscriptionsNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['/api/admin/subscriptions', searchTerm, statusFilter],
    staleTime: 20000, // Cache por 20 segundos
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const response = await adminFetch(`/api/admin/subscriptions?${params}`);
      if (!response.ok) throw new Error('Failed to fetch subscriptions');
      return response.json();
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      const response = await adminRequest(`/api/admin/subscriptions/${subscriptionId}/cancel`, 'POST');
      if (!response.ok) throw new Error('Failed to cancel subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscriptions'] });
      toast({
        title: "✅ Assinatura Cancelada",
        description: "Assinatura foi cancelada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao cancelar assinatura",
        variant: "destructive"
      });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100); // Convert from cents
  };

  const getPlanIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'premium':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'vip':
        return <Star className="w-4 h-4 text-purple-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-blue-400" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Assinaturas">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Assinaturas">
      <div className="space-y-3 w-full max-w-full overflow-x-hidden">
        {/* Header com Botão Criar */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-pink-400" />
              Assinaturas
            </h2>
            <Button
              onClick={() => setLocation('/admin/subscriptions/create')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Assinatura
            </Button>
          </div>
        </Card>

        {/* Search and Filters */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar assinaturas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-700/50 border-blue-600/50 text-white text-sm w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className="text-xs whitespace-nowrap"
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className="text-xs whitespace-nowrap"
              >
                Ativas
              </Button>
              <Button
                variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('cancelled')}
                className="text-xs whitespace-nowrap"
              >
                Canceladas
              </Button>
            </div>
          </div>
        </Card>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {subscriptions.map((subscription: Subscription) => (
            <Card key={subscription.id} className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all w-full">
              {/* Subscription Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getPlanIcon(subscription.planType)}
                    <h3 className="text-sm font-semibold text-white truncate">
                      {subscription.userName}
                    </h3>
                  </div>
                  <p className="text-xs text-blue-200">Plano {subscription.planType}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant={subscription.isActive ? "default" : "secondary"} 
                    className={`text-xs ${subscription.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                  >
                    {subscription.isActive ? 'Ativa' : 'Cancelada'}
                  </Badge>
                  <span className="text-xs text-blue-300 font-semibold">
                    {formatCurrency(subscription.amount)}
                  </span>
                </div>
              </div>

              {/* Subscription Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Início:</span>
                  <span className="text-white">{formatDate(subscription.startDate)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Vencimento:</span>
                  <span className="text-white">{formatDate(subscription.endDate)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Stripe ID:</span>
                  <span className="text-white font-mono text-xs truncate max-w-24">
                    {subscription.stripeSubscriptionId}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setLocation(`/admin/subscription-details/${subscription.id}`)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLocation(`/admin/subscriptions/${subscription.id}/edit`)}
                  className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 text-xs"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                {subscription.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja cancelar esta assinatura?')) {
                        cancelSubscriptionMutation.mutate(subscription.id);
                      }
                    }}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs"
                  >
                    <Ban className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
            <CreditCard className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhuma assinatura encontrada</h3>
            <p className="text-blue-200">Ajuste os filtros ou tente uma busca diferente.</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
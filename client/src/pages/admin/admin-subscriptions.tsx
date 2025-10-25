import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Crown, 
  Star, 
  DollarSign,
  Calendar,
  TrendingUp,
  Filter,
  Eye,
  RefreshCw,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSubscriptions() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['/api/admin/subscriptions', searchTerm, statusFilter],
    queryFn: async () => {
      const response = await fetch(`/api/admin/subscriptions?search=${searchTerm}&status=${statusFilter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }
      return response.json();
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/subscription-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/subscription-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch subscription stats');
      }
      return response.json();
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      // Mock API call to cancel subscription
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscriptions'] });
      toast({
        title: "Sucesso",
        description: "Assinatura cancelada com sucesso"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Ativa</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Cancelada</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Em Atraso</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };

  const getPlanBadge = (planType: string) => {
    switch (planType) {
      case 'vip':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      case 'premium':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Star className="w-3 h-3 mr-1" />Premium</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Grátis</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredSubscriptions = subscriptions?.filter(sub => {
    const searchText = `${sub.user.name} ${sub.user.email}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Assinaturas">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-blue-800/50 rounded-lg"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Assinaturas">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-blue-200 text-sm">Receita Mensal</p>
                <p className="text-white text-xl font-bold">R$ {stats?.monthlyRevenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-blue-200 text-sm">Assinaturas Ativas</p>
                <p className="text-white text-xl font-bold">{stats?.activeSubscriptions?.toLocaleString('pt-BR') || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-blue-200 text-sm">Usuários Premium</p>
                <p className="text-white text-xl font-bold">{stats?.premiumUsers || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-blue-200 text-sm">Usuários VIP</p>
                <p className="text-white text-xl font-bold">{stats?.vipUsers || '0'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="text-center">
              <p className="text-blue-200 text-sm">Taxa de Conversão</p>
              <p className="text-white text-2xl font-bold">{stats?.conversionRate || '0'}%</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="text-center">
              <p className="text-blue-200 text-sm">Taxa de Churn</p>
              <p className="text-white text-2xl font-bold">{stats?.churnRate || '0'}%</p>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="text-center">
              <p className="text-blue-200 text-sm">Total de Assinaturas</p>
              <p className="text-white text-2xl font-bold">{stats?.totalSubscriptions?.toLocaleString('pt-BR') || '0'}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar por nome ou email do usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-blue-700/50 border border-blue-600/50 rounded-md text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativas</option>
                <option value="canceled">Canceladas</option>
                <option value="past_due">Em Atraso</option>
              </select>
              <Button variant="outline" className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Subscriptions List */}
        <div className="space-y-4">
          {filteredSubscriptions?.map((subscription) => (
            <Card key={subscription.id} className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={subscription.user.photo}
                    alt={subscription.user.name}
                    className="w-12 h-12 rounded-full bg-blue-700/50"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-semibold">{subscription.user.name}</h3>
                      {getPlanBadge(subscription.planType)}
                      {getStatusBadge(subscription.status)}
                    </div>
                    <p className="text-blue-200 text-sm">{subscription.user.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-blue-300">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        R$ {subscription.amount.toFixed(2)}/{subscription.planType === 'premium' ? 'mês' : 'mês'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                      </span>
                      {subscription.cancelAtPeriodEnd && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          Cancelará no fim do período
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                    onClick={() => setLocation(`/admin/subscriptions/${subscription.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600/50 text-green-300 hover:bg-green-700/50"
                    onClick={() => window.open(`https://dashboard.stripe.com/subscriptions/${subscription.stripeSubscriptionId}`, '_blank')}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Stripe
                  </Button>

                  {subscription.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600/50 text-red-300 hover:bg-red-700/50"
                      onClick={() => cancelSubscriptionMutation.mutate(subscription.stripeSubscriptionId)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredSubscriptions?.length === 0 && (
          <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
            <p className="text-blue-200">Nenhuma assinatura encontrada com os filtros aplicados.</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
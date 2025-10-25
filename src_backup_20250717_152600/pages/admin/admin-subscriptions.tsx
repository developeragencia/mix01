import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Search, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  RefreshCw,
  Crown,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminSubscriptions() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Mock subscription data
  const subscriptionStats = {
    totalRevenue: 45678.90,
    monthlyRevenue: 12345.67,
    activeSubscriptions: 1234,
    totalSubscribers: 2567,
    conversionRate: 15.4,
    churnRate: 8.2
  };

  const { data: subscriptions = [] } = useQuery({
    queryKey: ["admin-subscriptions", searchTerm, filterStatus, filterPlan],
    queryFn: async () => {
      return [
        {
          id: 1,
          user: {
            id: 123,
            name: "Alex Developer",
            email: "alex@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          plan: "premium",
          planName: "MIX Premium",
          price: 39.90,
          status: "active",
          startDate: "2024-01-15",
          nextBilling: "2024-07-15",
          paymentMethod: "Cartão ****1234",
          totalPaid: 239.40,
          autoRenew: true
        },
        {
          id: 2,
          user: {
            id: 456,
            name: "Maria Silva",
            email: "maria@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2bc?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          plan: "plus",
          planName: "MIX Plus",
          price: 19.90,
          status: "active",
          startDate: "2024-03-01",
          nextBilling: "2024-07-01",
          paymentMethod: "PIX",
          totalPaid: 79.60,
          autoRenew: true
        },
        {
          id: 3,
          user: {
            id: 789,
            name: "João Santos",
            email: "joao@example.com",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          plan: "premium",
          planName: "MIX Premium",
          price: 39.90,
          status: "cancelled",
          startDate: "2024-02-10",
          cancelledDate: "2024-06-10",
          paymentMethod: "Cartão ****5678",
          totalPaid: 159.60,
          autoRenew: false
        },
        {
          id: 4,
          user: {
            id: 321,
            name: "Ana Costa",
            email: "ana@example.com",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          plan: "plus",
          planName: "MIX Plus",
          price: 19.90,
          status: "payment_failed",
          startDate: "2024-05-20",
          nextBilling: "2024-06-20",
          paymentMethod: "Cartão ****9012",
          totalPaid: 19.90,
          autoRenew: true
        }
      ];
    }
  });

  const handleSubscriptionAction = (subscriptionId: number, action: string) => {
    alert(`Ação "${action}" aplicada à assinatura ID: ${subscriptionId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      case "payment_failed":
        return <Badge className="bg-yellow-100 text-yellow-800">Falha no Pagamento</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800">Expirada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "premium":
        return <Badge className="bg-purple-100 text-purple-800 flex items-center"><Crown className="w-3 h-3 mr-1" />Premium</Badge>;
      case "plus":
        return <Badge className="bg-blue-100 text-blue-800">Plus</Badge>;
      case "basic":
        return <Badge className="bg-gray-100 text-gray-800">Básico</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || subscription.status === filterStatus;
    const matchesPlan = filterPlan === "all" || subscription.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <AdminLayout currentPage="subscriptions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Assinaturas</h1>
            <p className="text-gray-600">Acompanhe e gerencie todas as assinaturas da plataforma</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
            <Button>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(subscriptionStats.totalRevenue)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% este mês
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assinantes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionStats.activeSubscriptions.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% este mês
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionStats.conversionRate}%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.1% este mês
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Churn</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionStats.churnRate}%</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  +0.5% este mês
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email do usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativas</option>
                <option value="cancelled">Canceladas</option>
                <option value="payment_failed">Falha no Pagamento</option>
                <option value="expired">Expiradas</option>
              </select>
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos os Planos</option>
                <option value="premium">Premium</option>
                <option value="plus">Plus</option>
                <option value="basic">Básico</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Subscriptions Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Cobrança
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Pago
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={subscription.user.avatar} 
                            alt={subscription.user.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{subscription.user.name}</div>
                          <div className="text-sm text-gray-500">{subscription.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {getPlanBadge(subscription.plan)}
                        <div className="text-sm text-gray-900 mt-1">{formatCurrency(subscription.price)}/mês</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(subscription.status)}
                      <div className="text-xs text-gray-500 mt-1">
                        {subscription.autoRenew ? "Renovação automática" : "Renovação manual"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {subscription.nextBilling ? new Date(subscription.nextBilling).toLocaleDateString('pt-BR') : "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {subscription.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(subscription.totalPaid)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Desde {new Date(subscription.startDate).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/admin/subscriptions/${subscription.id}`)}
                        >
                          Ver Detalhes
                        </Button>
                        {subscription.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSubscriptionAction(subscription.id, "cancel")}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancelar
                          </Button>
                        )}
                        {subscription.status === "payment_failed" && (
                          <Button
                            size="sm"
                            onClick={() => handleSubscriptionAction(subscription.id, "retry_payment")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Tentar Cobrança
                          </Button>
                        )}
                        {subscription.status === "cancelled" && (
                          <Button
                            size="sm"
                            onClick={() => handleSubscriptionAction(subscription.id, "reactivate")}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Reativar
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredSubscriptions.length}</span> assinaturas
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" disabled>Anterior</Button>
            <Button variant="outline">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Próximo</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
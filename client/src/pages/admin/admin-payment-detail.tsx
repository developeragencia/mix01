import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  DollarSign,
  CreditCard,
  Calendar,
  User,
  CheckCircle,
  X,
  RefreshCw,
  ExternalLink,
  Receipt,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPaymentDetail() {
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

  const { data: payment, isLoading } = useQuery({
    queryKey: ['/api/admin/payments', id],
    queryFn: async () => {
      // TODO: Connect to real Stripe API
      return {
        id: id || 'pi_1234567890',
        stripePaymentId: 'pi_1234567890',
        user: {
          id: 1,
          name: "Maria Silva",
          email: "maria@email.com",
          photo: "/api/placeholder/64/64",
          customerId: "cus_1234567890"
        },
        amount: 29.90,
        currency: "BRL",
        status: "succeeded",
        paymentMethod: {
          type: "card",
          brand: "visa",
          last4: "4242",
          expiryMonth: 12,
          expiryYear: 2026
        },
        subscription: {
          id: "sub_1234567890",
          type: "premium",
          status: "active",
          currentPeriodStart: "2024-01-28T00:00:00Z",
          currentPeriodEnd: "2024-02-28T00:00:00Z"
        },
        description: "Assinatura Premium - Janeiro 2024",
        receiptUrl: "https://pay.stripe.com/receipts/...",
        createdAt: "2024-01-28T10:00:00Z",
        paidAt: "2024-01-28T10:00:15Z",
        fees: {
          stripeProcessing: 1.34,
          platformFee: 0.89,
          net: 27.67
        },
        metadata: {
          planType: "premium",
          duration: "monthly",
          source: "mobile_app"
        },
        refunds: [],
        disputes: []
      };
    }
  });

  const refundPaymentMutation = useMutation({
    mutationFn: async ({ amount }: { amount?: number }) => {
      // TODO: Connect to real Stripe refund API
      return { success: true, refundId: 're_1234567890' };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments', id] });
      toast({
        title: "Sucesso",
        description: "Reembolso processado com sucesso"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Falhou</Badge>;
      case 'canceled':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Cancelado</Badge>;
      case 'refunded':
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Reembolsado</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{status}</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: any) => {
    if (method.type === 'card') {
      return (
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          <CreditCard className="w-3 h-3 mr-1" />
          {method.brand.toUpperCase()} •••• {method.last4}
        </Badge>
      );
    }
    return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{method.type}</Badge>;
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

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes do Pagamento">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="h-64 bg-blue-800/50 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!payment) {
    return (
      <AdminLayout title="Pagamento não encontrado">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
          <p className="text-blue-200">Pagamento não encontrado.</p>
          <Button
            onClick={() => setLocation("/admin/payments")}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            Voltar à lista
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Pagamento: ${payment.id}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/payments")}
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{formatCurrency(payment.amount)}</h1>
              {getStatusBadge(payment.status)}
              {getPaymentMethodBadge(payment.paymentMethod)}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
              onClick={() => window.open(`https://dashboard.stripe.com/payments/${payment.stripePaymentId}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver no Stripe
            </Button>
            {payment.receiptUrl && (
              <Button
                variant="outline"
                className="border-green-600/50 text-green-300 hover:bg-green-700/50"
                onClick={() => window.open(payment.receiptUrl, '_blank')}
              >
                <Receipt className="w-4 h-4 mr-2" />
                Recibo
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Info */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Informações do Pagamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-200 text-sm">ID do Pagamento</label>
                  <p className="text-white font-mono text-sm">{payment.id}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">ID Stripe</label>
                  <p className="text-white font-mono text-sm">{payment.stripePaymentId}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Valor</label>
                  <p className="text-white font-bold text-lg">{formatCurrency(payment.amount)}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Moeda</label>
                  <p className="text-white font-medium">{payment.currency}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Descrição</label>
                  <p className="text-white">{payment.description}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Status</label>
                  <div className="mt-1">{getStatusBadge(payment.status)}</div>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Criado em</label>
                  <p className="text-white">{formatDate(payment.createdAt)}</p>
                </div>
                {payment.paidAt && (
                  <div>
                    <label className="text-blue-200 text-sm">Pago em</label>
                    <p className="text-white">{formatDate(payment.paidAt)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* User Info */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Cliente
              </h3>
              
              <div className="flex items-center gap-4">
                <img
                  src={payment.user.photo}
                  alt={payment.user.name}
                  className="w-16 h-16 rounded-full bg-blue-700/50"
                />
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{payment.user.name}</h4>
                  <p className="text-blue-200">{payment.user.email}</p>
                  <p className="text-blue-300 text-sm font-mono">Customer ID: {payment.user.customerId}</p>
                </div>
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                  onClick={() => setLocation(`/admin/users/${payment.user.id}`)}
                >
                  Ver Perfil
                </Button>
              </div>
            </Card>

            {/* Payment Method Details */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Método de Pagamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-200 text-sm">Tipo</label>
                  <p className="text-white capitalize">{payment.paymentMethod.type}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Bandeira</label>
                  <p className="text-white uppercase">{payment.paymentMethod.brand}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Últimos 4 dígitos</label>
                  <p className="text-white font-mono">•••• •••• •••• {payment.paymentMethod.last4}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Validade</label>
                  <p className="text-white">{payment.paymentMethod.expiryMonth.toString().padStart(2, '0')}/{payment.paymentMethod.expiryYear}</p>
                </div>
              </div>
            </Card>

            {/* Subscription Info */}
            {payment.subscription && (
              <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
                <h3 className="text-white text-lg font-semibold mb-4">Assinatura Relacionada</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-blue-200 text-sm">ID da Assinatura</label>
                    <p className="text-white font-mono text-sm">{payment.subscription.id}</p>
                  </div>
                  <div>
                    <label className="text-blue-200 text-sm">Tipo de Plano</label>
                    <p className="text-white capitalize">{payment.subscription.type}</p>
                  </div>
                  <div>
                    <label className="text-blue-200 text-sm">Período Atual</label>
                    <p className="text-white text-sm">
                      {formatDate(payment.subscription.currentPeriodStart)} até {formatDate(payment.subscription.currentPeriodEnd)}
                    </p>
                  </div>
                  <div>
                    <label className="text-blue-200 text-sm">Status</label>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mt-1">
                      {payment.subscription.status === 'active' ? 'Ativa' : payment.subscription.status}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                  onClick={() => setLocation(`/admin/subscriptions/${payment.subscription.id}`)}
                >
                  Ver Assinatura
                </Button>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Breakdown */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Breakdown Financeiro</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Valor bruto:</span>
                  <span className="text-white font-bold">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Taxa Stripe:</span>
                  <span className="text-red-300">-{formatCurrency(payment.fees.stripeProcessing)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Taxa plataforma:</span>
                  <span className="text-red-300">-{formatCurrency(payment.fees.platformFee)}</span>
                </div>
                <hr className="border-blue-700/50" />
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 font-medium">Valor líquido:</span>
                  <span className="text-green-300 font-bold">{formatCurrency(payment.fees.net)}</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  onClick={() => setLocation(`/admin/users/${payment.user.id}`)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Ver Cliente
                </Button>
                
                {payment.subscription && (
                  <Button
                    className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                    variant="outline"
                    onClick={() => setLocation(`/admin/subscriptions/${payment.subscription.id}`)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Assinatura
                  </Button>
                )}
                
                {payment.status === 'succeeded' && payment.refunds.length === 0 && (
                  <Button
                    className="w-full border-orange-600/50 text-orange-300 hover:bg-orange-700/50"
                    variant="outline"
                    onClick={() => {
                      const confirmed = confirm(`Tem certeza que deseja reembolsar ${formatCurrency(payment.amount)}?`);
                      if (confirmed) {
                        refundPaymentMutation.mutate({ amount: payment.amount });
                      }
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reembolsar
                  </Button>
                )}
                
                <Button
                  className="w-full border-green-600/50 text-green-300 hover:bg-green-700/50"
                  variant="outline"
                  onClick={() => window.open(`https://dashboard.stripe.com/payments/${payment.stripePaymentId}`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Dashboard Stripe
                </Button>
              </div>
            </Card>

            {/* Metadata */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Metadados</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-blue-200">Tipo do plano:</span>
                  <p className="text-white capitalize">{payment.metadata.planType}</p>
                </div>
                <div>
                  <span className="text-blue-200">Duração:</span>
                  <p className="text-white capitalize">{payment.metadata.duration}</p>
                </div>
                <div>
                  <span className="text-blue-200">Origem:</span>
                  <p className="text-white capitalize">{payment.metadata.source.replace('_', ' ')}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
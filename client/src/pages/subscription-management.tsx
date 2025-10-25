import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Crown, CreditCard, Calendar, AlertTriangle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionStatus {
  status: string;
  subscriptionType: string;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
  subscription?: any;
}

export default function SubscriptionManagement() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { toast } = useToast();

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch("/api/subscription-status", {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data);
      } else {
        throw new Error("Erro ao carregar status da assinatura");
      }
    } catch (error: any) {
      console.error("Error fetching subscription status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o status da assinatura",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Assinatura Cancelada",
          description: data.message,
        });
        // Refresh subscription status
        await fetchSubscriptionStatus();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao cancelar assinatura");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cancelar a assinatura",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Ativo</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500 text-white">Cancelado</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-500 text-white">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">Grátis</Badge>;
    }
  };

  const getSubscriptionTypeLabel = (type: string) => {
    switch (type) {
      case 'premium':
        return 'Mix Premium';
      case 'vip':
        return 'Mix VIP';
      default:
        return 'Mix Grátis';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="mr-3">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciar Assinatura
          </h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-500" />
                Assinatura Atual
              </CardTitle>
              <CardDescription>
                Status e detalhes da sua assinatura MIX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Plano:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {getSubscriptionTypeLabel(subscriptionStatus?.subscriptionType || 'free')}
                    </span>
                    {getStatusBadge(subscriptionStatus?.status || 'none')}
                  </div>
                </div>

                {subscriptionStatus?.currentPeriodEnd && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {subscriptionStatus.cancelAtPeriodEnd ? 'Expira em:' : 'Próxima cobrança:'}
                    </span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold">
                        {new Date(subscriptionStatus.currentPeriodEnd * 1000).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                )}

                {subscriptionStatus?.subscriptionType === 'premium' && (
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Valor:</strong> R$ 29,90/mês
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Método de pagamento:</strong> Cartão de crédito
                    </p>
                  </div>
                )}

                {subscriptionStatus?.cancelAtPeriodEnd && (
                  <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Cancelamento Programado
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Sua assinatura será cancelada no final do período atual. 
                        Você continuará tendo acesso aos recursos premium até {' '}
                        {new Date(subscriptionStatus.currentPeriodEnd! * 1000).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-4">
            {subscriptionStatus?.subscriptionType === 'free' && (
              <Link href="/subscribe">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3">
                  <Crown className="w-5 h-5 mr-2" />
                  Assinar Mix Premium - R$ 29,90/mês
                </Button>
              </Link>
            )}

            {subscriptionStatus?.subscriptionType === 'premium' && !subscriptionStatus?.cancelAtPeriodEnd && (
              <Button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                {cancelling ? "Cancelando..." : "Cancelar Assinatura"}
              </Button>
            )}

            <Link href="/profile">
              <Button variant="outline" className="w-full">
                Voltar ao Perfil
              </Button>
            </Link>
          </div>

          {/* Features Comparison */}
          {subscriptionStatus?.subscriptionType === 'free' && (
            <Card>
              <CardHeader>
                <CardTitle>Por que Assinar Mix Premium?</CardTitle>
                <CardDescription>
                  Veja todos os benefícios que você desbloqueará
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="text-sm">Likes ilimitados por dia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">5 Super Likes por dia</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">1 Boost grátis por mês</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Ver quem curtiu seu perfil</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Filtros avançados de busca</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Support */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Precisa de ajuda com sua assinatura?</p>
            <p className="font-semibold text-purple-600">
              Entre em contato: suporte@mixapp.com.br
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
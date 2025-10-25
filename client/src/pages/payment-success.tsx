import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Heart, Zap } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function PaymentSuccess() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check subscription status after successful payment
    fetch("/api/subscription-status", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setSubscriptionStatus(data);
      })
      .catch((error) => {
        console.error("Error fetching subscription status:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Message */}
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Pagamento Realizado com Sucesso!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Parabéns! Sua assinatura Mix Premium foi ativada.
              </p>
              
              {subscriptionStatus && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Status da Assinatura
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo: <span className="font-semibold text-purple-600">
                      {subscriptionStatus.subscriptionType === 'premium' ? 'Premium' : 'Grátis'}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: <span className="font-semibold text-green-600">
                      {subscriptionStatus.status === 'active' ? 'Ativo' : subscriptionStatus.status}
                    </span>
                  </p>
                  {subscriptionStatus.currentPeriodEnd && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Renovação: {new Date(subscriptionStatus.currentPeriodEnd * 1000).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Premium Benefits Unlocked */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Benefícios Premium Desbloqueados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/30 dark:to-purple-900/30 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Likes Ilimitados
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Curta quantos perfis quiser sem limite diário
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      5 Super Likes por Dia
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Destaque-se com Super Likes especiais
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      1 Boost Grátis por Mês
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Impulsione seu perfil para mais visibilidade
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                  <Heart className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Ver Quem Te Curtiu
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Veja todos os perfis que curtiram você
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/discover" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3">
                Começar a Descobrir
              </Button>
            </Link>
            
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-400 dark:hover:bg-purple-900/30 py-3">
                Ver Meu Perfil
              </Button>
            </Link>
          </div>

          {/* Support Message */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Precisa de ajuda? Entre em contato conosco pelo email:</p>
            <p className="font-semibold text-purple-600">suporte@mixapp.com.br</p>
          </div>
        </div>
      </div>
    </div>
  );
}
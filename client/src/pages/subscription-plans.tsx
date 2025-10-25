import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Heart, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SubscriptionPlan {
  id: number;
  name: string;
  stripePriceId: string;
  price: number;
  currency: string;
  interval: string;
  features: {
    unlimitedLikes?: boolean;
    superLikes?: number;
    boost?: number;
    seeWhoLikedYou?: boolean;
    advancedFilters?: boolean;
    noAds?: boolean;
    prioritySupport?: boolean;
    exclusiveFeatures?: boolean;
  };
  isActive: boolean;
}

export default function SubscriptionPlans() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // Fetch subscription plans
  const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['/api/subscription-plans'],
    queryFn: () => fetch('/api/subscription-plans').then(res => res.json())
  });

  // Create subscription mutation
  const createSubscriptionMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // Demo user - would come from auth context in real app
          planId
        })
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.clientSecret) {
        // Redirect to payment page with client secret
        window.location.href = `/subscribe?clientSecret=${data.clientSecret}&planId=${selectedPlan}`;
      } else {
        toast({
          title: "Erro",
          description: "Erro ao criar assinatura. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error('Error creating subscription:', error);
      toast({
        title: "Erro no Pagamento",
        description: "Erro ao processar pagamento. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const formatPrice = (price: number) => {
    return `R$ ${(price / 100).toFixed(2).replace('.', ',')}`;
  };

  const handleSelectPlan = (planId: number) => {
    setSelectedPlan(planId);
    createSubscriptionMutation.mutate(planId);
  };

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase() === 'premium') return <Heart className="h-6 w-6 text-pink-500" />;
    if (planName.toLowerCase() === 'vip') return <Crown className="h-6 w-6 text-yellow-500" />;
    return <Star className="h-6 w-6 text-blue-500" />;
  };

  const getPlanColor = (planName: string) => {
    if (planName.toLowerCase() === 'premium') return 'from-pink-500 to-purple-600';
    if (planName.toLowerCase() === 'vip') return 'from-yellow-500 to-orange-600';
    return 'from-blue-500 to-indigo-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Escolha seu Plano MIX
          </h1>
          <p className="text-xl text-white/90">
            Encontre o amor com recursos premium
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan: SubscriptionPlan) => (
            <Card key={plan.id} className="relative overflow-hidden border-2 border-white/20 bg-white/10 backdrop-blur-sm">
              {/* Plan Header */}
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {getPlanIcon(plan.name)}
                </div>
                <CardTitle className="text-2xl font-bold text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-white/80">
                  <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                  <span className="text-lg">/{plan.interval === 'month' ? 'mês' : plan.interval}</span>
                </CardDescription>
              </CardHeader>

              {/* Features */}
              <CardContent className="space-y-3">
                {plan.features.unlimitedLikes && (
                  <div className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>Likes ilimitados</span>
                  </div>
                )}
                
                {plan.features.superLikes && (
                  <div className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>{plan.features.superLikes} Super Likes por dia</span>
                  </div>
                )}
                
                {plan.features.boost && (
                  <div className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>{plan.features.boost} Boost{plan.features.boost > 1 ? 's' : ''} por mês</span>
                  </div>
                )}
                
                {plan.features.seeWhoLikedYou && (
                  <div className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>Ver quem te curtiu</span>
                  </div>
                )}
                
                {plan.features.advancedFilters && (
                  <div className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>Filtros avançados</span>
                  </div>
                )}
                
                {plan.features.noAds && (
                  <div className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>Sem anúncios</span>
                  </div>
                )}
                
                {plan.features.prioritySupport && (
                  <div className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>Suporte prioritário</span>
                  </div>
                )}
                
                {plan.features.exclusiveFeatures && (
                  <div className="flex items-center text-white">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>Recursos exclusivos</span>
                  </div>
                )}
              </CardContent>

              {/* Select Button */}
              <CardFooter>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={createSubscriptionMutation.isPending && selectedPlan === plan.id}
                  className={`w-full bg-gradient-to-r ${getPlanColor(plan.name)} text-white font-bold py-3`}
                >
                  {createSubscriptionMutation.isPending && selectedPlan === plan.id ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Processando...
                    </div>
                  ) : (
                    `Escolher ${plan.name}`
                  )}
                </Button>
              </CardFooter>

              {/* Most Popular Badge for VIP */}
              {plan.name.toLowerCase() === 'vip' && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-yellow-500 text-black font-bold">
                    Mais Popular
                  </Badge>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link href="/profile">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Voltar ao Perfil
            </Button>
          </Link>
        </div>

        {/* Price ID Warning */}
        <div className="mt-8 bg-orange-500/20 backdrop-blur-sm rounded-lg p-4 border border-orange-500/30">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-orange-400 mr-2" />
            <p className="text-white/90 text-sm">
              <strong>Nota para desenvolvedores:</strong> Configure os Price IDs reais do Stripe Dashboard. 
              Consulte o arquivo STRIPE_PRICE_SETUP.md para instruções.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
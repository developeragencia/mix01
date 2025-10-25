import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Heart, Zap, Star, Check, ArrowLeft, Sparkles } from "lucide-react";

export default function Premium() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  const plans = [
    {
      id: "premium",
      name: "Premium",
      price: "R$ 29,90",
      period: "/mês",
      description: "Likes ilimitados + Super Likes",
      features: [
        "Likes ilimitados",
        "Ver quem te curtiu",
        "5 Super Likes por dia",
        "Boost mensal do perfil",
        "Filtros avançados",
        "Desfazer último swipe"
      ],
      color: "from-pink-500 to-purple-500",
      popular: true
    },
    {
      id: "vip",
      name: "VIP",
      price: "R$ 49,90",
      period: "/mês",
      description: "Tudo do Premium + Boost semanal",
      features: [
        "Todos os recursos Premium",
        "Boost semanal do perfil",
        "Super Likes ilimitados",
        "Ver perfis antes dos outros",
        "Modo invisível",
        "Suporte prioritário",
        "Badge VIP no perfil"
      ],
      color: "from-yellow-500 to-orange-500",
      popular: false
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setLocation(`/checkout?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/swipe-limit")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h1 className="text-xl font-bold text-white">Mix Premium</h1>
          </div>
        </div>

        {/* Current Limitations */}
        <Card className="bg-white/10 border-white/20 text-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Sua conta gratuita
            </CardTitle>
            <CardDescription className="text-white/70">
              Você tem 5 likes restantes hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Likes diários</span>
                <span className="text-sm font-medium">5/10</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="space-y-4 mb-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`bg-white/10 border-white/20 text-white relative overflow-hidden ${
                selectedPlan === plan.id ? 'ring-2 ring-white/50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    POPULAR
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {plan.id === 'vip' ? (
                        <Crown className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      )}
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-white/70 mt-1">
                      {plan.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{plan.price}</div>
                    <div className="text-sm text-white/60">{plan.period}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={selectedPlan === plan.id}
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-medium`}
                >
                  {selectedPlan === plan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processando...
                    </div>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Assinar {plan.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Summary */}
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-center text-lg">Por que Mix Premium?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">Mais Matches</div>
                  <div className="text-white/70">3x mais chances</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">Status VIP</div>
                  <div className="text-white/70">Destaque-se</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60 text-xs">
          <p>Cancele a qualquer momento</p>
          <p className="mt-1">Pagamento seguro e criptografado</p>
        </div>
      </div>
    </div>
  );
}
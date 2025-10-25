import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Crown, Heart, Star, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

export default function Plans() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>("premium");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const plans = [
    {
      id: "basic",
      name: "Básico",
      icon: Heart,
      color: "from-blue-600 to-blue-800",
      borderColor: "border-blue-500/50",
      popular: false,
      pricing: {
        monthly: { price: "R$ 19,90", total: "R$ 19,90" },
        yearly: { price: "R$ 15,90", total: "R$ 190,80", savings: "Economize R$ 48" }
      },
      features: [
        "10 Likes por dia",
        "1 Super Like por dia",
        "Ver quem curtiu você",
        "Perfil básico",
        "Suporte por e-mail"
      ]
    },
    {
      id: "premium",
      name: "Premium",
      icon: Crown,
      color: "from-purple-600 to-pink-600",
      borderColor: "border-yellow-500",
      popular: true,
      pricing: {
        monthly: { price: "R$ 39,90", total: "R$ 39,90" },
        yearly: { price: "R$ 29,90", total: "R$ 358,80", savings: "Economize R$ 120" }
      },
      features: [
        "Likes ilimitados",
        "5 Super Likes por dia",
        "1 Boost por mês",
        "Ver quem curtiu você",
        "Controles de privacidade",
        "Rewind (desfazer swipe)",
        "Suporte prioritário"
      ]
    },
    {
      id: "vip",
      name: "VIP",
      icon: Star,
      color: "from-yellow-600 to-orange-600",
      borderColor: "border-yellow-500/50",
      popular: false,
      pricing: {
        monthly: { price: "R$ 59,90", total: "R$ 59,90" },
        yearly: { price: "R$ 49,90", total: "R$ 598,80", savings: "Economize R$ 120" }
      },
      features: [
        "Tudo do Premium",
        "10 Super Likes por dia",
        "1 Boost por semana",
        "Perfil prioritário",
        "Mensagens prioritárias",
        "Viagem (mudar localização)",
        "Suporte VIP 24/7"
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    // Aqui seria integrada a lógica de pagamento
    alert(`Redirecionando para pagamento do plano ${selectedPlan} (${billingPeriod})`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-blue-900/60 backdrop-blur-md border-b border-blue-300/30 px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/10 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-lg font-bold flex-1">Planos de Assinatura</h1>
        </div>
      </div>

      <main className="px-4 py-6 pb-20">
        {/* Billing Toggle */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 mb-6 border border-white/20">
          <div className="flex">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-white text-gray-900"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all relative ${
                billingPeriod === "yearly"
                  ? "bg-white text-gray-900"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                -25%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="space-y-4 mb-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const pricing = plan.pricing[billingPeriod];
            
            return (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan.id)}
                className={`relative bg-gradient-to-r ${plan.color} rounded-xl p-6 border-2 cursor-pointer transition-all ${
                  isSelected ? plan.borderColor : "border-white/20"
                } ${plan.popular ? "ring-2 ring-yellow-400" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold">
                      MAIS POPULAR
                    </div>
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Icon className="w-8 h-8 text-white mr-3" />
                    <div>
                      <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                      <div className="flex items-baseline">
                        <span className="text-white text-2xl font-bold">{pricing.price}</span>
                        <span className="text-white/80 text-sm ml-1">
                          /{billingPeriod === "monthly" ? "mês" : "mês"}
                        </span>
                      </div>
                      {billingPeriod === "yearly" && (pricing as any).savings && (
                        <p className="text-green-300 text-xs font-medium">{(pricing as any).savings}</p>
                      )}
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? "bg-white border-white" : "border-white/50"
                  }`}>
                    {isSelected && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                  </div>
                </div>

                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-4 h-4 text-white mr-2" />
                      <span className="text-white text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {billingPeriod === "yearly" && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-white/90 text-sm">
                      Total anual: <span className="font-bold">{pricing.total}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Subscribe Button */}
        <div className="space-y-4">
          <Button
            onClick={handleSubscribe}
            disabled={!selectedPlan}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold w-full py-4 text-lg disabled:opacity-50"
          >
            <Zap className="w-5 h-5 mr-2" />
            ASSINAR AGORA
          </Button>

          <div className="text-center space-y-2">
            <p className="text-white/80 text-xs">
              • Cancele a qualquer momento • Sem compromisso • Pagamento seguro
            </p>
            <p className="text-white/60 text-xs">
              Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
            </p>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4 text-center">Por que escolher Premium?</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Likes Ilimitados</h4>
                <p className="text-white/70 text-xs">Curta quantos perfis quiser, sem limites</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Super Likes</h4>
                <p className="text-white/70 text-xs">Se destaque e aumente suas chances de match</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">Boost Mensal</h4>
                <p className="text-white/70 text-xs">Seja visto por mais pessoas na sua região</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
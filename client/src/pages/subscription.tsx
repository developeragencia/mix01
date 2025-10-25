import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Crown, Check, Star, Zap, Heart, Shield, Users, MessageCircle, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

export default function Subscription() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<"gold" | "platinum">("gold");

  const goldFeatures = [
    { icon: Eye, text: "Veja quem curtiu você", color: "text-yellow-400" },
    { icon: Star, text: "5 Super Likes por dia", color: "text-blue-400" },
    { icon: Zap, text: "1 Boost gratuito por mês", color: "text-purple-400" },
    { icon: Heart, text: "Curtidas ilimitadas", color: "text-pink-400" },
    { icon: Shield, text: "Controle de quem te vê", color: "text-green-400" },
  ];

  const platinumFeatures = [
    { icon: MessageCircle, text: "Mande mensagem antes do Match", color: "text-blue-400" },
    { icon: Eye, text: "Veja quem curtiu você", color: "text-yellow-400" },
    { icon: Users, text: "Prioridade em Likes", color: "text-purple-400" },
    { icon: Star, text: "5 Super Likes por semana", color: "text-blue-400" },
    { icon: Zap, text: "1 Boost gratuito por mês", color: "text-purple-400" },
    { icon: Heart, text: "Curtidas ilimitadas", color: "text-pink-400" },
    { icon: Sparkles, text: "Ver Matches antes de curtir", color: "text-yellow-400" },
    { icon: Shield, text: "Controle total de privacidade", color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/20 w-10 h-10 p-0 rounded-full"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-lg font-bold flex-1 text-center">Assinaturas</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-6 pt-6">
        <div className="text-center mb-2">
          <h2 className="text-white text-2xl font-bold mb-2">Escolha seu plano</h2>
          <p className="text-gray-300 text-sm">Desbloqueie recursos premium e encontre mais matches</p>
        </div>

        <div className="flex gap-3 bg-gray-900/30 rounded-full p-1 mb-6" data-testid="tabs-plan-selector">
          <button
            onClick={() => setSelectedPlan("gold")}
            className={`flex-1 py-3 px-4 rounded-full font-bold text-sm transition-all ${
              selectedPlan === "gold"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
            data-testid="tab-gold"
          >
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-4 h-4" />
              GOLD
            </div>
          </button>
          <button
            onClick={() => setSelectedPlan("platinum")}
            className={`flex-1 py-3 px-4 rounded-full font-bold text-sm transition-all ${
              selectedPlan === "platinum"
                ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
            data-testid="tab-platinum"
          >
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-4 h-4" />
              PLATINUM
            </div>
          </button>
        </div>

        {selectedPlan === "gold" && (
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-3xl p-6 shadow-2xl" data-testid="card-gold-plan">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <img src={mixLogo} alt="mix" className="h-8 w-auto" />
                <span className="bg-yellow-800 text-white text-xs px-2 py-0.5 rounded-full font-bold">GOLD</span>
              </div>
              <div className="text-right">
                <p className="text-white text-3xl font-bold">R$ 29,90</p>
                <p className="text-yellow-200 text-sm">por mês</p>
              </div>
            </div>

            <h4 className="text-white font-bold mb-4 text-lg">Recursos incluídos</h4>
            
            <div className="space-y-3 mb-6">
              {goldFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3" data-testid={`feature-gold-${index}`}>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <span className="text-white text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setLocation('/subscription-plans')}
              className="w-full h-14 bg-white hover:bg-gray-100 text-yellow-700 font-bold rounded-full text-lg shadow-lg"
              data-testid="button-subscribe-gold"
            >
              Assinar Gold
            </Button>
          </div>
        )}

        {selectedPlan === "platinum" && (
          <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-600" data-testid="card-platinum-plan">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <img src={mixLogo} alt="mix" className="h-8 w-auto" />
                <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full font-bold">PLATINUM</span>
              </div>
              <div className="text-right">
                <p className="text-white text-3xl font-bold">R$ 49,90</p>
                <p className="text-gray-300 text-sm">por mês</p>
              </div>
            </div>

            <h4 className="text-white font-bold mb-4 text-lg">Recursos incluídos</h4>
            
            <div className="space-y-3 mb-6">
              {platinumFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3" data-testid={`feature-platinum-${index}`}>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <span className="text-white text-sm">{feature.text}</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setLocation('/subscription-plans')}
              className="w-full h-14 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-full text-lg shadow-lg"
              data-testid="button-subscribe-platinum"
            >
              Assinar Platinum
            </Button>
          </div>
        )}

        <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-semibold text-sm mb-1">Garantia de 7 dias</h4>
              <p className="text-gray-400 text-xs">
                Cancele a qualquer momento. Reembolso total nos primeiros 7 dias.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setLocation('/profile')}
            className="text-gray-400 hover:text-white text-sm underline"
            data-testid="link-back-to-profile"
          >
            Voltar ao perfil
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

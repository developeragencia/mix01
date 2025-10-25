import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Crown, Check, X, Calendar, CreditCard, Flame, Users, MessageCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Subscription() {
  const [, setLocation] = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const currentPlan = {
    name: "Premium",
    price: "R$ 39,90",
    period: "mensal",
    renewsAt: "15 de Julho, 2024",
    features: [
      "Likes ilimitados",
      "5 Super Likes por dia",
      "1 Boost por mês",
      "Ver quem curtiu você",
      "Controles de privacidade",
      "Suporte prioritário"
    ]
  };

  const usageStats = [
    { label: "Likes Enviados", value: "127", max: "∞", color: "bg-pink-500" },
    { label: "Super Likes", value: "3", max: "5", color: "bg-blue-500" },
    { label: "Boosts Usados", value: "0", max: "1", color: "bg-purple-500" },
    { label: "Matches Este Mês", value: "12", max: "∞", color: "bg-green-500" }
  ];

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
          <h1 className="text-white text-lg font-bold flex-1">Assinatura Atual</h1>
        </div>
      </div>

      <main className="px-4 py-6 pb-20">
        {/* Status da Assinatura */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 border-2 border-white/50 mb-6">
          <div className="text-center">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h2 className="text-white text-xl font-bold mb-1">{currentPlan.name}</h2>
            <p className="text-white/90 text-lg font-semibold mb-2">{currentPlan.price}/{currentPlan.period}</p>
            <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full inline-block mb-4">
              ✓ ATIVO
            </div>
            <p className="text-white/80 text-sm">
              Renovação automática em {currentPlan.renewsAt}
            </p>
          </div>
        </div>

        {/* Estatísticas de Uso */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Uso do Plano Este Mês</h3>
          <div className="grid grid-cols-2 gap-3">
            {usageStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">{stat.label}</span>
                  <span className="text-white font-bold text-lg">{stat.value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="bg-white/20 rounded-full h-2 flex-1 mr-2">
                    <div 
                      className={`${stat.color} h-2 rounded-full`}
                      style={{ 
                        width: stat.max === "∞" ? "100%" : `${(parseInt(stat.value) / parseInt(stat.max)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-white/60 text-xs">/{stat.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recursos Inclusos */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Recursos Inclusos</h3>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="space-y-3">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-400 mr-3" />
                  <span className="text-white text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ações da Assinatura */}
        <div className="space-y-3 mb-6">
          <Button 
            onClick={() => setLocation('/plans')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full"
          >
            <Crown className="w-4 h-4 mr-2" />
            ALTERAR PLANO
          </Button>
          
          <Button 
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 w-full"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            GERENCIAR PAGAMENTO
          </Button>
          
          <Button 
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 w-full"
          >
            <Calendar className="w-4 h-4 mr-2" />
            PAUSAR ASSINATURA
          </Button>
        </div>

        {/* Histórico de Pagamentos */}
        <div className="mb-6">
          <h3 className="text-white text-lg font-bold mb-4">Histórico de Pagamentos</h3>
          <div className="space-y-3">
            {[
              { date: "15/06/2024", amount: "R$ 39,90", status: "Pago", method: "Cartão ••••1234" },
              { date: "15/05/2024", amount: "R$ 39,90", status: "Pago", method: "Cartão ••••1234" },
              { date: "15/04/2024", amount: "R$ 39,90", status: "Pago", method: "Cartão ••••1234" }
            ].map((payment, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{payment.date}</p>
                    <p className="text-white/70 text-xs">{payment.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-sm">{payment.amount}</p>
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      {payment.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancelar Assinatura */}
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4">
          <h3 className="text-red-300 font-bold text-base mb-2">Cancelar Assinatura</h3>
          <p className="text-red-200/80 text-sm mb-4">
            Você perderá acesso aos recursos Premium, mas pode reativar a qualquer momento.
          </p>
          <Button 
            variant="outline"
            className="border-red-500 text-red-300 hover:bg-red-500/20 w-full"
          >
            <X className="w-4 h-4 mr-2" />
            CANCELAR ASSINATURA
          </Button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-blue-900/60 backdrop-blur-md border-t border-blue-300/30">
        <div className="flex justify-around py-2">
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/discover')}
          >
            <Flame className="w-6 h-6" />
            <span className="text-[10px] font-medium">Descobrir</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/matches')}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">Partidas</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/messages')}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px] font-medium">Mensagens</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/profile')}
          >
            <UserCircle className="w-6 h-6" />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
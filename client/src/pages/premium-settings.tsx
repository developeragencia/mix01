import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BottomNavigation from "@/components/BottomNavigation";
import { Crown, ArrowLeft, Star, Shield, Eye, MessageCircle, Zap } from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function PremiumSettings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState({
    showOnline: true,
    readReceipts: true,
    superLikes: true,
    boosts: false,
    invisibleMode: false,
    priorityMessages: true,
    advancedFilters: true,
    unlimitedSwipes: true
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const premiumFeatures = [
    {
      id: 'showOnline',
      icon: <Eye className="w-5 h-5" />,
      title: 'Mostrar Status Online',
      description: 'Outros usuários podem ver quando você está online',
      premium: false
    },
    {
      id: 'readReceipts',
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Confirmação de Leitura',
      description: 'Veja quando suas mensagens foram lidas',
      premium: true
    },
    {
      id: 'superLikes',
      icon: <Star className="w-5 h-5" />,
      title: 'Super Likes Ilimitados',
      description: 'Envie quantos super likes quiser',
      premium: true
    },
    {
      id: 'boosts',
      icon: <Zap className="w-5 h-5" />,
      title: 'Boosts Gratuitos',
      description: 'Seja visto por mais pessoas com boosts semanais',
      premium: true
    },
    {
      id: 'invisibleMode',
      icon: <Shield className="w-5 h-5" />,
      title: 'Modo Invisível',
      description: 'Navegue sem ser visto por outros usuários',
      premium: true
    },
    {
      id: 'priorityMessages',
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Mensagens Prioritárias',
      description: 'Suas mensagens aparecem primeiro',
      premium: true
    },
    {
      id: 'advancedFilters',
      icon: <Crown className="w-5 h-5" />,
      title: 'Filtros Avançados',
      description: 'Filtre por educação, trabalho, altura e mais',
      premium: true
    },
    {
      id: 'unlimitedSwipes',
      icon: <Crown className="w-5 h-5" />,
      title: 'Swipes Ilimitados',
      description: 'Sem limite de swipes por dia',
      premium: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-sm border-b border-blue-700/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/profile")}
            className="text-white hover:bg-blue-800/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <img src={mixLogoHorizontal} alt="Mix Logo" className="h-6 object-contain" />
          
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-semibold">PREMIUM</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Configurações Premium
          </h1>
          <p className="text-blue-200 text-sm">
            Personalize sua experiência premium
          </p>
        </div>

        {/* Premium Status Card */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 mb-6 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Plano Premium</h3>
                <p className="text-yellow-200 text-sm">Ativo até 18/08/2025</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20"
            >
              Gerenciar
            </Button>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-4">
          {premiumFeatures.map((feature) => (
            <div 
              key={feature.id}
              className="bg-blue-800/30 rounded-xl p-4 border border-blue-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    feature.premium ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-blue-700'
                  }`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-medium">{feature.title}</h3>
                      {feature.premium && (
                        <Crown className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-blue-200 text-sm">{feature.description}</p>
                  </div>
                </div>
                <Switch
                  checked={settings[feature.id as keyof typeof settings]}
                  onCheckedChange={() => handleToggle(feature.id as keyof typeof settings)}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-500 data-[state=checked]:to-orange-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade Card */}
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-6 mt-6 border border-pink-500/30">
          <div className="text-center">
            <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              Aproveite ao Máximo o Premium
            </h3>
            <p className="text-pink-200 text-sm mb-4">
              Desbloqueie todas as funcionalidades premium e encontre seu match perfeito
            </p>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium"
              size="sm"
            >
              Ver Todos os Planos
            </Button>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-blue-800/30 rounded-xl p-4 mt-6 border border-blue-700/50">
          <h3 className="text-white font-medium mb-4">Estatísticas do Mês</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">∞</div>
              <div className="text-blue-200 text-sm">Swipes Usados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-400">12</div>
              <div className="text-blue-200 text-sm">Super Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">3</div>
              <div className="text-blue-200 text-sm">Boosts Usados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">47</div>
              <div className="text-blue-200 text-sm">Novos Matches</div>
            </div>
          </div>
        </div>

        {/* Spacer for bottom navigation */}
        <div className="h-20"></div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
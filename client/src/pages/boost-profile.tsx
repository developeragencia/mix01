import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown, ArrowLeft, TrendingUp, Users, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BoostProfile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [boostsAvailable, setBoostsAvailable] = useState(1);
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostEndTime, setBoostEndTime] = useState<Date | null>(null);

  const handleActivateBoost = () => {
    if (boostsAvailable <= 0) {
      toast({
        title: "Sem Boosts disponíveis",
        description: "Assine Premium para receber Boosts semanais!",
        variant: "destructive",
      });
      return;
    }

    setBoostsAvailable(prev => prev - 1);
    setIsBoostActive(true);
    
    // Boost lasts 30 minutes
    const endTime = new Date();
    endTime.setMinutes(endTime.getMinutes() + 30);
    setBoostEndTime(endTime);

    toast({
      title: "Boost Ativado! 🚀",
      description: "Seu perfil será exibido para mais pessoas pelos próximos 30 minutos!",
    });

    // Simulate boost ending
    setTimeout(() => {
      setIsBoostActive(false);
      setBoostEndTime(null);
      toast({
        title: "Boost finalizado",
        description: "Seu boost de 30 minutos foi concluído. Veja seus novos likes!",
      });
    }, 30 * 60 * 1000); // 30 minutes
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/profile")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Boost do Perfil
              </h1>
              <p className="text-white/60 text-sm">Seja visto por mais pessoas</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
            {boostsAvailable} disponível
          </Badge>
        </div>

        {/* Active Boost Status */}
        {isBoostActive && boostEndTime && (
          <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 text-white mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Boost Ativo!
              </CardTitle>
              <CardDescription className="text-white/70">
                Seu perfil está sendo exibido para 10x mais pessoas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white/60" />
                  <span className="text-sm text-white/80">Tempo restante:</span>
                </div>
                <div className="text-xl font-bold text-yellow-200">
                  {formatTimeRemaining(boostEndTime)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-200">147</div>
                  <div className="text-xs text-white/60">Visualizações</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-pink-200">23</div>
                  <div className="text-xs text-white/60">Novos Likes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Boost Card */}
        {!isBoostActive && (
          <Card className="bg-white/10 border-white/20 text-white mb-6">
            <CardHeader className="text-center">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Boost seu Perfil</CardTitle>
              <CardDescription className="text-white/70">
                Seja uma das primeiras pessoas que aparecem na descoberta por 30 minutos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">10x mais visualizações</div>
                    <div className="text-white/60">Apareça para muito mais pessoas</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Prioridade na descoberta</div>
                    <div className="text-white/60">Seja um dos primeiros perfis exibidos</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-pink-500 rounded-full w-8 h-8 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">30 minutos de destaque</div>
                    <div className="text-white/60">Tempo ideal para receber likes</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleActivateBoost}
                disabled={boostsAvailable <= 0}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-3"
              >
                {boostsAvailable > 0 ? (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Ativar Boost Agora
                  </>
                ) : (
                  <>
                    <Crown className="w-5 h-5 mr-2" />
                    Sem Boosts Disponíveis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <Card className="bg-white/5 border-white/10 text-white mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Estatísticas dos seus Boosts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-200">3</div>
                <div className="text-xs text-white/60">Boosts usados</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-200">428</div>
                <div className="text-xs text-white/60">Visualizações</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-200">67</div>
                <div className="text-xs text-white/60">Novos likes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Premium CTA */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/30 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="w-5 h-5 text-yellow-400" />
              Mix Premium
            </CardTitle>
            <CardDescription className="text-white/70">
              Boosts ilimitados e muito mais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>1 Boost semanal grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Boost durante horário de pico</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>Estatísticas detalhadas</span>
              </div>
            </div>
            
            <Button
              onClick={() => setLocation("/premium")}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Crown className="w-4 h-4 mr-2" />
              Assinar Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
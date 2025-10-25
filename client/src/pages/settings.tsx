import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { User, Bell, Shield, HelpCircle, LogOut, Crown, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

interface Profile {
  id: number;
  userId: number;
  name: string;
  age: number;
  photos?: string[];
}

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Buscar dados REAIS do perfil
  const { data: profile } = useQuery<Profile>({
    queryKey: ['/api/profiles', user?.id],
    enabled: !!user?.id,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${user?.id}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Profile not found');
      return res.json();
    }
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Desconectado!", description: "Até logo!" });
      setLocation('/');
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível sair", variant: "destructive" });
    }
  };

  const settingsOptions = [
    {
      icon: User,
      label: "Editar Perfil",
      description: "Atualize suas informações e fotos",
      action: () => setLocation('/edit-profile-new'),
      testId: "button-edit-profile"
    },
    {
      icon: Crown,
      label: "Assinatura Premium",
      description: "Gerencie sua assinatura",
      action: () => setLocation('/subscription'),
      testId: "button-subscription"
    },
    {
      icon: Bell,
      label: "Notificações",
      description: "Configure suas notificações",
      action: () => setLocation('/notifications'),
      testId: "button-notifications"
    },
    {
      icon: Shield,
      label: "Privacidade e Segurança",
      description: "Controle quem vê seu perfil",
      action: () => setLocation('/security'),
      testId: "button-security"
    },
    {
      icon: HelpCircle,
      label: "Ajuda e Suporte",
      description: "Central de ajuda e FAQ",
      action: () => setLocation('/help'),
      testId: "button-help"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      {/* Header - Mesmo estilo do Profile */}
      <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <img src={mixLogo} alt="MIX" className="h-8 w-auto" data-testid="img-logo" />
          <h1 className="text-white text-xl font-bold">Configurações</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* User Info Card - COM FOTO DO PERFIL */}
        {user && profile && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              {/* Foto do Perfil - Mesmo estilo da página Profile */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-500">
                  <img
                    src={profile.photos?.[0] || (user as any).profileImage || `https://ui-avatars.com/api/?name=${profile.name}&background=ec4899&color=fff&size=200`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    data-testid="img-profile-photo"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://ui-avatars.com/api/?name=${profile.name}&background=ec4899&color=fff&size=200`;
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">
                  {profile.name || user.firstName || user.username}
                </h3>
                <p className="text-white/70 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Options */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
          {settingsOptions.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors border-b border-white/10 last:border-b-0"
              data-testid={option.testId}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <option.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold">{option.label}</h4>
                <p className="text-white/60 text-sm">{option.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full h-12 border-2 border-red-400 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-bold text-lg rounded-xl"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5 mr-2" />
          SAIR DA CONTA
        </Button>

        {/* Footer */}
        <div className="text-center text-white/50 text-sm space-y-1 pt-4">
          <p>Mix App Digital</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

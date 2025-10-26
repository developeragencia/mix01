import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, adminRequest } from "@/lib/admin-fetch";
import { 
  Settings, 
  Globe, 
  Shield,
  Bell,
  Save,
  Zap,
  Heart,
  AlertTriangle,
  Image,
  UserCheck,
  MapPin,
  TrendingUp
} from "lucide-react";
import type { AppSetting } from "@shared/schema";

export default function AdminSettingsNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: settings = [], isLoading } = useQuery<AppSetting[]>({
    queryKey: ['/api/admin/app-settings'],
    staleTime: 60000, // Cache por 1 minuto (configurações mudam raramente)
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await adminFetch('/api/admin/app-settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const response = await adminRequest('/api/admin/app-settings', 'PATCH', { key, value });
      if (!response.ok) throw new Error('Failed to update setting');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/app-settings'] });
    }
  });

  const getSetting = (key: string): string => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || '';
  };

  const updateSetting = async (key: string, value: string | boolean | number) => {
    const stringValue = String(value);
    await updateSettingMutation.mutateAsync({ key, value: stringValue });
  };

  const saveAllSettings = async () => {
    setIsSaving(true);
    try {
      toast({
        title: "✅ Configurações Salvas",
        description: "Todas as alterações foram salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Configurações do Aplicativo">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  const SettingRow = ({ 
    icon: Icon, 
    label, 
    settingKey, 
    type = 'number',
    description
  }: { 
    icon: any, 
    label: string, 
    settingKey: string, 
    type?: 'number' | 'boolean' | 'string',
    description?: string
  }) => {
    const value = getSetting(settingKey);
    
    if (type === 'boolean') {
      return (
        <div className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg hover:bg-blue-700/40 transition-colors border border-blue-600/30">
          <div className="flex items-center gap-3 flex-1">
            <Icon className="w-4 h-4 text-pink-400" />
            <div>
              <Label className="text-white font-medium text-sm">{label}</Label>
              {description && <p className="text-xs text-blue-200 mt-0.5">{description}</p>}
            </div>
          </div>
          <Switch
            checked={value === 'true'}
            onCheckedChange={(checked) => updateSetting(settingKey, checked)}
            data-testid={`switch-${settingKey}`}
          />
        </div>
      );
    }

    return (
      <div className="p-3 bg-blue-700/30 rounded-lg hover:bg-blue-700/40 transition-colors border border-blue-600/30">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="w-4 h-4 text-pink-400" />
          <Label className="text-white font-medium text-sm">{label}</Label>
        </div>
        {description && <p className="text-xs text-blue-200 mb-2">{description}</p>}
        <Input
          type={type}
          value={value}
          onChange={(e) => updateSetting(settingKey, e.target.value)}
          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
          data-testid={`input-${settingKey}`}
        />
      </div>
    );
  };

  return (
    <AdminLayout title="Configurações do Aplicativo">
      <div className="space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-pink-400" />
                Configurações do Aplicativo
              </h1>
              <p className="text-blue-200 mt-1 text-sm">Gerencie todas as configurações e limites do MIX</p>
            </div>
            <Button 
              onClick={saveAllSettings} 
              disabled={isSaving}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              data-testid="button-save-all"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Salvando...' : 'Salvar Tudo'}
            </Button>
          </div>
        </Card>

        {/* Grid Layout - 2 colunas em telas grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Configurações Gerais */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-semibold text-white">Configurações Gerais</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={Settings} 
                label="Nome do App" 
                settingKey="app_name" 
                type="string"
                description="Nome exibido no aplicativo"
              />
              <SettingRow 
                icon={Settings} 
                label="Versão do App" 
                settingKey="app_version" 
                type="string"
                description="Versão atual do aplicativo"
              />
              <SettingRow 
                icon={AlertTriangle} 
                label="Modo Manutenção" 
                settingKey="maintenance_mode" 
                type="boolean"
                description="Bloqueia acesso ao app para manutenção"
              />
            </div>
          </Card>

          {/* Limites - Usuários Free */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-semibold text-white">Limites - Free</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={Heart} 
                label="Likes Diários (Free)" 
                settingKey="max_daily_likes_free" 
                type="number"
                description="Quantidade de likes por dia para usuários gratuitos"
              />
              <SettingRow 
                icon={Zap} 
                label="Super Likes (Free)" 
                settingKey="super_likes_per_day_free" 
                type="number"
                description="Super Likes diários para Free"
              />
            </div>
          </Card>

          {/* Limites - Premium */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-semibold text-white">Limites - Premium</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={Heart} 
                label="Likes Diários (Premium)" 
                settingKey="max_daily_likes_premium" 
                type="number"
                description="Quantidade de likes por dia para Premium"
              />
              <SettingRow 
                icon={Zap} 
                label="Super Likes (Premium)" 
                settingKey="super_likes_per_day_premium" 
                type="number"
                description="Super Likes diários para Premium"
              />
            </div>
          </Card>

          {/* Limites - VIP */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Limites - VIP</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={Heart} 
                label="Likes Diários (VIP)" 
                settingKey="max_daily_likes_vip" 
                type="number"
                description="Quantidade de likes por dia para VIP (999999 = ilimitado)"
              />
              <SettingRow 
                icon={Zap} 
                label="Super Likes (VIP)" 
                settingKey="super_likes_per_day_vip" 
                type="number"
                description="Super Likes diários para VIP"
              />
            </div>
          </Card>

          {/* Configurações de Perfil */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Image className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-semibold text-white">Perfil e Fotos</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={Image} 
                label="Máximo de Fotos" 
                settingKey="max_photos" 
                type="number"
                description="Número máximo de fotos por perfil"
              />
              <SettingRow 
                icon={Image} 
                label="Mínimo de Fotos" 
                settingKey="min_photos" 
                type="number"
                description="Fotos mínimas obrigatórias no perfil"
              />
              <SettingRow 
                icon={Settings} 
                label="Tamanho Máximo da Bio" 
                settingKey="max_bio_length" 
                type="number"
                description="Caracteres máximos na bio"
              />
            </div>
          </Card>

          {/* Segurança e Idade */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-semibold text-white">Segurança</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={Shield} 
                label="Idade Mínima" 
                settingKey="min_age" 
                type="number"
                description="Idade mínima para usar o app"
              />
              <SettingRow 
                icon={Image} 
                label="Moderação de Fotos" 
                settingKey="photo_moderation" 
                type="string"
                description="Tipo: auto, manual, none"
              />
            </div>
          </Card>

          {/* Recursos e Features */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-pink-400" />
              <h2 className="text-lg font-semibold text-white">Recursos</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={Zap} 
                label="Habilitar Boosts" 
                settingKey="enable_boosts" 
                type="boolean"
                description="Permitir boost de perfil"
              />
              <SettingRow 
                icon={Heart} 
                label="Habilitar Super Likes" 
                settingKey="enable_super_likes" 
                type="boolean"
                description="Permitir super likes"
              />
              <SettingRow 
                icon={TrendingUp} 
                label="Habilitar Check-ins" 
                settingKey="enable_check_ins" 
                type="boolean"
                description="Sistema de check-in em estabelecimentos"
              />
              <SettingRow 
                icon={Settings} 
                label="Habilitar Rewind" 
                settingKey="enable_rewind" 
                type="boolean"
                description="Função de voltar (desfazer swipe)"
              />
              <SettingRow 
                icon={UserCheck} 
                label="Verificação de Perfil" 
                settingKey="enable_profile_verification" 
                type="boolean"
                description="Sistema de verificação de perfil"
              />
            </div>
          </Card>

          {/* Localização */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-6 h-6 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Localização</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={MapPin} 
                label="Distância Máxima (km)" 
                settingKey="max_distance_km" 
                type="number"
                description="Distância máxima de busca"
              />
              <SettingRow 
                icon={Zap} 
                label="Duração do Boost (min)" 
                settingKey="boost_duration_minutes" 
                type="number"
                description="Tempo de duração do boost"
              />
            </div>
          </Card>

          {/* Notificações */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Notificações</h2>
            </div>
            <div className="space-y-3">
              <SettingRow 
                icon={Bell} 
                label="Notificações Push" 
                settingKey="enable_push_notifications" 
                type="boolean"
                description="Habilitar notificações push"
              />
              <SettingRow 
                icon={Bell} 
                label="Notificações por Email" 
                settingKey="enable_email_notifications" 
                type="boolean"
                description="Habilitar notificações por email"
              />
            </div>
          </Card>
        </div>

        {/* Estatísticas Rápidas */}
        <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 border-gray-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-lg font-semibold text-white">Resumo das Configurações</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white">{getSetting('max_daily_likes_free')}</div>
              <div className="text-sm text-gray-400">Likes Free/dia</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-pink-400">{getSetting('max_daily_likes_premium')}</div>
              <div className="text-sm text-gray-400">Likes Premium/dia</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{getSetting('max_daily_likes_vip')}</div>
              <div className="text-sm text-gray-400">Likes VIP/dia</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{getSetting('max_photos')}</div>
              <div className="text-sm text-gray-400">Fotos Máx</div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Save,
  Database,
  Mail,
  Shield,
  Globe,
  Bell,
  Palette,
  Key,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState({
    appName: "Mix App Digital",
    appDescription: "O melhor app de relacionamentos do Brasil",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxPhotosPerProfile: 6,
    maxDistance: 100,
    minAge: 18,
    maxAge: 70,
    stripePublicKey: "",
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    pushNotificationsEnabled: true,
    emailNotificationsEnabled: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['/api/admin/settings'],
    queryFn: async () => {
      const response = await fetch('/api/admin/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      return response.json();
    }
  });

  // Update settings when data is loaded
  useEffect(() => {
    if (currentSettings) {
      setSettings({ ...settings, ...currentSettings });
    }
  }, [currentSettings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: typeof settings) => {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newSettings)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/settings'] });
      toast({
        title: "✅ Configurações Salvas",
        description: data.message || "Configurações salvas com sucesso no banco PostgreSQL",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "❌ Erro ao Salvar", 
        description: "Falha ao salvar configurações no banco de dados",
        variant: "destructive"
      });
      console.error('Error saving settings:', error);
    }
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  const handleReset = () => {
    const defaultSettings = {
      appName: "Mix App Digital",
      appDescription: "O melhor app de relacionamentos do Brasil",
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      maxPhotosPerProfile: 6,
      maxDistance: 100,
      minAge: 18,
      maxAge: 70,
      stripePublicKey: "",
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      pushNotificationsEnabled: true,
      emailNotificationsEnabled: true
    };
    
    setSettings(defaultSettings);
    localStorage.removeItem('adminSettings');
    
    toast({
      title: "🔄 Configurações Restauradas",
      description: "Todas as configurações foram restauradas para os valores padrão",
      variant: "default"
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Configurações do Sistema">
        <div className="animate-pulse space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-blue-800/50 rounded-lg"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Configurações do Sistema">
      <div className="space-y-3 md:space-y-4 w-full max-w-full overflow-x-hidden">
        {/* App Settings */}
        <Card className="p-3 md:p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
            <h3 className="text-sm md:text-base font-semibold text-white">Configurações da Aplicação</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
            <div className="w-full">
              <label className="block text-xs md:text-sm font-medium text-blue-200 mb-1">
                Nome da Aplicação
              </label>
              <Input
                value={settings.appName}
                onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                className="bg-blue-700/50 border-blue-600/50 text-white text-sm w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Descrição
              </label>
              <Input
                value={settings.appDescription}
                onChange={(e) => setSettings({ ...settings, appDescription: e.target.value })}
                className="bg-blue-700/50 border-blue-600/50 text-white"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Modo Manutenção</p>
                <p className="text-blue-200 text-sm">Desabilita acesso público ao app</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Registros Habilitados</p>
                <p className="text-blue-200 text-sm">Permite novos cadastros</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, registrationEnabled: !settings.registrationEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.registrationEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Verificação de Email</p>
                <p className="text-blue-200 text-sm">Exige verificação por email</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, emailVerificationRequired: !settings.emailVerificationRequired })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailVerificationRequired ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailVerificationRequired ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Profile Settings */}
        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Palette className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Configurações de Perfil</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Máximo de Fotos
              </label>
              <Input
                type="number"
                value={settings.maxPhotosPerProfile}
                onChange={(e) => setSettings({ ...settings, maxPhotosPerProfile: parseInt(e.target.value) })}
                className="bg-blue-700/50 border-blue-600/50 text-white"
                min="1"
                max="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Distância Máxima (km)
              </label>
              <Input
                type="number"
                value={settings.maxDistance}
                onChange={(e) => setSettings({ ...settings, maxDistance: parseInt(e.target.value) })}
                className="bg-blue-700/50 border-blue-600/50 text-white"
                min="1"
                max="500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Idade Mínima
              </label>
              <Input
                type="number"
                value={settings.minAge}
                onChange={(e) => setSettings({ ...settings, minAge: parseInt(e.target.value) })}
                className="bg-blue-700/50 border-blue-600/50 text-white"
                min="18"
                max="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Idade Máxima
              </label>
              <Input
                type="number"
                value={settings.maxAge}
                onChange={(e) => setSettings({ ...settings, maxAge: parseInt(e.target.value) })}
                className="bg-blue-700/50 border-blue-600/50 text-white"
                min="18"
                max="100"
              />
            </div>
          </div>
        </Card>

        {/* Payment Settings */}
        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">Configurações de Pagamento</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Stripe Public Key
              </label>
              <Input
                type="password"
                value={settings.stripePublicKey}
                onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
                placeholder="pk_live_..."
                className="bg-blue-700/50 border-blue-600/50 text-white"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Stripe Configurado
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                PIX Habilitado
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Cartão de Crédito
              </Badge>
            </div>
          </div>
        </Card>

        {/* Email Settings */}
        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Configurações de Email</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                SMTP Host
              </label>
              <Input
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                placeholder="smtp.gmail.com"
                className="bg-blue-700/50 border-blue-600/50 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                SMTP Port
              </label>
              <Input
                type="number"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: parseInt(e.target.value) })}
                className="bg-blue-700/50 border-blue-600/50 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                SMTP User
              </label>
              <Input
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                placeholder="email@exemplo.com"
                className="bg-blue-700/50 border-blue-600/50 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                SMTP Password
              </label>
              <Input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                className="bg-blue-700/50 border-blue-600/50 text-white"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Configurações de Notificação</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Push Notifications</p>
                <p className="text-blue-200 text-sm">Notificações no app e browser</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, pushNotificationsEnabled: !settings.pushNotificationsEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotificationsEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-blue-200 text-sm">Notificações por email</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, emailNotificationsEnabled: !settings.emailNotificationsEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotificationsEnabled ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-pink-400/50 text-pink-200 hover:bg-pink-500/20 hover:text-pink-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Restaurar Padrões
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={saveSettingsMutation.isPending}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveSettingsMutation.isPending ? "💾 Salvando..." : "💾 Salvar Configurações"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
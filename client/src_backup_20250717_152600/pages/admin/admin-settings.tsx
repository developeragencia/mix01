import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Globe, 
  Mail, 
  Shield, 
  DollarSign, 
  Image, 
  Users,
  MessageSquare,
  Bell,
  Lock,
  Database,
  Server,
  Save,
  RefreshCw
} from "lucide-react";

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const [settings, setSettings] = useState({
    // App Settings
    appName: "MIX Dating",
    appDescription: "A plataforma de encontros que conecta pessoas reais",
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    
    // Security Settings
    maxLoginAttempts: 5,
    sessionTimeout: 24,
    passwordMinLength: 8,
    twoFactorRequired: false,
    ipWhitelist: "",
    
    // Content Settings
    maxPhotosPerProfile: 6,
    allowVideoUploads: true,
    moderationEnabled: true,
    autoApproveProfiles: false,
    profanityFilterEnabled: true,
    
    // Matching Settings
    maxDailyLikes: 50,
    maxSuperLikes: 5,
    matchExpirationDays: 30,
    locationRadius: 100,
    ageRangeMin: 18,
    ageRangeMax: 80,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    
    // Payment Settings
    stripePublicKey: "",
    stripeSecretKey: "",
    defaultCurrency: "BRL",
    taxRate: 0,
    freeTrialDays: 7,
    
    // API Settings
    apiRateLimit: 1000,
    webhookSecret: "",
    analyticsEnabled: true,
    loggingLevel: "info"
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      alert("Configurações salvas com sucesso!");
    }, 1000);
  };

  const handleReset = () => {
    // Reset to default values
    setIsDirty(false);
    alert("Configurações resetadas para os valores padrão");
  };

  return (
    <AdminLayout currentPage="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
            <p className="text-gray-600">Gerencie as configurações globais da plataforma</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={handleReset}
              disabled={!isDirty}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>

        {isDirty && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800">Você tem alterações não salvas</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* App Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Configurações Gerais</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do App</label>
                <Input
                  value={settings.appName}
                  onChange={(e) => handleSettingChange("appName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <Input
                  value={settings.appDescription}
                  onChange={(e) => handleSettingChange("appDescription", e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Modo Manutenção</label>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Permitir Registros</label>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => handleSettingChange("registrationEnabled", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Verificação de Email Obrigatória</label>
                <Switch
                  checked={settings.emailVerificationRequired}
                  onCheckedChange={(checked) => handleSettingChange("emailVerificationRequired", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Configurações de Segurança</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Tentativas de Login</label>
                <Input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange("maxLoginAttempts", parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeout da Sessão (horas)</label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange("sessionTimeout", parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho Mínimo da Senha</label>
                <Input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSettingChange("passwordMinLength", parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Autenticação de Dois Fatores</label>
                <Switch
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => handleSettingChange("twoFactorRequired", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Content Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Image className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Configurações de Conteúdo</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de Fotos por Perfil</label>
                <Input
                  type="number"
                  value={settings.maxPhotosPerProfile}
                  onChange={(e) => handleSettingChange("maxPhotosPerProfile", parseInt(e.target.value))}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Permitir Upload de Vídeos</label>
                <Switch
                  checked={settings.allowVideoUploads}
                  onCheckedChange={(checked) => handleSettingChange("allowVideoUploads", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Moderação de Conteúdo</label>
                <Switch
                  checked={settings.moderationEnabled}
                  onCheckedChange={(checked) => handleSettingChange("moderationEnabled", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Auto-aprovar Perfis</label>
                <Switch
                  checked={settings.autoApproveProfiles}
                  onCheckedChange={(checked) => handleSettingChange("autoApproveProfiles", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Filtro de Palavrões</label>
                <Switch
                  checked={settings.profanityFilterEnabled}
                  onCheckedChange={(checked) => handleSettingChange("profanityFilterEnabled", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Matching Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-pink-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Configurações de Match</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Likes Diários Máximos</label>
                <Input
                  type="number"
                  value={settings.maxDailyLikes}
                  onChange={(e) => handleSettingChange("maxDailyLikes", parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Super Likes Máximos</label>
                <Input
                  type="number"
                  value={settings.maxSuperLikes}
                  onChange={(e) => handleSettingChange("maxSuperLikes", parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Raio de Localização (km)</label>
                <Input
                  type="number"
                  value={settings.locationRadius}
                  onChange={(e) => handleSettingChange("locationRadius", parseInt(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idade Mínima</label>
                  <Input
                    type="number"
                    value={settings.ageRangeMin}
                    onChange={(e) => handleSettingChange("ageRangeMin", parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idade Máxima</label>
                  <Input
                    type="number"
                    value={settings.ageRangeMax}
                    onChange={(e) => handleSettingChange("ageRangeMax", parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Configurações de Notificação</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Notificações por Email</label>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Notificações Push</label>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Emails de Marketing</label>
                <Switch
                  checked={settings.marketingEmails}
                  onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Relatórios Semanais</label>
                <Switch
                  checked={settings.weeklyReports}
                  onCheckedChange={(checked) => handleSettingChange("weeklyReports", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Payment Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Configurações de Pagamento</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chave Pública Stripe</label>
                <Input
                  type="password"
                  value={settings.stripePublicKey}
                  onChange={(e) => handleSettingChange("stripePublicKey", e.target.value)}
                  placeholder="pk_..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chave Secreta Stripe</label>
                <Input
                  type="password"
                  value={settings.stripeSecretKey}
                  onChange={(e) => handleSettingChange("stripeSecretKey", e.target.value)}
                  placeholder="sk_..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moeda Padrão</label>
                <select
                  value={settings.defaultCurrency}
                  onChange={(e) => handleSettingChange("defaultCurrency", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="BRL">Real Brasileiro (BRL)</option>
                  <option value="USD">Dólar Americano (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dias de Teste Grátis</label>
                <Input
                  type="number"
                  value={settings.freeTrialDays}
                  onChange={(e) => handleSettingChange("freeTrialDays", parseInt(e.target.value))}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* System Status */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Server className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-800">API Status</span>
              </div>
              <p className="text-green-700 text-sm">Online</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-800">Database</span>
              </div>
              <p className="text-green-700 text-sm">Conectado</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-green-800">Storage</span>
              </div>
              <p className="text-green-700 text-sm">Disponível</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-yellow-800">Email Service</span>
              </div>
              <p className="text-yellow-700 text-sm">Limitado</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
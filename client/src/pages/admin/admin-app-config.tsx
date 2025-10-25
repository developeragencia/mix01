import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings,
  Palette,
  Upload,
  Globe,
  Mail,
  CreditCard,
  Shield,
  Bell,
  Users,
  Image,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const appConfigSchema = z.object({
  // App Basic Settings
  appName: z.string().min(2, "Nome do app deve ter pelo menos 2 caracteres"),
  appDescription: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  appVersion: z.string().optional(),
  appUrl: z.string().url("URL deve ser válida").optional().or(z.literal("")),
  
  // App Functionality
  maintenanceMode: z.boolean(),
  registrationEnabled: z.boolean(),
  emailVerificationRequired: z.boolean(),
  guestModeEnabled: z.boolean(),
  
  // User Limits
  maxPhotosPerProfile: z.number().min(1).max(20),
  maxDistance: z.number().min(1).max(500),
  minAge: z.number().min(18).max(100),
  maxAge: z.number().min(18).max(100),
  maxBioLength: z.number().min(50).max(1000),
  maxInterests: z.number().min(1).max(50),
  
  // Communication Settings
  pushNotificationsEnabled: z.boolean(),
  emailNotificationsEnabled: z.boolean(),
  smsNotificationsEnabled: z.boolean(),
  
  // Monetization
  freeUserLikesPerDay: z.number().min(1).max(100),
  premiumPrice: z.number().min(0),
  vipPrice: z.number().min(0),
  superLikePrice: z.number().min(0),
  boostPrice: z.number().min(0),
  
  // Social Features
  enableSuperLikes: z.boolean(),
  enableBoosts: z.boolean(),
  enableVideoChat: z.boolean(),
  enableVoiceNotes: z.boolean(),
  enableGifts: z.boolean(),
  
  // Security & Privacy
  requirePhoneVerification: z.boolean(),
  enableBlockReports: z.boolean(),
  autoModeration: z.boolean(),
  contentFilterLevel: z.enum(["low", "medium", "high"]),
  
  // Integration Settings
  enableGoogleAuth: z.boolean(),
  enableAppleAuth: z.boolean(),
  enableInstagramSync: z.boolean(),
  enableSpotifySync: z.boolean()
});

type AppConfigForm = z.infer<typeof appConfigSchema>;

export default function AdminAppConfig() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: config, isLoading } = useQuery({
    queryKey: ['/api/admin/app-config'],
    queryFn: async () => {
      const response = await fetch('/api/admin/app-config');
      if (!response.ok) throw new Error('Failed to fetch app config');
      return response.json();
    }
  });

  const form = useForm<AppConfigForm>({
    resolver: zodResolver(appConfigSchema),
    defaultValues: {
      appName: "Mix App Digital",
      appDescription: "O melhor app de relacionamentos do Brasil",
      appVersion: "1.0.0",
      appUrl: "",
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
      guestModeEnabled: false,
      maxPhotosPerProfile: 6,
      maxDistance: 100,
      minAge: 18,
      maxAge: 70,
      maxBioLength: 500,
      maxInterests: 10,
      pushNotificationsEnabled: true,
      emailNotificationsEnabled: true,
      smsNotificationsEnabled: false,
      freeUserLikesPerDay: 10,
      premiumPrice: 29.90,
      vipPrice: 49.90,
      superLikePrice: 2.99,
      boostPrice: 4.99,
      enableSuperLikes: true,
      enableBoosts: true,
      enableVideoChat: true,
      enableVoiceNotes: true,
      enableGifts: false,
      requirePhoneVerification: false,
      enableBlockReports: true,
      autoModeration: true,
      contentFilterLevel: "medium",
      enableGoogleAuth: true,
      enableAppleAuth: false,
      enableInstagramSync: false,
      enableSpotifySync: false
    }
  });

  useEffect(() => {
    if (config) {
      form.reset(config);
    }
  }, [config, form]);

  const updateConfigMutation = useMutation({
    mutationFn: async (data: AppConfigForm) => {
      const response = await fetch('/api/admin/app-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update app config');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/app-config'] });
      toast({
        title: "✅ Configurações Salvas",
        description: "As configurações do aplicativo foram atualizadas com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive"
      });
    }
  });

  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      const response = await fetch('/api/admin/upload-logo', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload logo');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Logo Atualizado",
        description: "O logo do aplicativo foi atualizado com sucesso",
      });
      setLogoFile(null);
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao fazer upload do logo",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: AppConfigForm) => {
    updateConfigMutation.mutate(data);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      uploadLogoMutation.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Configurações do Aplicativo">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Configurações do Aplicativo">
      <div className="space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-pink-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Configurações Completas do Aplicativo</h2>
              <p className="text-blue-200 text-sm">Controle total sobre todas as funcionalidades e aparência do MIX</p>
            </div>
          </div>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 bg-blue-800/50 border-blue-700/50 w-full">
                <TabsTrigger value="general" className="data-[state=active]:bg-blue-600">Geral</TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-blue-600">Recursos</TabsTrigger>
                <TabsTrigger value="limits" className="data-[state=active]:bg-blue-600">Limites</TabsTrigger>
                <TabsTrigger value="monetization" className="data-[state=active]:bg-blue-600">Monetização</TabsTrigger>
                <TabsTrigger value="integrations" className="data-[state=active]:bg-blue-600">Integrações</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general" className="space-y-4">
                <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Informações Básicas do App
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="appName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-200">Nome do Aplicativo</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                              placeholder="Nome do seu app"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-200">Versão</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                              placeholder="1.0.0"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appUrl"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-blue-200">URL do Aplicativo</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                              placeholder="https://seuapp.com"
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="appDescription"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-blue-200">Descrição</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300 min-h-20"
                              placeholder="Descreva seu aplicativo..."
                            />
                          </FormControl>
                          <FormMessage className="text-red-400 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>

                {/* Logo Upload */}
                <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Logo e Identidade Visual
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-blue-200 text-sm block mb-2">Logo Principal</label>
                      <div className="flex items-center gap-4">
                        <img 
                          src="/api/placeholder/100/100" 
                          alt="Logo atual" 
                          className="w-16 h-16 rounded-lg object-cover border-2 border-blue-600/50"
                        />
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload"
                          />
                          <Button
                            type="button"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                            disabled={uploadLogoMutation.isPending}
                            className="bg-pink-600 hover:bg-pink-700"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadLogoMutation.isPending ? 'Enviando...' : 'Alterar Logo'}
                          </Button>
                          <p className="text-blue-300 text-xs mt-1">PNG, JPG ou SVG até 2MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* App Status */}
                <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
                  <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Status do Aplicativo
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-blue-600/50 p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-blue-200">Modo Manutenção</FormLabel>
                            <FormDescription className="text-blue-300 text-xs">
                              Quando ativo, apenas administradores podem acessar o app
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="registrationEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-blue-600/50 p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-blue-200">Registros Habilitados</FormLabel>
                            <FormDescription className="text-blue-300 text-xs">
                              Permitir que novos usuários se cadastrem
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emailVerificationRequired"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-blue-600/50 p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-blue-200">Verificação de Email Obrigatória</FormLabel>
                            <FormDescription className="text-blue-300 text-xs">
                              Usuários devem verificar email antes de usar o app
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </TabsContent>

              {/* Continue with other tabs... */}
              <TabsContent value="features" className="space-y-4">
                <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
                  <h3 className="text-sm font-semibold text-white mb-3">Recursos Sociais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="enableSuperLikes"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-blue-600/50 p-3">
                          <FormLabel className="text-blue-200">Super Likes</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="enableBoosts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-blue-600/50 p-3">
                          <FormLabel className="text-blue-200">Boosts de Perfil</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enableVideoChat"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-blue-600/50 p-3">
                          <FormLabel className="text-blue-200">Video Chat</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enableVoiceNotes"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-blue-600/50 p-3">
                          <FormLabel className="text-blue-200">Notas de Voz</FormLabel>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              </TabsContent>

              {/* Add more tabs... */}
            </Tabs>

            {/* Save Button */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resetar
                </Button>
                <Button
                  type="submit"
                  disabled={updateConfigMutation.isPending}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateConfigMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
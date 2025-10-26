import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  User,
  Save,
  Upload,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Heart,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const userEditSchema = z.object({
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().optional(),
  gender: z.string().optional(),
  sexualOrientation: z.string().optional(),
  interestedIn: z.string().optional(),
  subscriptionType: z.enum(["free", "premium", "vip"]),
  isOnline: z.boolean()
});

type UserEditForm = z.infer<typeof userEditSchema>;

export default function AdminUserEdit() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/admin/user-details', id],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/user-details/${id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch user details');
      return response.json();
    }
  });

  const form = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      bio: "",
      gender: "",
      sexualOrientation: "",
      interestedIn: "",
      subscriptionType: "free",
      isOnline: true
    }
  });

  useEffect(() => {
    if (user) {
      console.log("📥 Carregando dados do usuário:", {
        id: user.id,
        email: user.email,
        subscriptionType: user.subscriptionType,
        gender: user.gender,
        sexualOrientation: user.sexualOrientation,
        interestedIn: user.interestedIn
      });
      
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        bio: user.bio || "",
        gender: user.gender || "",
        sexualOrientation: user.sexualOrientation || "",
        interestedIn: user.interestedIn || "",
        subscriptionType: user.subscriptionType || "free",
        isOnline: user.isOnline || false
      });
      setSelectedInterests(user.interests || []);
    }
  }, [user, form]);

  const updateUserMutation = useMutation({
    mutationFn: async (data: UserEditForm & { interests: string[] }) => {
      const adminToken = localStorage.getItem("adminToken");
      console.log("🚀 Iniciando requisição de atualização para o servidor...");
      console.log("📋 Dados que serão enviados:", JSON.stringify(data, null, 2));
      
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      console.log("📨 Resposta do servidor - Status:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Erro na resposta:", error);
        throw new Error(error.message || 'Failed to update user');
      }
      
      const result = await response.json();
      console.log("✅ Resposta de sucesso:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("🎉 Atualização concluída com sucesso!");
      console.log("📊 Dados atualizados:", data);
      
      queryClient.invalidateQueries({ queryKey: ['/api/admin/user-details', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      
      toast({
        title: "✅ Usuário Atualizado",
        description: "Todas as alterações foram salvas com sucesso",
      });
      
      // Redirecionar de volta para a página de detalhes após 1 segundo
      setTimeout(() => {
        setLocation(`/admin/user-details/${id}`);
      }, 1000);
    },
    onError: (error: Error) => {
      console.error("💥 Erro ao atualizar usuário:", error);
      toast({
        title: "❌ Erro ao Salvar",
        description: error.message || "Falha ao atualizar usuário",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: UserEditForm) => {
    console.log("📤 Enviando dados de atualização:", {
      ...data,
      interests: selectedInterests
    });
    updateUserMutation.mutate({
      ...data,
      interests: selectedInterests
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !selectedInterests.includes(newInterest.trim())) {
      setSelectedInterests([...selectedInterests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  if (isLoading) {
    return (
      <AdminLayout title="Editar Usuário">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="Usuário Não Encontrado">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
          <h3 className="text-lg font-semibold text-white mb-2">Usuário não encontrado</h3>
          <p className="text-blue-200 mb-4">O usuário solicitado não existe ou foi removido.</p>
          <Button
            onClick={() => setLocation("/admin/users")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Usuários
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Editar: ${user.firstName} ${user.lastName}`}>
      <div className="space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation(`/admin/user-details/${id}`)}
                className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-semibold text-white">
                  Editando Usuário #{user.id}
                </h2>
              </div>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              {user.subscriptionType}
            </Badge>
          </div>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic Information */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Informações Básicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Nome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                          placeholder="Digite o nome"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Sobrenome</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                          placeholder="Digite o sobrenome"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                          placeholder="email@exemplo.com"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        Telefone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                          placeholder="+55 11 99999-9999"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Cidade
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                          placeholder="São Paulo"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscriptionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Tipo de Assinatura</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-blue-800 border-blue-600">
                          <SelectItem value="free" className="text-white focus:bg-blue-700">Grátis</SelectItem>
                          <SelectItem value="premium" className="text-white focus:bg-blue-700">Premium</SelectItem>
                          <SelectItem value="vip" className="text-white focus:bg-blue-700">VIP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Profile Details */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Detalhes do Perfil
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Gênero</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                            <SelectValue placeholder="Selecione o gênero" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-blue-800 border-blue-600">
                          <SelectItem value="male" className="text-white focus:bg-blue-700">Masculino</SelectItem>
                          <SelectItem value="female" className="text-white focus:bg-blue-700">Feminino</SelectItem>
                          <SelectItem value="non-binary" className="text-white focus:bg-blue-700">Não-binário</SelectItem>
                          <SelectItem value="other" className="text-white focus:bg-blue-700">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sexualOrientation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Orientação Sexual</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                            <SelectValue placeholder="Selecione a orientação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-blue-800 border-blue-600">
                          <SelectItem value="heterosexual" className="text-white focus:bg-blue-700">Heterossexual</SelectItem>
                          <SelectItem value="homosexual" className="text-white focus:bg-blue-700">Homossexual</SelectItem>
                          <SelectItem value="bisexual" className="text-white focus:bg-blue-700">Bissexual</SelectItem>
                          <SelectItem value="pansexual" className="text-white focus:bg-blue-700">Pansexual</SelectItem>
                          <SelectItem value="asexual" className="text-white focus:bg-blue-700">Assexual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestedIn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Interessado em</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                            <SelectValue placeholder="Interessado em" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-blue-800 border-blue-600">
                          <SelectItem value="male" className="text-white focus:bg-blue-700">Homens</SelectItem>
                          <SelectItem value="female" className="text-white focus:bg-blue-700">Mulheres</SelectItem>
                          <SelectItem value="both" className="text-white focus:bg-blue-700">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-200">Biografia</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300 min-h-20"
                        placeholder="Conte um pouco sobre você..."
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
            </Card>

            {/* Interests */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <h3 className="text-sm font-semibold text-white mb-3">Interesses</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                    placeholder="Adicionar interesse..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.map((interest, index) => (
                    <Badge
                      key={index}
                      className="bg-pink-500/20 text-pink-300 border-pink-500/30 pr-1"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:bg-pink-600/50 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation(`/admin/user-details/${id}`)}
                  className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
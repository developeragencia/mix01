import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft,
  CreditCard,
  Save,
  User,
  Calendar,
  DollarSign,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient } from "@/lib/queryClient";

const subscriptionSchema = z.object({
  userId: z.string().min(1, "Selecione um usuário"),
  planType: z.enum(["free", "premium", "vip"]),
  interval: z.enum(["month", "year"]),
  status: z.enum(["active", "cancelled", "pending", "expired"]),
  startDate: z.string().min(1, "Data de início obrigatória"),
  endDate: z.string().min(1, "Data de término obrigatória"),
  amount: z.string().min(1, "Valor obrigatório"),
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

export default function AdminSubscriptionCreate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  // Buscar usuários
  const { data: users = [] } = useQuery({
    queryKey: ['/api/admin/users', searchUser],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (searchUser) params.set('search', searchUser);
      
      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  const form = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      userId: "",
      planType: "premium",
      interval: "month",
      status: "active",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: "19.90",
      stripeSubscriptionId: "",
      stripeCustomerId: "",
    }
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (data: SubscriptionForm) => {
      const adminToken = localStorage.getItem("adminToken");
      console.log("🚀 Criando assinatura:", data);
      
      const response = await fetch('/api/admin/subscriptions/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          amount: Math.round(parseFloat(data.amount) * 100), // Converter para centavos
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create subscription');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log("✅ Assinatura criada com sucesso:", data);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscriptions'] });
      toast({
        title: "✅ Assinatura Criada",
        description: "A assinatura foi criada com sucesso",
      });
      setTimeout(() => {
        setLocation(`/admin/subscription-details/${data.subscription.id}`);
      }, 1000);
    },
    onError: (error: Error) => {
      console.error("❌ Erro ao criar assinatura:", error);
      toast({
        title: "❌ Erro ao Criar",
        description: error.message || "Falha ao criar assinatura",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SubscriptionForm) => {
    console.log("📤 Enviando dados de criação:", data);
    createSubscriptionMutation.mutate(data);
  };

  return (
    <AdminLayout title="Criar Nova Assinatura">
      <div className="space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/admin/subscriptions")}
                className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-semibold text-white">
                  Nova Assinatura
                </h2>
              </div>
            </div>
          </div>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Seleção de Usuário */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Usuário
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Input
                    placeholder="Buscar usuário por email ou nome..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300 mb-2"
                  />
                </div>

                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Selecione o Usuário</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                            <SelectValue placeholder="Selecione um usuário" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-blue-800 border-blue-600 max-h-60">
                          {users.map((user: any) => (
                            <SelectItem 
                              key={user.id} 
                              value={user.id.toString()} 
                              className="text-white focus:bg-blue-700"
                            >
                              {user.firstName} {user.lastName} ({user.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Detalhes da Assinatura */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Detalhes do Plano
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="planType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Tipo de Plano</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                            <SelectValue placeholder="Selecione o plano" />
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

                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Periodicidade</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                            <SelectValue placeholder="Selecione a periodicidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-blue-800 border-blue-600">
                          <SelectItem value="month" className="text-white focus:bg-blue-700">Mensal</SelectItem>
                          <SelectItem value="year" className="text-white focus:bg-blue-700">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-blue-800 border-blue-600">
                          <SelectItem value="active" className="text-white focus:bg-blue-700">Ativa</SelectItem>
                          <SelectItem value="pending" className="text-white focus:bg-blue-700">Pendente</SelectItem>
                          <SelectItem value="cancelled" className="text-white focus:bg-blue-700">Cancelada</SelectItem>
                          <SelectItem value="expired" className="text-white focus:bg-blue-700">Expirada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Valor (R$)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                          placeholder="29.90"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Data de Início
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="bg-blue-700/50 border-blue-600/50 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Data de Término
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="bg-blue-700/50 border-blue-600/50 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* IDs Stripe (Opcional) */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <h3 className="text-sm font-semibold text-white mb-3">
                Integração Stripe (Opcional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="stripeSubscriptionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Stripe Subscription ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                          placeholder="sub_xxxxxxxxxxxxx"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stripeCustomerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-blue-200">Stripe Customer ID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                          placeholder="cus_xxxxxxxxxxxxx"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Botões de Ação */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin/subscriptions")}
                  className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createSubscriptionMutation.isPending}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createSubscriptionMutation.isPending ? 'Criando...' : 'Criar Assinatura'}
                </Button>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}


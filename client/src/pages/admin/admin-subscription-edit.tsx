import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
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
  Crown,
  Ban,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient } from "@/lib/queryClient";

const subscriptionEditSchema = z.object({
  planType: z.enum(["free", "premium", "vip"]),
  status: z.enum(["active", "cancelled", "pending", "expired"]),
  startDate: z.string().min(1, "Data de início obrigatória"),
  endDate: z.string().min(1, "Data de término obrigatória"),
  amount: z.string().min(1, "Valor obrigatório"),
  stripeSubscriptionId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
});

type SubscriptionEditForm = z.infer<typeof subscriptionEditSchema>;

export default function AdminSubscriptionEdit() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  // Buscar dados da assinatura
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['/api/admin/subscription-details', id],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/subscription-details/${id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch subscription');
      return response.json();
    }
  });

  const form = useForm<SubscriptionEditForm>({
    resolver: zodResolver(subscriptionEditSchema),
    defaultValues: {
      planType: "premium",
      status: "active",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: "29.90",
      stripeSubscriptionId: "",
      stripeCustomerId: "",
    }
  });

  useEffect(() => {
    if (subscription) {
      console.log("📥 Carregando dados da assinatura:", subscription);
      
      // Converter amount de centavos para reais
      const amountInReais = (subscription.amount / 100).toFixed(2);
      
      form.reset({
        planType: subscription.planType.toLowerCase(),
        status: subscription.status,
        startDate: subscription.startDate ? new Date(subscription.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: subscription.endDate ? new Date(subscription.endDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        amount: amountInReais,
        stripeSubscriptionId: subscription.stripeSubscriptionId || "",
        stripeCustomerId: subscription.stripeCustomerId || "",
      });
    }
  }, [subscription, form]);

  const updateSubscriptionMutation = useMutation({
    mutationFn: async (data: SubscriptionEditForm) => {
      const adminToken = localStorage.getItem("adminToken");
      console.log("🚀 Atualizando assinatura:", data);
      
      const response = await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PUT',
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
        throw new Error(error.message || 'Failed to update subscription');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      console.log("✅ Assinatura atualizada com sucesso:", data);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscription-details', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscriptions'] });
      toast({
        title: "✅ Assinatura Atualizada",
        description: "Todas as alterações foram salvas com sucesso",
      });
      setTimeout(() => {
        setLocation(`/admin/subscription-details/${id}`);
      }, 1000);
    },
    onError: (error: Error) => {
      console.error("❌ Erro ao atualizar assinatura:", error);
      toast({
        title: "❌ Erro ao Salvar",
        description: error.message || "Falha ao atualizar assinatura",
        variant: "destructive"
      });
    }
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/subscriptions/${id}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to cancel subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscription-details', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscriptions'] });
      toast({
        title: "✅ Assinatura Cancelada",
        description: "A assinatura foi cancelada com sucesso",
      });
      setTimeout(() => {
        setLocation(`/admin/subscription-details/${id}`);
      }, 1000);
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao cancelar assinatura",
        variant: "destructive"
      });
    }
  });

  const activateSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/subscriptions/${id}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to activate subscription');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscription-details', id] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscriptions'] });
      toast({
        title: "✅ Assinatura Ativada",
        description: "A assinatura foi ativada com sucesso",
      });
      setTimeout(() => {
        setLocation(`/admin/subscription-details/${id}`);
      }, 1000);
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao ativar assinatura",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SubscriptionEditForm) => {
    console.log("📤 Enviando dados de atualização:", data);
    updateSubscriptionMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Editar Assinatura">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!subscription) {
    return (
      <AdminLayout title="Assinatura Não Encontrada">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
          <h3 className="text-lg font-semibold text-white mb-2">Assinatura não encontrada</h3>
          <p className="text-blue-200 mb-4">A assinatura solicitada não existe ou foi removida.</p>
          <Button
            onClick={() => setLocation("/admin/subscriptions")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar às Assinaturas
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Editar: Assinatura #${subscription.id}`}>
      <div className="space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation(`/admin/subscription-details/${id}`)}
                className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-semibold text-white">
                  Editando Assinatura #{subscription.id}
                </h2>
              </div>
            </div>
          </div>
        </Card>

        {/* Info do Usuário */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Informações do Usuário
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Nome:</span>
              <span className="text-white font-medium">{subscription.userName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">Email:</span>
              <span className="text-white font-medium">{subscription.userEmail}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-blue-200">ID do Usuário:</span>
              <span className="text-white font-medium">#{subscription.userId}</span>
            </div>
          </div>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            {/* IDs Stripe */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <h3 className="text-sm font-semibold text-white mb-3">
                Integração Stripe
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

            {/* Ações Rápidas */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <h3 className="text-sm font-semibold text-white mb-3">
                Ações Rápidas
              </h3>
              <div className="flex flex-wrap gap-2">
                {subscription.isActive ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja cancelar esta assinatura?')) {
                        cancelSubscriptionMutation.mutate();
                      }
                    }}
                    disabled={cancelSubscriptionMutation.isPending}
                    className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Cancelar Assinatura
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja ativar esta assinatura?')) {
                        activateSubscriptionMutation.mutate();
                      }
                    }}
                    disabled={activateSubscriptionMutation.isPending}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Ativar Assinatura
                  </Button>
                )}
              </div>
            </Card>

            {/* Botões de Ação */}
            <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation(`/admin/subscription-details/${id}`)}
                  className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={updateSubscriptionMutation.isPending}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateSubscriptionMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </Card>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}


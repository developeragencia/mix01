import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, adminRequest } from "@/lib/admin-fetch";
import { 
  Crown, 
  Star,
  Plus,
  Edit,
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  X
} from "lucide-react";

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string | null;
  stripePriceId: string;
  price: number;
  currency: string;
  interval: string;
  features: any;
  paymentMethods: string[];
  isActive: boolean;
  createdAt: string;
}

export default function AdminSubscriptionPlans() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    interval: "month",
    features: [] as string[],
    paymentMethods: ["card", "pix"],
    isActive: true
  });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: plans = [], isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['/api/admin/subscription-plans'],
    staleTime: 30000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await adminFetch('/api/admin/subscription-plans');
      if (!response.ok) throw new Error('Failed to fetch plans');
      return response.json();
    }
  });

  const updatePlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/admin/subscription-plans/${data.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/subscription-plans'] });
      toast({
        title: "✅ Plano Atualizado",
        description: "As alterações foram salvas com sucesso"
      });
      setShowDialog(false);
      setEditingPlan(null);
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao atualizar plano",
        variant: "destructive"
      });
    }
  });

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || "",
      price: (plan.price / 100).toString(),
      interval: plan.interval,
      features: Array.isArray(plan.features) ? plan.features : [],
      paymentMethods: plan.paymentMethods || ["card", "pix"],
      isActive: plan.isActive
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!editingPlan) return;
    
    const features = formData.features.filter(f => f.trim() !== "");
    
    updatePlanMutation.mutate({
      id: editingPlan.id,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price) * 100, // Convert to cents
      interval: formData.interval,
      features,
      paymentMethods: formData.paymentMethods,
      isActive: formData.isActive
    });
  };

  const handleFeatureAdd = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
  };

  const handleFeatureRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const togglePaymentMethod = (method: string) => {
    setFormData(prev => {
      const hasMethod = prev.paymentMethods.includes(method);
      return {
        ...prev,
        paymentMethods: hasMethod
          ? prev.paymentMethods.filter(m => m !== method)
          : [...prev.paymentMethods, method]
      };
    });
  };

  const getPlanIcon = (name: string) => {
    if (name.toLowerCase().includes('vip')) return <Star className="w-5 h-5 text-purple-400" />;
    if (name.toLowerCase().includes('premium')) return <Crown className="w-5 h-5 text-yellow-400" />;
    return <CreditCard className="w-5 h-5 text-blue-400" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Planos de Assinatura">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Planos de Assinatura">
      <div className="space-y-4 w-full">
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all">
              {/* Plan Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getPlanIcon(plan.name)}
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-blue-200 text-sm">{plan.description || "Sem descrição"}</p>
                  </div>
                </div>
                <Badge 
                  className={`${plan.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}
                >
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
                  <span className="text-blue-200 text-sm">/{plan.interval === 'month' ? 'mês' : 'ano'}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-4">
                <p className="text-blue-200 text-xs mb-2">Formas de Pagamento:</p>
                <div className="flex flex-wrap gap-1">
                  {plan.paymentMethods.map((method) => (
                    <Badge key={method} variant="outline" className="text-xs bg-blue-700/30 border-blue-600/50">
                      {method === 'card' ? 'Cartão' : method === 'pix' ? 'PIX' : method}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-blue-200 text-xs mb-2">Recursos:</p>
                <div className="space-y-1">
                  {Array.isArray(plan.features) && plan.features.length > 0 ? (
                    plan.features.slice(0, 3).map((feature: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-100">{feature}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-blue-300 text-xs">Nenhum recurso configurado</p>
                  )}
                  {Array.isArray(plan.features) && plan.features.length > 3 && (
                    <p className="text-blue-300 text-xs">+{plan.features.length - 3} mais</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <Button
                onClick={() => handleEdit(plan)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Plano
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Plan Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 border-blue-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Editar Plano: {editingPlan?.name}</DialogTitle>
            <DialogDescription className="text-blue-200">
              Configure todos os detalhes do plano de assinatura
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Nome do Plano</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-blue-700/50 border-blue-600/50 text-white"
                placeholder="Ex: Premium"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-blue-700/50 border-blue-600/50 text-white"
                placeholder="Descrição do plano..."
                rows={2}
              />
            </div>

            {/* Price and Interval */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Preço (R$)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-blue-700/50 border-blue-600/50 text-white"
                  placeholder="29.90"
                />
              </div>
              <div>
                <label className="text-white text-sm font-semibold mb-2 block">Período</label>
                <Select
                  value={formData.interval}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, interval: value }))}
                >
                  <SelectTrigger className="bg-blue-700/50 border-blue-600/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Mensal</SelectItem>
                    <SelectItem value="year">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="text-white text-sm font-semibold mb-3 block">Formas de Pagamento</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.paymentMethods.includes('card')}
                    onCheckedChange={() => togglePaymentMethod('card')}
                    className="border-blue-400"
                  />
                  <label className="text-white text-sm">Cartão de Crédito/Débito</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.paymentMethods.includes('pix')}
                    onCheckedChange={() => togglePaymentMethod('pix')}
                    className="border-blue-400"
                  />
                  <label className="text-white text-sm">PIX</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.paymentMethods.includes('boleto')}
                    onCheckedChange={() => togglePaymentMethod('boleto')}
                    className="border-blue-400"
                  />
                  <label className="text-white text-sm">Boleto</label>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white text-sm font-semibold">Recursos do Plano</label>
                <Button
                  size="sm"
                  onClick={handleFeatureAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="bg-blue-700/50 border-blue-600/50 text-white flex-1"
                      placeholder="Ex: Likes ilimitados"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleFeatureRemove(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
                className="border-blue-400"
              />
              <label className="text-white text-sm">Plano ativo (visível para usuários)</label>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={updatePlanMutation.isPending}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                {updatePlanMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

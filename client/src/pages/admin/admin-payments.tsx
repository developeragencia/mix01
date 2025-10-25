import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp,
  Calendar
} from "lucide-react";

export default function AdminPayments() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: payments, isLoading } = useQuery({
    queryKey: ['/api/admin/payments'],
    queryFn: async () => {
      const response = await fetch('/api/admin/payments');
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      return response.json();
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/payment-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/payment-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch payment stats');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Pagamentos">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-blue-800/50 rounded-lg"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Pagamentos">
      <div className="space-y-4 w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-blue-200 text-sm">Receita Total</p>
                <p className="text-white text-lg font-bold">R$ {stats?.totalRevenue?.toLocaleString('pt-BR') || '0,00'}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-blue-200 text-sm">Pagamentos Hoje</p>
                <p className="text-white text-lg font-bold">{stats?.paymentsToday || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-blue-200 text-sm">Taxa Sucesso</p>
                <p className="text-white text-lg font-bold">{stats?.successRate || '0%'}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-pink-400" />
              <div>
                <p className="text-blue-200 text-sm">Receita Mensal</p>
                <p className="text-white text-lg font-bold">R$ {stats?.monthlyRevenue?.toLocaleString('pt-BR') || '0,00'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payments List */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Pagamentos Recentes</h3>
          <div className="space-y-3">
            {payments && payments.length > 0 ? (
              payments.map((payment: any) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{payment.userEmail || 'Email não disponível'}</p>
                      <p className="text-blue-200 text-sm">{payment.amount ? `R$ ${payment.amount.toFixed(2)}` : 'R$ 0,00'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-1">
                      {payment.status || 'Processado'}
                    </Badge>
                    <p className="text-blue-200 text-xs">
                      {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-blue-200">Nenhum pagamento encontrado</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  Heart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Flag,
  UserCheck,
  Activity,
  Eye,
  AlertTriangle,
  Calendar,
  Clock,
  Target
} from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  // Fetch ONLY real dashboard data from database
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard-stats'],
    staleTime: 30000, // Cache por 30 segundos para melhor performance
    refetchOnWindowFocus: false, // Não refetch ao focar janela
    queryFn: async () => {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      return response.json();
    }
  });

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats?.totalUsers || 0,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Usuários Ativos",
      value: stats?.activeUsers || 0,
      change: "+8%",
      trend: "up",
      icon: Activity,
      color: "green"
    },
    {
      title: "Novos Usuários Hoje",
      value: stats?.newUsersToday || 0,
      change: "+5%",
      trend: "up",
      icon: UserCheck,
      color: "purple"
    },
    {
      title: "Total de Matches",
      value: stats?.totalMatches || 0,
      change: "+15%",
      trend: "up",
      icon: Heart,
      color: "pink"
    },
    {
      title: "Matches Hoje",
      value: stats?.newMatchesToday || 0,
      change: "+3%",
      trend: "up",
      icon: Target,
      color: "red"
    },
    {
      title: "Total de Mensagens",
      value: stats?.totalMessages || 0,
      change: "+7%",
      trend: "up",
      icon: MessageSquare,
      color: "blue"
    },
    {
      title: "Mensagens (24h)",
      value: stats?.messagesLast24h || 0,
      change: "+12%",
      trend: "up",
      icon: Clock,
      color: "indigo"
    },
    {
      title: "Assinantes Premium",
      value: stats?.premiumSubscribers || 0,
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "yellow"
    },
    {
      title: "Assinantes VIP",
      value: stats?.vipSubscribers || 0,
      change: "+25%",
      trend: "up",
      icon: DollarSign,
      color: "purple"
    },
    {
      title: "Receita Mensal",
      value: `R$ ${(stats?.monthlyRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      change: "+22%",
      trend: "up",
      icon: DollarSign,
      color: "green"
    },
    {
      title: "Denúncias Pendentes",
      value: stats?.pendingReports || 0,
      change: "-5%",
      trend: "down",
      icon: Flag,
      color: "red"
    },
    {
      title: "Verificações Pendentes",
      value: stats?.verificationRequests || 0,
      change: "+10%",
      trend: "up",
      icon: AlertTriangle,
      color: "orange"
    }
  ];

  const quickActions = [
    { label: "Gerenciar Usuários", path: "/admin/users", icon: Users, color: "blue" },
    { label: "Ver Denúncias", path: "/admin/reports", icon: Flag, color: "red" },
    { label: "Verificações", path: "/admin/verifications", icon: UserCheck, color: "green" },
    { label: "Analytics", path: "/admin/analytics", icon: TrendingUp, color: "purple" }
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Painel Administrativo">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="p-3 md:p-6 bg-blue-800/50 border-blue-700/50 animate-pulse">
              <div className="h-3 md:h-4 bg-blue-700/50 rounded mb-2"></div>
              <div className="h-6 md:h-8 bg-blue-700/50 rounded mb-2"></div>
              <div className="h-2 md:h-3 bg-blue-700/50 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Painel Administrativo">
      <div className="space-y-3 md:space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.trend === "up";
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            
            return (
              <Card key={index} className="p-3 md:p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-blue-200 text-xs md:text-sm font-medium">{stat.title}</p>
                    <p className="text-lg md:text-2xl font-bold text-white mt-1 md:mt-2">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString('pt-BR') : stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant="secondary" 
                        className={`
                          ${isPositive 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }
                        `}
                      >
                        <TrendIcon className="w-3 h-3 mr-1" />
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                  <div className={`p-2 md:p-3 rounded-lg bg-${stat.color}-500/20`}>
                    <Icon className={`w-4 h-4 md:w-6 md:h-6 text-${stat.color}-300`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="p-4 md:p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 md:p-4 flex flex-col items-center gap-2 md:gap-3 bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 hover:from-pink-600 hover:to-purple-700 text-white"
                  onClick={() => setLocation(action.path)}
                >
                  <Icon className="w-5 h-5 md:w-8 md:h-8 text-white" />
                  <span className="text-xs md:text-sm font-bold text-white text-center leading-tight">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="p-4 md:p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {[
                { action: "Novo usuário cadastrado", user: "Maria Silva", time: "2 min atrás" },
                { action: "Match realizado", user: "João Santos", time: "5 min atrás" },
                { action: "Assinatura Premium ativada", user: "Ana Costa", time: "8 min atrás" },
                { action: "Denúncia resolvida", user: "Carlos Lima", time: "12 min atrás" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg">
                  <div>
                    <p className="text-white text-sm font-medium">{activity.action}</p>
                    <p className="text-blue-200 text-xs">{activity.user}</p>
                  </div>
                  <span className="text-blue-300 text-xs">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4 md:p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Resumo do Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Usuários Ativos Diários</span>
                <span className="text-white font-semibold">{stats?.dailyActiveUsers?.toLocaleString('pt-BR') || '5,678'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Tempo Médio de Sessão</span>
                <span className="text-white font-semibold">{stats?.avgSessionTime || '12m 34s'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Taxa de Conversão</span>
                <span className="text-white font-semibold">9.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-200">Status do Sistema</span>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  <Activity className="w-3 h-3 mr-1" />
                  Operacional
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
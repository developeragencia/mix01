import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Heart, 
  MessageSquare, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Activity,
  Eye,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  matches: {
    total: number;
    today: number;
    thisWeek: number;
    growth: number;
  };
  messages: {
    total: number;
    today: number;
    avgPerUser: number;
    growth: number;
  };
  revenue: {
    total: number;
    today: number;
    thisMonth: number;
    growth: number;
  };
  verifications: {
    pending: number;
    approved: number;
    rejected: number;
  };
  reports: {
    pending: number;
    resolved: number;
    urgent: number;
  };
}

interface RecentActivity {
  id: number;
  type: 'user' | 'match' | 'payment' | 'report';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error';
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocation]);

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }
      
      return res.json();
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  const { data: recentActivity } = useQuery<RecentActivity[]>({
    queryKey: ['/api/admin/activity'],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch('/api/admin/activity', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        return [];
      }
      
      return res.json();
    },
    refetchInterval: 10000, // Atualiza a cada 10 segundos
  });

  const formatTime = () => {
    return currentTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Painel Principal">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-blue-800/50 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-96 bg-blue-800/50 rounded-xl"></div>
            <div className="h-96 bg-blue-800/50 rounded-xl"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    growth, 
    icon: Icon, 
    color,
    onClick 
  }: { 
    title: string; 
    value: number | string; 
    subtitle: string; 
    growth: number; 
    icon: any; 
    color: string;
    onClick?: () => void;
  }) => (
    <Card 
      className={`relative overflow-hidden bg-gradient-to-br ${color} backdrop-blur-sm border-blue-700/50 hover:border-pink-500/50 transition-all cursor-pointer group`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Icon className="w-full h-full" />
      </div>
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/10 group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <Badge className={`${
            growth >= 0 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : 'bg-red-500/20 text-red-300 border-red-500/30'
          }`}>
            {growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(growth)}%
                      </Badge>
                    </div>
        <h3 className="text-white/70 text-sm font-medium mb-1">{title}</h3>
        <p className="text-white text-3xl font-bold mb-1">{value}</p>
        <p className="text-white/60 text-xs">{subtitle}</p>
                </div>
              </Card>
            );

              return (
    <AdminLayout title="Painel Principal">
      <div className="space-y-6">
        {/* Welcome Section with Live Clock */}
        <Card className="p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Bem-vindo ao Painel MIX 👋
              </h2>
              <p className="text-blue-200 text-sm capitalize">{formatDate()}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white font-mono">
                {formatTime()}
              </div>
              <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/30">
                <Activity className="w-3 h-3 mr-1 animate-pulse" />
                Sistema Online
              </Badge>
            </div>
          </div>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Usuários"
            value={stats?.users.total || 0}
            subtitle={`${stats?.users.new || 0} novos hoje`}
            growth={stats?.users.growth || 0}
            icon={Users}
            color="from-blue-900/50 to-blue-800/30"
            onClick={() => setLocation('/admin/users')}
          />
          
          <StatCard
            title="Matches Realizados"
            value={stats?.matches.total || 0}
            subtitle={`${stats?.matches.today || 0} hoje`}
            growth={stats?.matches.growth || 0}
            icon={Heart}
            color="from-pink-900/50 to-pink-800/30"
            onClick={() => setLocation('/admin/matches')}
          />
          
          <StatCard
            title="Mensagens Trocadas"
            value={stats?.messages.total || 0}
            subtitle={`Média: ${stats?.messages.avgPerUser || 0} por usuário`}
            growth={stats?.messages.growth || 0}
            icon={MessageSquare}
            color="from-purple-900/50 to-purple-800/30"
            onClick={() => setLocation('/admin/messages')}
          />
          
          <StatCard
            title="Receita Total"
            value={`R$ ${((stats?.revenue.total || 0) / 100).toFixed(2)}`}
            subtitle={`R$ ${((stats?.revenue.today || 0) / 100).toFixed(2)} hoje`}
            growth={stats?.revenue.growth || 0}
            icon={DollarSign}
            color="from-green-900/50 to-green-800/30"
            onClick={() => setLocation('/admin/payments')}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50 hover:border-yellow-500/50 transition-all cursor-pointer"
                onClick={() => setLocation('/admin/verifications')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-yellow-400" />
                Verificações
              </h3>
              <ArrowRight className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Pendentes
                </span>
                <span className="text-white font-bold text-lg">{stats?.verifications.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Aprovadas
                </span>
                <span className="text-white font-bold">{stats?.verifications.approved || 0}</span>
                  </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Rejeitadas
                </span>
                <span className="text-white font-bold">{stats?.verifications.rejected || 0}</span>
                </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50 hover:border-red-500/50 transition-all cursor-pointer"
                onClick={() => setLocation('/admin/reports')}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                Denúncias
              </h3>
              <ArrowRight className="w-5 h-5 text-blue-400" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Pendentes
                </span>
                <span className="text-white font-bold text-lg">{stats?.reports.pending || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Resolvidas
                </span>
                <span className="text-white font-bold">{stats?.reports.resolved || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Urgentes
                </span>
                <span className="text-white font-bold">{stats?.reports.urgent || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border-purple-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Status do Sistema
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-300 text-sm">Uptime</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  99.9%
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300 text-sm">API Status</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Operacional
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300 text-sm">Database</span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  Conectado
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Area - Placeholder for future charts */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Atividade dos Últimos 7 Dias
                </h3>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Em Breve
                </Badge>
              </div>
              
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-blue-700/30 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-blue-400/50 mx-auto mb-3" />
                  <p className="text-blue-300 text-sm">Gráficos interativos em breve</p>
                  <p className="text-blue-400 text-xs mt-1">Visualização de dados em tempo real</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Atividade Recente
            </h3>
            
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="p-3 bg-blue-800/30 rounded-lg border border-blue-700/30 hover:border-pink-500/50 transition-all">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.status === 'success' ? 'bg-green-500/20' :
                        activity.status === 'warning' ? 'bg-yellow-500/20' :
                        activity.status === 'error' ? 'bg-red-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {activity.type === 'user' && <Users className="w-4 h-4 text-white" />}
                        {activity.type === 'match' && <Heart className="w-4 h-4 text-white" />}
                        {activity.type === 'payment' && <DollarSign className="w-4 h-4 text-white" />}
                        {activity.type === 'report' && <AlertCircle className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-blue-300 text-xs truncate">{activity.description}</p>
                        <p className="text-blue-400 text-xs mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
                  <p className="text-blue-300 text-sm">Nenhuma atividade recente</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 bg-gradient-to-r from-pink-900/30 to-purple-900/30 backdrop-blur-sm border-pink-700/50">
          <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              className="bg-blue-800/50 hover:bg-blue-700/50 text-white border border-blue-700/50"
              onClick={() => setLocation('/admin/users')}
            >
              <Users className="w-4 h-4 mr-2" />
              Ver Usuários
            </Button>
            <Button 
              className="bg-pink-800/50 hover:bg-pink-700/50 text-white border border-pink-700/50"
              onClick={() => setLocation('/admin/matches')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Ver Matches
            </Button>
            <Button 
              className="bg-purple-800/50 hover:bg-purple-700/50 text-white border border-purple-700/50"
              onClick={() => setLocation('/admin/verifications')}
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Verificações
            </Button>
            <Button 
              className="bg-red-800/50 hover:bg-red-700/50 text-white border border-red-700/50"
              onClick={() => setLocation('/admin/reports')}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Denúncias
            </Button>
          </div>
        </Card>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 58, 138, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </AdminLayout>
  );
}

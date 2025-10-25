import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Calendar,
  Target,
  DollarSign,
  Activity,
  Star,
  Zap
} from "lucide-react";

export default function AdminAnalytics() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['/api/admin/analytics'],
    queryFn: async () => {
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      return response.json();
    }
  });

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Analytics e Métricas">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout title="Analytics e Métricas">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
          <h3 className="text-lg font-semibold text-white mb-2">Dados não disponíveis</h3>
          <p className="text-blue-200">Não foi possível carregar os dados de analytics.</p>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics e Métricas">
      <div className="space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Header */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-pink-400" />
            <div>
              <h2 className="text-lg font-semibold text-white">Painel de Analytics</h2>
              <p className="text-blue-200 text-sm">Métricas e insights da plataforma em tempo real</p>
            </div>
          </div>
        </Card>

        {/* Key Metrics Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-200 text-xs truncate">Usuários Ativos</p>
                <p className="text-white text-lg font-bold">{analytics.userGrowth?.current || 0}</p>
                <Badge className={`text-xs mt-1 ${
                  (analytics.userGrowth?.growth || 0) >= 0 
                    ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                    : 'bg-red-500/20 text-red-300 border-red-500/30'
                }`}>
                  {formatPercentage(analytics.userGrowth?.growth || 0)}
                </Badge>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-200 text-xs truncate">Matches Hoje</p>
                <p className="text-white text-lg font-bold">{analytics.engagementMetrics?.matchesToday || 0}</p>
                <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-xs mt-1">
                  {analytics.engagementMetrics?.matchRate || '0%'}
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-200 text-xs truncate">Mensagens</p>
                <p className="text-white text-lg font-bold">{analytics.engagementMetrics?.messagesLast24h || 0}</p>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs mt-1">
                  24h
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-200 text-xs truncate">Receita Mensal</p>
                <p className="text-white text-lg font-bold">{formatCurrency(analytics.revenueMetrics?.monthlyRevenue || 0)}</p>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs mt-1">
                  {formatPercentage(analytics.revenueMetrics?.growth || 0)}
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Metrics Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-yellow-400" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-200 text-xs truncate">Taxa de Like</p>
                <p className="text-white text-lg font-bold">{analytics.engagementMetrics?.likeRate || '0%'}</p>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs mt-1">
                  Swipes
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-200 text-xs truncate">Premium Users</p>
                <p className="text-white text-lg font-bold">{analytics.subscriptionMetrics?.premiumUsers || 0}</p>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs mt-1">
                  Ativos
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-200 text-xs truncate">Super Likes</p>
                <p className="text-white text-lg font-bold">{analytics.engagementMetrics?.superLikesToday || 0}</p>
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs mt-1">
                  Hoje
                </Badge>
              </div>
            </div>
          </Card>

          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-200 text-xs truncate">Taxa Conversão</p>
                <p className="text-white text-lg font-bold">{analytics.subscriptionMetrics?.conversionRate || '0%'}</p>
                <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs mt-1">
                  Premium
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Engagement */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Engajamento dos Usuários
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Usuários ativos diários:</span>
                <span className="text-white font-medium">{analytics.userGrowth?.current || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Tempo médio de sessão:</span>
                <span className="text-white font-medium">{analytics.engagementMetrics?.avgSessionTime || '0m'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Taxa de retenção (7 dias):</span>
                <span className="text-white font-medium">{analytics.userGrowth?.retentionRate || '0%'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Perfis visualizados/dia:</span>
                <span className="text-white font-medium">{analytics.engagementMetrics?.profileViewsToday || 0}</span>
              </div>
            </div>
          </Card>

          {/* Revenue Analytics */}
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Métricas de Receita
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Receita mensal:</span>
                <span className="text-white font-medium">{formatCurrency(analytics.revenueMetrics?.monthlyRevenue || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">MRR (Recurring Revenue):</span>
                <span className="text-white font-medium">{formatCurrency(analytics.revenueMetrics?.mrr || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">ARPU (Avg Revenue/User):</span>
                <span className="text-white font-medium">{formatCurrency(analytics.revenueMetrics?.arpu || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200">Churn rate:</span>
                <span className="text-white font-medium">{analytics.revenueMetrics?.churnRate || '0%'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Growth Trends */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tendências de Crescimento (Últimos 30 dias)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Novos Usuários</div>
              <div className="text-white text-2xl font-bold">{analytics.userGrowth?.newUsersLast30Days || 0}</div>
              <Badge className={`text-xs mt-1 ${
                (analytics.userGrowth?.growth || 0) >= 0 
                  ? 'bg-green-500/20 text-green-300' 
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {formatPercentage(analytics.userGrowth?.growth || 0)}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Novos Matches</div>
              <div className="text-white text-2xl font-bold">{analytics.engagementMetrics?.matchesLast30Days || 0}</div>
              <Badge className="bg-pink-500/20 text-pink-300 text-xs mt-1">
                {analytics.engagementMetrics?.matchGrowth || '0%'}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Novas Assinaturas</div>
              <div className="text-white text-2xl font-bold">{analytics.subscriptionMetrics?.newSubscriptionsLast30Days || 0}</div>
              <Badge className="bg-green-500/20 text-green-300 text-xs mt-1">
                {formatPercentage(analytics.subscriptionMetrics?.subscriptionGrowth || 0)}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Platform Health */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Saúde da Plataforma
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-blue-200 text-xs mb-1">Uptime</div>
              <div className="text-green-300 text-lg font-bold">99.9%</div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">Resposta API</div>
              <div className="text-green-300 text-lg font-bold">120ms</div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">Relatórios Pendentes</div>
              <div className="text-white text-lg font-bold">{analytics.moderationMetrics?.pendingReports || 0}</div>
            </div>
            <div>
              <div className="text-blue-200 text-xs mb-1">Verificações Pendentes</div>
              <div className="text-white text-lg font-bold">{analytics.moderationMetrics?.pendingVerifications || 0}</div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
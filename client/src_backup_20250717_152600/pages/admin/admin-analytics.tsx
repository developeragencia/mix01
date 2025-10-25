import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  MessageSquare, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";

export default function AdminAnalytics() {
  const [, setLocation] = useLocation();
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const analyticsData = {
    userGrowth: {
      current: 12547,
      previous: 11234,
      percentage: 11.7,
      trend: "up"
    },
    matchRate: {
      current: 34.5,
      previous: 32.1,
      percentage: 7.5,
      trend: "up"
    },
    messageVolume: {
      current: 123456,
      previous: 118902,
      percentage: 3.8,
      trend: "up"
    },
    revenue: {
      current: 45678.90,
      previous: 39823.45,
      percentage: 14.7,
      trend: "up"
    },
    retention: {
      daily: 68.5,
      weekly: 45.2,
      monthly: 23.1
    },
    demographics: {
      ageGroups: [
        { range: "18-24", percentage: 35.2 },
        { range: "25-34", percentage: 42.8 },
        { range: "35-44", percentage: 18.6 },
        { range: "45+", percentage: 3.4 }
      ],
      genderDistribution: {
        male: 52.3,
        female: 45.8,
        other: 1.9
      }
    },
    topCities: [
      { city: "São Paulo", users: 3245 },
      { city: "Rio de Janeiro", users: 2156 },
      { city: "Belo Horizonte", users: 1867 },
      { city: "Porto Alegre", users: 1432 },
      { city: "Brasília", users: 1234 }
    ]
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <AdminLayout currentPage="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics e Relatórios</h1>
            <p className="text-gray-600">Análise detalhada da performance da plataforma</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crescimento de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.userGrowth.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{formatPercentage(analyticsData.userGrowth.percentage)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Match</p>
                <p className="text-2xl font-bold text-gray-900">{formatPercentage(analyticsData.matchRate.current)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{formatPercentage(analyticsData.matchRate.percentage)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume de Mensagens</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.messageVolume.current.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{formatPercentage(analyticsData.messageVolume.percentage)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.revenue.current)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{formatPercentage(analyticsData.revenue.percentage)}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Retention */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Retenção de Usuários</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Retenção Diária</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${analyticsData.retention.daily}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(analyticsData.retention.daily)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Retenção Semanal</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${analyticsData.retention.weekly}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(analyticsData.retention.weekly)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Retenção Mensal</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${analyticsData.retention.monthly}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(analyticsData.retention.monthly)}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Demographics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demografia por Idade</h3>
            <div className="space-y-3">
              {analyticsData.demographics.ageGroups.map((group, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{group.range} anos</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${group.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{formatPercentage(group.percentage)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Principais Cidades</h3>
            <div className="space-y-3">
              {analyticsData.topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{city.city}</span>
                  </div>
                  <span className="text-sm text-gray-600">{city.users.toLocaleString()} usuários</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Gênero</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Masculino</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full" 
                      style={{ width: `${analyticsData.demographics.genderDistribution.male}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(analyticsData.demographics.genderDistribution.male)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Feminino</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-pink-500 h-3 rounded-full" 
                      style={{ width: `${analyticsData.demographics.genderDistribution.female}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(analyticsData.demographics.genderDistribution.female)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Outro</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-3 mr-3">
                    <div 
                      className="bg-purple-500 h-3 rounded-full" 
                      style={{ width: `${analyticsData.demographics.genderDistribution.other * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{formatPercentage(analyticsData.demographics.genderDistribution.other)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  TrendingUp, 
  Users, 
  Mail,
  Megaphone,
  Target,
  BarChart3,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  Send,
  Edit,
  Trash2,
  Plus,
  Activity
} from "lucide-react";

export default function AdminMarketing() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("campaigns");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Mock marketing data
  const { data: marketingData } = useQuery({
    queryKey: ["admin-marketing"],
    queryFn: async () => {
      return {
        campaigns: [
          {
            id: 1,
            name: "Campanha Verão 2024",
            type: "push_notification",
            status: "active",
            target: "all_users",
            audience: 25847,
            sent: 23456,
            opened: 12543,
            clicked: 3876,
            conversion: 234,
            budget: 5000,
            spent: 3200,
            createdAt: "2024-06-15T10:00:00Z",
            endsAt: "2024-06-30T23:59:59Z"
          },
          {
            id: 2,
            name: "Reativação de Usuários",
            type: "email",
            status: "completed",
            target: "inactive_users",
            audience: 5432,
            sent: 5432,
            opened: 2165,
            clicked: 543,
            conversion: 87,
            budget: 2000,
            spent: 1800,
            createdAt: "2024-06-01T09:00:00Z",
            endsAt: "2024-06-10T23:59:59Z"
          },
          {
            id: 3,
            name: "Novos Recursos Premium",
            type: "in_app",
            status: "draft",
            target: "premium_users",
            audience: 2890,
            sent: 0,
            opened: 0,
            clicked: 0,
            conversion: 0,
            budget: 1500,
            spent: 0,
            createdAt: "2024-06-20T14:00:00Z",
            endsAt: "2024-07-05T23:59:59Z"
          }
        ],
        metrics: {
          totalCampaigns: 47,
          activeCampaigns: 8,
          totalReach: 156789,
          averageOpenRate: 42.3,
          averageClickRate: 8.7,
          conversionRate: 2.1,
          totalBudget: 45000,
          totalSpent: 32100
        },
        segments: [
          { name: "Todos os Usuários", count: 25847, growth: 8.2 },
          { name: "Usuários Ativos", count: 18932, growth: 12.5 },
          { name: "Usuários Premium", count: 2890, growth: 15.7 },
          { name: "Usuários Inativos", count: 5432, growth: -5.3 },
          { name: "Novos Usuários (30d)", count: 3456, growth: 22.1 }
        ]
      };
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Concluída</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Rascunho</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Pausada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecida</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-5 h-5 text-blue-500" />;
      case "push_notification":
        return <Megaphone className="w-5 h-5 text-green-500" />;
      case "in_app":
        return <Target className="w-5 h-5 text-purple-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const calculateRate = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
  };

  if (!marketingData) {
    return (
      <AdminLayout currentPage="marketing">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Carregando dados de marketing...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="marketing">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Marketing</h1>
            <p className="text-white/80">Gerencie campanhas, segmentos e métricas de marketing</p>
          </div>
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Campanha
          </Button>
        </div>

        {/* Marketing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Campanhas Ativas</p>
                <p className="text-2xl font-bold text-white">{marketingData.metrics.activeCampaigns}</p>
                <p className="text-sm text-green-300 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {marketingData.metrics.totalCampaigns} total
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Alcance Total</p>
                <p className="text-2xl font-bold text-white">{marketingData.metrics.totalReach.toLocaleString()}</p>
                <p className="text-sm text-blue-300 flex items-center mt-1">
                  <Eye className="w-3 h-3 mr-1" />
                  {marketingData.metrics.averageOpenRate}% abertura
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Taxa de Clique</p>
                <p className="text-2xl font-bold text-white">{marketingData.metrics.averageClickRate}%</p>
                <p className="text-sm text-purple-300 flex items-center mt-1">
                  <MousePointer className="w-3 h-3 mr-1" />
                  {marketingData.metrics.conversionRate}% conversão
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-300" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Orçamento Gasto</p>
                <p className="text-2xl font-bold text-white">R$ {marketingData.metrics.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-yellow-300 flex items-center mt-1">
                  <DollarSign className="w-3 h-3 mr-1" />
                  R$ {marketingData.metrics.totalBudget.toLocaleString()} total
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "campaigns"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Campanhas
          </button>
          <button
            onClick={() => setActiveTab("segments")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "segments"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Segmentos
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "analytics"
                ? "bg-white/20 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && (
          <div className="space-y-4">
            {marketingData.campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getTypeIcon(campaign.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-white/70">Audiência</p>
                          <p className="text-lg font-semibold text-white">{campaign.audience.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/70">Enviados</p>
                          <p className="text-lg font-semibold text-white">{campaign.sent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/70">Taxa de Abertura</p>
                          <p className="text-lg font-semibold text-white">
                            {calculateRate(campaign.opened, campaign.sent)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-white/70">Conversões</p>
                          <p className="text-lg font-semibold text-white">{campaign.conversion}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {campaign.status === "active" && (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-white/70 mb-1">
                            <span>Progresso</span>
                            <span>{calculateRate(campaign.sent, campaign.audience)}%</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full" 
                              style={{ width: `${calculateRate(campaign.sent, campaign.audience)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span>Criada: {new Date(campaign.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span>Termina: {new Date(campaign.endsAt).toLocaleDateString('pt-BR')}</span>
                        <span>Orçamento: R$ {campaign.budget.toLocaleString()} / Gasto: R$ {campaign.spent.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-blue-500/20 border-blue-300/30 text-blue-300 hover:bg-blue-500/30"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    {campaign.status === "draft" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Enviar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Segments Tab */}
        {activeTab === "segments" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketingData.segments.map((segment, index) => (
              <Card key={index} className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{segment.name}</h3>
                  <Button size="sm" variant="outline" className="bg-white/10 border-white/30 text-white">
                    <Target className="w-4 h-4 mr-1" />
                    Segmentar
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Usuários</span>
                    <span className="text-white font-semibold">{segment.count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Crescimento</span>
                    <span className={`font-semibold ${segment.growth > 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {segment.growth > 0 ? '+' : ''}{segment.growth}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Performance por Tipo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-white">Email</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">45.2% abertura</p>
                    <p className="text-white/60 text-sm">12.3% clique</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Megaphone className="w-4 h-4 text-green-400" />
                    <span className="text-white">Push</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">38.7% abertura</p>
                    <p className="text-white/60 text-sm">8.9% clique</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-white">In-App</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">67.4% visualização</p>
                    <p className="text-white/60 text-sm">15.6% clique</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">ROI por Campanha</h3>
              <div className="space-y-4">
                {marketingData.campaigns.filter(c => c.status === "completed").map((campaign) => {
                  const roi = campaign.spent > 0 ? ((campaign.conversion * 50 - campaign.spent) / campaign.spent * 100) : 0;
                  return (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <span className="text-white">{campaign.name}</span>
                      <div className="text-right">
                        <p className={`font-semibold ${roi > 0 ? 'text-green-300' : 'text-red-300'}`}>
                          {roi > 0 ? '+' : ''}{roi.toFixed(1)}%
                        </p>
                        <p className="text-white/60 text-sm">R$ {campaign.spent.toLocaleString()} gasto</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
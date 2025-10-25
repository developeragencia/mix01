import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  AlertTriangle
} from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Mock dashboard data - in real app would come from API
  const dashboardStats = {
    totalUsers: 12547,
    activeUsers: 8432,
    totalMatches: 34567,
    newMatchesToday: 156,
    totalMessages: 123456,
    messagesLast24h: 2341,
    premiumSubscribers: 1234,
    monthlyRevenue: 45678.90,
    pendingReports: 23,
    verificationRequests: 45
  };

  const recentActivity = [
    { id: 1, type: "new_user", message: "Novo usuário cadastrado: Maria Silva", time: "5 min atrás" },
    { id: 2, type: "report", message: "Nova denúncia recebida - Usuário ID: 1234", time: "12 min atrás" },
    { id: 3, type: "subscription", message: "Nova assinatura Premium - João Santos", time: "25 min atrás" },
    { id: 4, type: "match", message: "1000° match do dia atingido!", time: "1h atrás" },
    { id: 5, type: "verification", message: "Solicitação de verificação - Ana Costa", time: "2h atrás" }
  ];

  const quickActions = [
    { label: "Revisar Denúncias", icon: Flag, action: () => setLocation("/admin/reports"), urgent: true },
    { label: "Verificar Perfis", icon: UserCheck, action: () => setLocation("/admin/profiles"), count: 45 },
    { label: "Ver Analytics", icon: TrendingUp, action: () => setLocation("/admin/analytics") },
    { label: "Gerenciar Usuários", icon: Users, action: () => setLocation("/admin/users") }
  ];

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600">Visão geral da plataforma MIX</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            <Activity className="w-4 h-4 mr-2" />
            Atualizar Dados
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuários Totais</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% este mês
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Matches Totais</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalMatches.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Heart className="w-3 h-3 mr-1" />
                  +{dashboardStats.newMatchesToday} hoje
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mensagens (24h)</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.messagesLast24h.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% vs ontem
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Mensal</p>
                <p className="text-2xl font-bold text-gray-900">R$ {dashboardStats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% este mês
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                  Atenção Requerida
                </h3>
                <p className="text-gray-600 mt-1">{dashboardStats.pendingReports} denúncias pendentes</p>
                <p className="text-gray-600">{dashboardStats.verificationRequests} solicitações de verificação</p>
              </div>
              <Button 
                onClick={() => setLocation("/admin/reports")}
                className="bg-red-600 hover:bg-red-700"
              >
                Revisar
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                  Performance
                </h3>
                <p className="text-gray-600 mt-1">{dashboardStats.activeUsers.toLocaleString()} usuários ativos</p>
                <p className="text-gray-600">{dashboardStats.premiumSubscribers.toLocaleString()} assinantes Premium</p>
              </div>
              <Button 
                onClick={() => setLocation("/admin/analytics")}
                variant="outline"
              >
                Ver Detalhes
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      action.urgent 
                        ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className={`w-5 h-5 mr-3 ${action.urgent ? 'text-red-600' : 'text-gray-600'}`} />
                      <span className="font-medium text-gray-900">{action.label}</span>
                    </div>
                    {action.count && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                        {action.count}
                      </span>
                    )}
                    {action.urgent && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        Urgente
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'report' ? 'bg-red-500' :
                    activity.type === 'new_user' ? 'bg-green-500' :
                    activity.type === 'subscription' ? 'bg-blue-500' :
                    activity.type === 'match' ? 'bg-pink-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setLocation("/admin/analytics")}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Todas as Atividades
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
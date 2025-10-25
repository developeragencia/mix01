import { useQuery } from "@tanstack/react-query";
import { Users, Heart, MessageCircle, TrendingUp, Shield, Settings } from "lucide-react";

export function Admin() {
  // Mock admin data - in real app this would come from protected API
  const adminData = {
    totalUsers: 45230,
    activeUsers: 12850,
    totalMatches: 8945,
    totalMessages: 156230,
    verificationRequests: 23,
    reports: 12,
    growthRate: 15.2,
    activeToday: 2340
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-3xl font-bold">Dashboard Admin</h1>
            <p className="text-white opacity-90">Painel de controle do MIX</p>
          </div>
          <div className="flex items-center space-x-4">
            <Settings className="w-6 h-6 text-white" />
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">A</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="mix-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">+{adminData.growthRate}%</span>
            </div>
            <h3 className="text-white text-2xl font-bold">{adminData.totalUsers.toLocaleString()}</h3>
            <p className="text-white opacity-80 text-sm">Total de usuários</p>
          </div>

          <div className="mix-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-400 text-sm font-semibold">Hoje</span>
            </div>
            <h3 className="text-white text-2xl font-bold">{adminData.activeUsers.toLocaleString()}</h3>
            <p className="text-white opacity-80 text-sm">Usuários ativos</p>
          </div>

          <div className="mix-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-purple-300 text-sm font-semibold">Total</span>
            </div>
            <h3 className="text-white text-2xl font-bold">{adminData.totalMatches.toLocaleString()}</h3>
            <p className="text-white opacity-80 text-sm">Matches realizados</p>
          </div>

          <div className="mix-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-blue-300 text-sm font-semibold">Total</span>
            </div>
            <h3 className="text-white text-2xl font-bold">{adminData.totalMessages.toLocaleString()}</h3>
            <p className="text-white opacity-80 text-sm">Mensagens enviadas</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="mix-card p-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Moderação</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Solicitações de verificação</span>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {adminData.verificationRequests}
                  </span>
                  <button className="text-purple-300 text-sm font-medium">Ver</button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white">Denúncias pendentes</span>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {adminData.reports}
                  </span>
                  <button className="text-purple-300 text-sm font-medium">Ver</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mix-card p-6">
            <h3 className="text-white font-semibold text-lg mb-4">Ações rápidas</h3>
            <div className="space-y-3">
              <button className="w-full py-3 bg-blue-600 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all">
                Gerenciar usuários
              </button>
              <button className="w-full py-3 bg-green-600 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all">
                Relatórios
              </button>
              <button className="w-full py-3 bg-purple-600 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all">
                Configurações
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mix-card p-6">
          <h3 className="text-white font-semibold text-lg mb-4">Atividade recente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Novo usuário cadastrado: Maria Silva</p>
                <p className="text-white opacity-70 text-xs">Há 2 minutos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Novo match: Carlos e Ana</p>
                <p className="text-white opacity-70 text-xs">Há 5 minutos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Solicitação de verificação: Ricardo Santos</p>
                <p className="text-white opacity-70 text-xs">Há 10 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
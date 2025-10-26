import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  Eye, 
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  UserCheck,
  AlertCircle,
  ChevronDown,
  X
} from "lucide-react";

interface User {
  id: number;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  location?: string;
  createdAt: string;
  lastLoginAt?: string;
  isVerified?: boolean;
  subscriptionStatus?: 'free' | 'premium' | 'vip';
  profileComplete?: boolean;
}

export default function AdminUsers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'unverified'>('all');
  const [filterSubscription, setFilterSubscription] = useState<'all' | 'free' | 'premium' | 'vip'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'active'>('newest');

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Erro ao carregar usuários');
      }
      
      return res.json();
    },
    refetchInterval: 30000,
  });

  const filteredUsers = users?.filter(user => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower) ||
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower);

    // Status filter
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'verified' && user.isVerified) ||
      (filterStatus === 'unverified' && !user.isVerified);

    // Subscription filter
    const matchesSubscription = filterSubscription === 'all' || 
      user.subscriptionStatus === filterSubscription;

    return matchesSearch && matchesStatus && matchesSubscription;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return (b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0) - 
             (a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0);
    }
  });

  const stats = {
    total: users?.length || 0,
    verified: users?.filter(u => u.isVerified).length || 0,
    premium: users?.filter(u => u.subscriptionStatus !== 'free').length || 0,
    active: users?.filter(u => {
      if (!u.lastLoginAt) return false;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(u.lastLoginAt) > weekAgo;
    }).length || 0
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getSubscriptionBadge = (status?: string) => {
    switch (status) {
      case 'vip':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">VIP</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Premium</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Free</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciamento de Usuários">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-blue-800/50 rounded-xl"></div>
          ))}
          </div>
          <div className="h-96 bg-blue-800/50 rounded-xl"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciamento de Usuários">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total de Usuários</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm border-green-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Verificados</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.verified}</p>
              </div>
              <UserCheck className="w-10 h-10 text-green-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-sm border-purple-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Premium/VIP</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.premium}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-sm border-pink-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm font-medium">Ativos (7 dias)</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.active}</p>
              </div>
              <Clock className="w-10 h-10 text-pink-400" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search Bar */}
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <Input
                  type="text"
                  placeholder="Buscar por email, nome ou username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-blue-800/50 border-blue-700/50 text-white placeholder:text-blue-400 h-12"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
            </div>

              {/* Filter Toggle Button */}
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700/50 h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              {/* Export Button */}
              <Button
                variant="outline"
                className="bg-green-800/50 border-green-700/50 text-green-300 hover:bg-green-700/50 h-12"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-blue-700/50">
                {/* Status Filter */}
                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block">Status de Verificação</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    <option value="verified">Verificados</option>
                    <option value="unverified">Não Verificados</option>
                  </select>
                </div>

                {/* Subscription Filter */}
                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block">Tipo de Assinatura</label>
                  <select
                    value={filterSubscription}
                    onChange={(e) => setFilterSubscription(e.target.value as any)}
                    className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block">Ordenar Por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2"
                  >
                    <option value="newest">Mais Recentes</option>
                    <option value="oldest">Mais Antigos</option>
                    <option value="active">Mais Ativos</option>
                  </select>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {(searchTerm || filterStatus !== 'all' || filterSubscription !== 'all') && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-blue-300 text-sm">Filtros ativos:</span>
                {searchTerm && (
                  <Badge className="bg-blue-700/50 text-blue-200">
                    Busca: {searchTerm}
                    <button onClick={() => setSearchTerm("")} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterStatus !== 'all' && (
                  <Badge className="bg-blue-700/50 text-blue-200">
                    Status: {filterStatus}
                    <button onClick={() => setFilterStatus('all')} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterSubscription !== 'all' && (
                  <Badge className="bg-blue-700/50 text-blue-200">
                    Assinatura: {filterSubscription}
                    <button onClick={() => setFilterSubscription('all')} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus('all');
                    setFilterSubscription('all');
                  }}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Limpar todos
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Results Count */}
              <div className="flex items-center justify-between">
          <p className="text-blue-300 text-sm">
            Mostrando <span className="font-bold text-white">{filteredUsers?.length || 0}</span> de <span className="font-bold text-white">{users?.length || 0}</span> usuários
          </p>
                  </div>
                  
        {/* Users Table */}
        <Card className="bg-blue-900/30 backdrop-blur-sm border-blue-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-800/50 border-b border-blue-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Assinatura
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-blue-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-700/30">
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-blue-800/30 transition-colors cursor-pointer"
                      onClick={() => setLocation(`/admin/users/${user.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.firstName?.[0] || user.email[0].toUpperCase()}
                    </div>
                          <div>
                            <p className="text-white font-medium flex items-center gap-2">
                              {user.firstName || user.username || user.email.split('@')[0]}
                              {user.isVerified && (
                                <CheckCircle className="w-4 h-4 text-blue-400" />
                              )}
                            </p>
                            <p className="text-blue-400 text-sm flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                    </div>
                  </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.isVerified ? (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verificado
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pendente
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSubscriptionBadge(user.subscriptionStatus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white text-sm flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-blue-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-white text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          {formatDate(user.lastLoginAt)}
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                  <Button
                    size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/admin/users/${user.id}`);
                          }}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                      <p className="text-blue-300 text-lg">Nenhum usuário encontrado</p>
                      <p className="text-blue-400 text-sm mt-2">
                        {searchTerm || filterStatus !== 'all' || filterSubscription !== 'all'
                          ? 'Tente ajustar os filtros de busca'
                          : 'Não há usuários cadastrados ainda'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
              </div>
            </Card>
      </div>
    </AdminLayout>
  );
}

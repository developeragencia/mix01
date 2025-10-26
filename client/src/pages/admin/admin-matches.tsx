import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Heart,
  Search,
  Filter,
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  X,
  MapPin,
  Zap
} from "lucide-react";

interface Match {
  id: number;
  user1Id: number;
  user2Id: number;
  user1Name: string;
  user2Name: string;
  user1Photo?: string;
  user2Photo?: string;
  matchedAt: string;
  status: 'active' | 'inactive' | 'blocked';
  messageCount: number;
  lastMessageAt?: string;
  compatibility?: number;
}

export default function AdminMatches() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'blocked'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'active'>('newest');

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: matches, isLoading } = useQuery<Match[]>({
    queryKey: ['/api/admin/matches'],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch('/api/admin/matches', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Erro ao carregar matches');
      }
      
      return res.json();
    },
    refetchInterval: 30000,
  });

  const filteredMatches = matches?.filter(match => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      match.user1Name.toLowerCase().includes(searchLower) ||
      match.user2Name.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus === 'all' || match.status === filterStatus;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.matchedAt).getTime() - new Date(b.matchedAt).getTime();
    } else {
      return (b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0) - 
             (a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0);
    }
  });

  const stats = {
    total: matches?.length || 0,
    active: matches?.filter(m => m.status === 'active').length || 0,
    today: matches?.filter(m => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(m.matchedAt) >= today;
    }).length || 0,
    thisWeek: matches?.filter(m => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(m.matchedAt) >= weekAgo;
    }).length || 0
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}min atrás`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias atrás`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30"><Clock className="w-3 h-3 mr-1" />Inativo</Badge>;
      case 'blocked':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Bloqueado</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Desconhecido</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciamento de Matches">
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
    <AdminLayout title="Gerenciamento de Matches">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-pink-900/50 to-pink-800/30 backdrop-blur-sm border-pink-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-300 text-sm font-medium">Total de Matches</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Heart className="w-10 h-10 text-pink-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm border-green-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Matches Ativos</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.active}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Hoje</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.today}</p>
              </div>
              <Zap className="w-10 h-10 text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-sm border-purple-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-sm font-medium">Esta Semana</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.thisWeek}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-purple-400" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome de usuário..."
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

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700/50 h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-700/50">
                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="blocked">Bloqueados</option>
                  </select>
                </div>

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
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-blue-300 text-sm">
            Mostrando <span className="font-bold text-white">{filteredMatches?.length || 0}</span> de <span className="font-bold text-white">{matches?.length || 0}</span> matches
          </p>
        </div>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches && filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <Card 
                key={match.id} 
                className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50 hover:border-pink-500/50 transition-all cursor-pointer group"
                onClick={() => setLocation(`/admin/match-details/${match.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Heart className="w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-white font-semibold text-lg">Match #{match.id}</h3>
                      <p className="text-blue-400 text-sm">{formatDate(match.matchedAt)}</p>
                    </div>
                  </div>
                  {getStatusBadge(match.status)}
                </div>

                {/* Users */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-800/30 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      {match.user1Photo ? (
                        <img src={match.user1Photo} alt={match.user1Name} className="w-full h-full object-cover" />
                      ) : (
                        match.user1Name[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{match.user1Name}</p>
                      <p className="text-blue-400 text-xs">Usuário #{match.user1Id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-800/30 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      {match.user2Photo ? (
                        <img src={match.user2Photo} alt={match.user2Name} className="w-full h-full object-cover" />
                      ) : (
                        match.user2Name[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{match.user2Name}</p>
                      <p className="text-blue-400 text-xs">Usuário #{match.user2Id}</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300">{match.messageCount} mensagens</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300">{formatTimeAgo(match.lastMessageAt)}</span>
                  </div>
                </div>

                {match.compatibility && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-blue-300">Compatibilidade</span>
                      <span className="text-white font-bold">{match.compatibility}%</span>
                    </div>
                    <div className="w-full bg-blue-800/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${match.compatibility}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/admin/match-details/${match.id}`);
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
              </Card>
            ))
          ) : (
            <div className="col-span-2">
              <Card className="p-12 bg-blue-900/30 backdrop-blur-sm border-blue-700/50 text-center">
                <Heart className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                <p className="text-blue-300 text-lg">Nenhum match encontrado</p>
                <p className="text-blue-400 text-sm mt-2">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Não há matches registrados ainda'}
                </p>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Heart, 
  MessageSquare, 
  Calendar,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Filter,
  MapPin
} from "lucide-react";

export default function AdminMatches() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: matches, isLoading } = useQuery({
    queryKey: ['/api/admin/matches', searchTerm, dateFilter],
    queryFn: async () => {
      const response = await fetch(`/api/admin/matches?search=${searchTerm}&date=${dateFilter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      return response.json();
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/match-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/match-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch match stats');
      }
      return response.json();
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Ativo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Inativo</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{status}</Badge>;
    }
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

  const filteredMatches = matches?.filter(match => {
    const searchText = `${match.user1.name} ${match.user2.name}`.toLowerCase();
    const matchesSearch = searchText.includes(searchTerm.toLowerCase());
    
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      const matchDate = new Date(match.createdAt).toDateString();
      return matchesSearch && matchDate === today;
    }
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Matches">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-blue-800/50 rounded-lg"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Matches">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-400" />
              <div>
                <p className="text-blue-200 text-sm">Total de Matches</p>
                <p className="text-white text-xl font-bold">{stats?.totalMatches?.toLocaleString('pt-BR') || '0'}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-blue-200 text-sm">Matches Ativos</p>
                <p className="text-white text-xl font-bold">{stats?.activeMatches?.toLocaleString('pt-BR') || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-blue-200 text-sm">Matches Hoje</p>
                <p className="text-white text-xl font-bold">{stats?.matchesToday || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-blue-200 text-sm">Msgs por Match</p>
                <p className="text-white text-xl font-bold">{stats?.avgMessagesPerMatch || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-blue-200 text-sm">Taxa de Match</p>
                <p className="text-white text-xl font-bold">{stats?.matchRate || '0'}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar matches por nome dos usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 bg-blue-700/50 border border-blue-600/50 rounded-md text-white"
              >
                <option value="all">Todos os Períodos</option>
                <option value="today">Hoje</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
              </select>
              <Button variant="outline" className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Matches List */}
        <div className="space-y-4">
          {filteredMatches?.map((match) => (
            <Card key={match.id} className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {/* User 1 */}
                  <div className="flex items-center gap-3">
                    <img
                      src={match.user1.photo}
                      alt={match.user1.name}
                      className="w-12 h-12 rounded-full bg-blue-700/50"
                    />
                    <div>
                      <p className="text-white font-medium">{match.user1.name}</p>
                      <p className="text-blue-200 text-sm">{match.user1.age} anos</p>
                      <p className="text-blue-300 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {match.user1.location}
                      </p>
                    </div>
                  </div>

                  {/* Match Icon */}
                  <div className="flex flex-col items-center gap-2">
                    <Heart className="w-8 h-8 text-pink-400 fill-current" />
                    {getStatusBadge(match.status)}
                  </div>

                  {/* User 2 */}
                  <div className="flex items-center gap-3">
                    <img
                      src={match.user2.photo}
                      alt={match.user2.name}
                      className="w-12 h-12 rounded-full bg-blue-700/50"
                    />
                    <div>
                      <p className="text-white font-medium">{match.user2.name}</p>
                      <p className="text-blue-200 text-sm">{match.user2.age} anos</p>
                      <p className="text-blue-300 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {match.user2.location}
                      </p>
                    </div>
                  </div>

                  {/* Match Info */}
                  <div className="text-right">
                    <p className="text-blue-200 text-sm">Match criado em:</p>
                    <p className="text-white text-sm font-medium">{formatDate(match.createdAt)}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-blue-300">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {match.messagesCount} mensagens
                      </span>
                      <span>Última: {formatDate(match.lastMessage)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                    onClick={() => setLocation(`/admin/matches/${match.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-600/50 text-blue-200 hover:bg-blue-700/50"
                    onClick={() => setLocation(`/admin/matches/${match.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-600/50 text-purple-300 hover:bg-purple-700/50"
                    onClick={() => setLocation(`/admin/matches/${match.id}/messages`)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Mensagens
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredMatches?.length === 0 && (
          <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
            <p className="text-blue-200">Nenhum match encontrado com os filtros aplicados.</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
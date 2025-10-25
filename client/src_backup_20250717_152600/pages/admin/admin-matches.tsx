import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Search, 
  Filter, 
  MessageSquare, 
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  Clock,
  Eye
} from "lucide-react";

export default function AdminMatches() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Mock matches data with real database structure
  const { data: matches = [] } = useQuery({
    queryKey: ["admin-matches", searchTerm, filterType],
    queryFn: async () => {
      return [
        {
          id: 1,
          user1: {
            id: 123,
            name: "Alex Developer",
            email: "alex@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=60",
            age: 28,
            location: "São Paulo, SP"
          },
          user2: {
            id: 456,
            name: "Maria Silva", 
            email: "maria@example.com",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2bc?w=64&h=64&fit=crop&crop=face&auto=format&q=60",
            age: 25,
            location: "São Paulo, SP"
          },
          matchedAt: "2024-06-20T10:30:00Z",
          messagesCount: 15,
          lastMessageAt: "2024-06-22T14:20:00Z",
          status: "active",
          conversationActive: true
        },
        {
          id: 2,
          user1: {
            id: 789,
            name: "João Santos",
            email: "joao@example.com", 
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&auto=format&q=60",
            age: 32,
            location: "Rio de Janeiro, RJ"
          },
          user2: {
            id: 321,
            name: "Ana Costa",
            email: "ana@example.com",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format&q=60",
            age: 29,
            location: "Rio de Janeiro, RJ"
          },
          matchedAt: "2024-06-19T16:45:00Z",
          messagesCount: 3,
          lastMessageAt: "2024-06-19T18:10:00Z",
          status: "inactive",
          conversationActive: false
        }
      ];
    }
  });

  const matchStats = {
    totalMatches: 15847,
    activeMatches: 8932,
    inactiveMatches: 6915,
    dailyMatches: 234,
    averageMessages: 12.5,
    conversionRate: 67.3
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.user1.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.user2.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || match.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout currentPage="matches">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Matches</h1>
          <p className="text-white/80">Monitore e gerencie conexões entre usuários</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Matches Totais</p>
                <p className="text-2xl font-bold text-white">{matchStats.totalMatches.toLocaleString()}</p>
                <p className="text-sm text-green-300 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% este mês
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-300" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Matches Ativos</p>
                <p className="text-2xl font-bold text-white">{matchStats.activeMatches.toLocaleString()}</p>
                <p className="text-sm text-blue-300 flex items-center mt-1">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {matchStats.conversionRate}% taxa conversão
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Matches Hoje</p>
                <p className="text-2xl font-bold text-white">{matchStats.dailyMatches}</p>
                <p className="text-sm text-yellow-300 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Média {matchStats.averageMessages} mensagens
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome de usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/60"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-pink-500"
              >
                <option value="all" className="bg-blue-900 text-white">Todos os Status</option>
                <option value="active" className="bg-blue-900 text-white">Ativos</option>
                <option value="inactive" className="bg-blue-900 text-white">Inativos</option>
                <option value="blocked" className="bg-blue-900 text-white">Bloqueados</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Matches List */}
        <div className="space-y-4">
          {filteredMatches.map((match) => (
            <Card key={match.id} className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* User 1 */}
                  <div className="flex items-center space-x-3">
                    <img 
                      src={match.user1.avatar} 
                      alt={match.user1.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{match.user1.name}</h3>
                      <p className="text-sm text-white/70">{match.user1.age} anos</p>
                      <p className="text-xs text-white/50 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {match.user1.location}
                      </p>
                    </div>
                  </div>

                  {/* Match Icon */}
                  <div className="flex items-center">
                    <Heart className="w-6 h-6 text-pink-400" />
                  </div>

                  {/* User 2 */}
                  <div className="flex items-center space-x-3">
                    <img 
                      src={match.user2.avatar} 
                      alt={match.user2.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{match.user2.name}</h3>
                      <p className="text-sm text-white/70">{match.user2.age} anos</p>
                      <p className="text-xs text-white/50 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {match.user2.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Match Info */}
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusBadge(match.status)}
                    </div>
                    <p className="text-sm text-white/70">
                      {match.messagesCount} mensagens
                    </p>
                    <p className="text-xs text-white/50">
                      Match: {new Date(match.matchedAt).toLocaleDateString('pt-BR')}
                    </p>
                    {match.lastMessageAt && (
                      <p className="text-xs text-white/50">
                        Última msg: {new Date(match.lastMessageAt).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setLocation(`/admin/matches/${match.id}`)}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Conversa
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => alert(`Analisar match ${match.id}`)}
                      className="bg-blue-500/20 border-blue-300/30 text-blue-300 hover:bg-blue-500/30"
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Analisar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/70">
            Mostrando <span className="font-medium text-white">{filteredMatches.length}</span> matches
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" disabled className="bg-white/10 border-white/30 text-white">Anterior</Button>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white">1</Button>
            <Button variant="outline" className="bg-white/10 border-white/30 text-white">2</Button>
            <Button variant="outline" className="bg-white/10 border-white/30 text-white">3</Button>
            <Button variant="outline" className="bg-white/10 border-white/30 text-white">Próximo</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
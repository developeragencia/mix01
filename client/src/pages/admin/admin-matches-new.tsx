import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  Heart, 
  Search, 
  Filter, 
  Users, 
  MessageCircle,
  Calendar,
  MapPin,
  Eye,
  Trash2,
  Ban
} from "lucide-react";

interface Match {
  id: number;
  user1Name: string;
  user2Name: string;
  user1Id: number;
  user2Id: number;
  status: string;
  createdAt: string;
  lastMessageAt?: string;
  messageCount: number;
  isActive: boolean;
}

export default function AdminMatchesNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['/api/admin/matches', searchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const response = await fetch(`/api/admin/matches?${params}`);
      if (!response.ok) throw new Error('Failed to fetch matches');
      return response.json();
    }
  });

  const deleteMatchMutation = useMutation({
    mutationFn: async (matchId: number) => {
      const response = await fetch(`/api/admin/matches/${matchId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete match');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/matches'] });
      toast({
        title: "✅ Match Removido",
        description: "Match foi excluído com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao excluir match",
        variant: "destructive"
      });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Matches">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Matches">
      <div className="space-y-3 w-full max-w-full overflow-x-hidden">
        {/* Search and Filters */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar matches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-700/50 border-blue-600/50 text-white text-sm w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className="text-xs whitespace-nowrap"
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className="text-xs whitespace-nowrap"
              >
                Ativos
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('inactive')}
                className="text-xs whitespace-nowrap"
              >
                Inativos
              </Button>
            </div>
          </div>
        </Card>

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {matches.map((match: Match) => (
            <Card key={match.id} className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all w-full">
              {/* Match Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {match.user1Name} ❤️ {match.user2Name}
                  </h3>
                  <p className="text-xs text-blue-200">Match #{match.id}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge 
                    variant={match.isActive ? "default" : "secondary"} 
                    className={`text-xs ${match.isActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}
                  >
                    {match.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>

              {/* Match Stats */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xs text-blue-200">Mensagens</div>
                  <div className="text-sm font-semibold text-white">{match.messageCount}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-200">Status</div>
                  <div className="text-sm font-semibold text-white">{match.status}</div>
                </div>
              </div>

              {/* Match Info */}
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <Calendar className="w-3 h-3" />
                  <span>Criado em {formatDate(match.createdAt)}</span>
                </div>
                {match.lastMessageAt && (
                  <div className="flex items-center gap-2 text-xs text-blue-200">
                    <MessageCircle className="w-3 h-3" />
                    <span>Última msg: {formatDate(match.lastMessageAt)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setLocation(`/admin/match-details/${match.id}`)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este match?')) {
                      deleteMatchMutation.mutate(match.id);
                    }
                  }}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {matches.length === 0 && (
          <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum match encontrado</h3>
            <p className="text-blue-200">Ajuste os filtros ou tente uma busca diferente.</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
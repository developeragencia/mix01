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
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Crown,
  Heart,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Mail,
  Phone
} from "lucide-react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  verified: boolean;
  subscriptionType: string;
  lastActive: string;
  profileComplete: boolean;
  totalMatches: number;
  totalLikes: number;
  location?: string;
  age?: number;
  createdAt: string;
}

export default function AdminUsersNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check admin authentication
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Fetch users data
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/admin/users', searchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: number; updates: any }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "✅ Usuário Atualizado",
        description: "As alterações foram salvas com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao atualizar usuário",
        variant: "destructive"
      });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "✅ Usuário Removido",
        description: "Usuário foi excluído com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao excluir usuário",
        variant: "destructive"
      });
    }
  });

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'premium':
        return <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">VIP</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Grátis</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Usuários">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Usuários">
      <div className="space-y-3 w-full max-w-full overflow-x-hidden">
        {/* Search and Filters */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar usuários..."
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
                variant={statusFilter === 'verified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('verified')}
                className="text-xs whitespace-nowrap"
              >
                Verificados
              </Button>
              <Button
                variant={statusFilter === 'premium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('premium')}
                className="text-xs whitespace-nowrap"
              >
                Premium
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Grid - Mobile First */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {users.map((user: User) => (
            <Card key={user.id} className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all w-full">
              {/* User Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-xs text-blue-200 truncate">{user.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getSubscriptionBadge(user.subscriptionType)}
                  {user.verified && (
                    <UserCheck className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-xs text-blue-200">Matches</div>
                  <div className="text-sm font-semibold text-white">{user.totalMatches}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-200">Likes</div>
                  <div className="text-sm font-semibold text-white">{user.totalLikes}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-blue-200">Idade</div>
                  <div className="text-sm font-semibold text-white">{user.age || 'N/A'}</div>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-1 mb-3">
                {user.location && (
                  <div className="flex items-center gap-2 text-xs text-blue-200">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <Calendar className="w-3 h-3" />
                  <span>Cadastrado em {formatDate(user.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-blue-200">
                  <Eye className="w-3 h-3" />
                  <span>Ativo em {formatDate(user.lastActive)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setLocation(`/admin/user-details/${user.id}`)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xs"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este usuário?')) {
                      deleteUserMutation.mutate(user.id);
                    }
                  }}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs"
                  disabled={deleteUserMutation.isPending}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhum usuário encontrado</h3>
            <p className="text-blue-200">Ajuste os filtros ou tente uma busca diferente.</p>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Ações Rápidas</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 text-xs"
            >
              <UserCheck className="w-3 h-3 mr-1" />
              Verificar Todos
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30 text-xs"
            >
              <Mail className="w-3 h-3 mr-1" />
              Enviar Email
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30 text-xs"
            >
              <Crown className="w-3 h-3 mr-1" />
              Promover
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30 text-xs"
            >
              <UserX className="w-3 h-3 mr-1" />
              Suspender
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
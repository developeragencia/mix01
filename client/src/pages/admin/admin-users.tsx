import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  Eye, 
  Edit,
  Trash2,
  Crown,
  Star,
  MapPin,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminFetch, adminRequest } from "@/lib/admin-fetch";

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  subscriptionType: string;
  createdAt: string;
  lastSeen?: string;
  city?: string;
  profileImage?: string;
  verified: boolean;
}

export default function AdminUsers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: ['/api/admin/users', searchTerm, filterStatus],
    staleTime: 15000, // Cache por 15 segundos
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await adminFetch(`/api/admin/users?search=${searchTerm}&status=${filterStatus}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: number, action: string }) => {
      const response = await adminRequest(`/api/admin/users/${userId}`, 'PATCH', { action });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Ativo</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Suspenso</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type) {
      case 'vip':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30"><Crown className="w-3 h-3 mr-1" />VIP</Badge>;
      case 'premium':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Star className="w-3 h-3 mr-1" />Premium</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Grátis</Badge>;
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Usuários">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-blue-800/50 rounded-lg"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Usuários">
      <div className="space-y-4 md:space-y-6">
        {/* Filters and Search */}
        <Card className="p-4 md:p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar usuários por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-blue-700/50 border border-blue-600/50 rounded-md text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="suspended">Suspensos</option>
                <option value="pending">Pendentes</option>
              </select>
              <Button variant="outline" className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </Card>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers?.map((user) => (
            <Card key={user.id} className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full bg-blue-700/50"
                    />
                    {user.verified && (
                      <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-400 bg-blue-800 rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-semibold">{user.firstName} {user.lastName}</h3>
                      {getStatusBadge(user.status)}
                      {getSubscriptionBadge(user.subscriptionType)}
                    </div>
                    <p className="text-blue-200 text-sm">{user.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-blue-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {user.city || 'Não informado'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      {user.lastSeen && (
                        <span>Último acesso: {new Date(user.lastSeen).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                    onClick={() => setLocation(`/admin/users/${user.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-600/50 text-blue-200 hover:bg-blue-700/50"
                    onClick={() => setLocation(`/admin/users/${user.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>

                  {user.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600/50 text-red-300 hover:bg-red-700/50"
                      onClick={() => updateUserMutation.mutate({ userId: user.id, action: 'suspend' })}
                    >
                      <Ban className="w-4 h-4 mr-1" />
                      Suspender
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-600/50 text-green-300 hover:bg-green-700/50"
                      onClick={() => updateUserMutation.mutate({ userId: user.id, action: 'activate' })}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Ativar
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredUsers?.length === 0 && (
          <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
            <p className="text-blue-200">Nenhum usuário encontrado com os filtros aplicados.</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
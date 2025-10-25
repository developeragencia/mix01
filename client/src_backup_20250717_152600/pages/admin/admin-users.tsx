import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Eye, 
  MessageSquare, 
  MoreVertical,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin
} from "lucide-react";

export default function AdminUsers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Mock users data - in real app would come from API
  const { data: users = [] } = useQuery({
    queryKey: ["admin-users", searchTerm, filterStatus],
    queryFn: async () => {
      // Simulate API call
      return [
        {
          id: 1,
          name: "Alex Developer",
          email: "alex@example.com",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=60",
          status: "active",
          verified: true,
          premium: true,
          joinDate: "2024-01-15",
          lastActive: "2024-06-22",
          location: "São Paulo, SP",
          matches: 45,
          messages: 234,
          reports: 0
        },
        {
          id: 2,
          name: "Maria Silva",
          email: "maria@example.com",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2bc?w=64&h=64&fit=crop&crop=face&auto=format&q=60",
          status: "active",
          verified: false,
          premium: false,
          joinDate: "2024-02-20",
          lastActive: "2024-06-21",
          location: "Rio de Janeiro, RJ",
          matches: 23,
          messages: 156,
          reports: 1
        },
        {
          id: 3,
          name: "João Santos",
          email: "joao@example.com",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&auto=format&q=60",
          status: "suspended",
          verified: false,
          premium: false,
          joinDate: "2024-03-10",
          lastActive: "2024-06-15",
          location: "Belo Horizonte, MG",
          matches: 12,
          messages: 89,
          reports: 3
        },
        {
          id: 4,
          name: "Ana Costa",
          email: "ana@example.com",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format&q=60",
          status: "pending",
          verified: false,
          premium: true,
          joinDate: "2024-06-20",
          lastActive: "2024-06-22",
          location: "Porto Alegre, RS",
          matches: 8,
          messages: 34,
          reports: 0
        }
      ];
    }
  });

  const handleUserAction = (userId: number, action: string) => {
    // Simulate user action
    alert(`Ação "${action}" aplicada ao usuário ID: ${userId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
            <p className="text-gray-600">Administre todos os usuários da plataforma</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button>
              <UserCheck className="w-4 h-4 mr-2" />
              Ações em Lote
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuários por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="suspended">Suspensos</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atividade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estatísticas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            {user.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-500 ml-1" title="Verificado" />
                            )}
                            {user.premium && (
                              <div className="w-4 h-4 bg-yellow-400 rounded-full ml-1" title="Premium" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        {user.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          Último acesso: {new Date(user.lastActive).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          Membro desde: {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{user.matches} matches</div>
                        <div>{user.messages} mensagens</div>
                        {user.reports > 0 && (
                          <div className="text-red-600">{user.reports} denúncias</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setLocation(`/admin/users/${user.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, "message")}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        {user.status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, "suspend")}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, "activate")}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredUsers.length}</span> usuários
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" disabled>Anterior</Button>
            <Button variant="outline">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Próximo</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
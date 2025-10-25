import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Camera,
  MapPin,
  Calendar,
  Crown,
  Flag
} from "lucide-react";

export default function AdminProfiles() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending_verification");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Mock profiles data
  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-profiles", searchTerm, filterStatus],
    queryFn: async () => {
      return [
        {
          id: 1,
          user: {
            id: 123,
            name: "Alex Developer",
            email: "alex@example.com"
          },
          photos: [
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face&auto=format&q=60",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face&auto=format&q=60"
          ],
          age: 28,
          location: "São Paulo, SP",
          bio: "Desenvolvedor apaixonado por tecnologia e aventuras ao ar livre.",
          profession: "Engenheiro de Software",
          status: "verified",
          verificationStatus: "verified",
          verificationDate: "2024-06-15",
          createdAt: "2024-01-15",
          reports: 0,
          matches: 45,
          premium: true
        },
        {
          id: 2,
          user: {
            id: 456,
            name: "Maria Silva",
            email: "maria@example.com"
          },
          photos: [
            "https://images.unsplash.com/photo-1494790108755-2616b612b2bc?w=300&h=400&fit=crop&crop=face&auto=format&q=60"
          ],
          age: 25,
          location: "Rio de Janeiro, RJ",
          bio: "Amo viajar e conhecer pessoas novas!",
          profession: "Designer Gráfica",
          status: "active",
          verificationStatus: "pending_verification",
          verificationDate: null,
          createdAt: "2024-06-20",
          reports: 0,
          matches: 12,
          premium: false
        },
        {
          id: 3,
          user: {
            id: 789,
            name: "João Santos",
            email: "joao@example.com"
          },
          photos: [
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face&auto=format&q=60"
          ],
          age: 32,
          location: "Belo Horizonte, MG",
          bio: "Perfil suspeito com informações inconsistentes",
          profession: "CEO",
          status: "under_review",
          verificationStatus: "rejected",
          verificationDate: null,
          createdAt: "2024-06-18",
          reports: 3,
          matches: 2,
          premium: false,
          rejectionReason: "Fotos não condizem com informações fornecidas"
        }
      ];
    }
  });

  const handleProfileAction = (profileId: number, action: string) => {
    alert(`Ação "${action}" aplicada ao perfil ID: ${profileId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "under_review":
        return <Badge className="bg-yellow-100 text-yellow-800">Em Análise</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
      case "verified":
        return <Badge className="bg-blue-100 text-blue-800">Verificado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Verificado</Badge>;
      case "pending_verification":
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />Pendente</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 flex items-center"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      case "not_requested":
        return <Badge className="bg-gray-100 text-gray-800">Não Solicitada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = profile.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || profile.verificationStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout currentPage="profiles">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Perfis</h1>
            <p className="text-gray-600">Verifique e modere perfis de usuários</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserCheck className="w-4 h-4 mr-2" />
              Verificação em Lote
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes Verificação</p>
                <p className="text-2xl font-bold text-yellow-600">45</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verificados</p>
                <p className="text-2xl font-bold text-green-600">1,234</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-blue-600">23</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejeitados</p>
                <p className="text-2xl font-bold text-red-600">87</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nome ou email..."
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos os Status</option>
                <option value="pending_verification">Pendente Verificação</option>
                <option value="verified">Verificados</option>
                <option value="rejected">Rejeitados</option>
                <option value="not_requested">Não Solicitada</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProfiles.map((profile) => (
            <Card key={profile.id} className="overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={profile.photos[0]} 
                        alt={profile.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{profile.user.name}</h3>
                        {profile.premium && <Crown className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <p className="text-sm text-gray-500">{profile.user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {getStatusBadge(profile.status)}
                    {getVerificationBadge(profile.verificationStatus)}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {profile.age} anos
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Profissão:</strong> {profile.profession}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Bio:</strong> {profile.bio}
                  </div>
                </div>

                {/* Photos */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Fotos ({profile.photos.length})</span>
                    <Camera className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex space-x-2 overflow-x-auto">
                    {profile.photos.map((photo, index) => (
                      <div key={index} className="flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden">
                        <img 
                          src={photo} 
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-75"
                          onClick={() => window.open(photo, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>{profile.matches} matches</span>
                  <span>{profile.reports} denúncias</span>
                  <span>Criado em {new Date(profile.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>

                {/* Rejection Reason */}
                {profile.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Motivo da Rejeição:</strong> {profile.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLocation(`/admin/profiles/${profile.id}`)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  
                  {profile.verificationStatus === "pending_verification" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleProfileAction(profile.id, "approve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleProfileAction(profile.id, "reject")}
                        className="text-red-600 hover:text-red-700 border-red-300"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                  
                  {profile.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleProfileAction(profile.id, "suspend")}
                      className="text-red-600 hover:text-red-700"
                    >
                      Suspender
                    </Button>
                  )}

                  {profile.reports > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setLocation(`/admin/reports?user=${profile.user.id}`)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      Ver Denúncias
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredProfiles.length}</span> perfis
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
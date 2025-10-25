import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  Heart,
  MessageSquare,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Activity
} from "lucide-react";

export default function AdminUserDetail() {
  const [, setLocation] = useLocation();
  const { id } = useParams();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: userDetails, isLoading } = useQuery({
    queryKey: [`/api/admin/users/${id}`],
    enabled: !!id
  });

  if (isLoading) {
    return (
      <AdminLayout currentPage="users">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Carregando detalhes do usuário...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!userDetails) {
    return (
      <AdminLayout currentPage="users">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Usuário não encontrado</h1>
          <Button onClick={() => setLocation("/admin/users")} className="bg-pink-600 hover:bg-pink-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Usuários
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const { user, profile, matches, conversations, stats } = userDetails as any;

  const handleUserAction = (action: string) => {
    alert(`Ação "${action}" aplicada ao usuário ${user.username}`);
  };

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/admin/users")}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-white">Detalhes do Usuário</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleUserAction("suspend")}
              className="bg-red-600 hover:bg-red-700"
            >
              <Ban className="w-4 h-4 mr-2" />
              Suspender
            </Button>
            <Button
              onClick={() => handleUserAction("verify")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verificar
            </Button>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-4 mb-4">
              {profile?.photos?.[0] ? (
                <img 
                  src={profile.photos[0]} 
                  alt={user.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">{profile?.name || user.username}</h3>
                <p className="text-white/70">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={profile?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {profile?.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              {profile?.location && (
                <div className="flex items-center space-x-2 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {profile?.age && (
                <div className="flex items-center space-x-2 text-white/80">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{profile.age} anos</span>
                </div>
              )}
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-white/80">Matches</span>
                </div>
                <span className="text-white font-semibold">{stats.totalMatches}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-white/80">Mensagens</span>
                </div>
                <span className="text-white font-semibold">{stats.totalMessages}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-green-400" />
                  <span className="text-white/80">Fotos</span>
                </div>
                <span className="text-white font-semibold">{profile?.photos?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-yellow-400" />
                  <span className="text-white/80">Status</span>
                </div>
                <Badge className={profile?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {profile?.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Ações da Conta</h3>
            <div className="space-y-3">
              <Button
                onClick={() => handleUserAction("reset_password")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Resetar Senha
              </Button>
              <Button
                onClick={() => handleUserAction("view_messages")}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Ver Mensagens
              </Button>
              <Button
                onClick={() => handleUserAction("view_matches")}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Heart className="w-4 h-4 mr-2" />
                Ver Matches
              </Button>
              <Button
                onClick={() => handleUserAction("export_data")}
                variant="outline"
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <Eye className="w-4 h-4 mr-2" />
                Exportar Dados
              </Button>
            </div>
          </Card>
        </div>

        {/* Profile Details */}
        {profile && (
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Detalhes do Perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Informações Pessoais</h4>
                <div className="space-y-2">
                  <p className="text-white/80"><span className="font-medium">Nome:</span> {profile.name}</p>
                  <p className="text-white/80"><span className="font-medium">Idade:</span> {profile.age} anos</p>
                  <p className="text-white/80"><span className="font-medium">Profissão:</span> {profile.profession || "Não informado"}</p>
                  <p className="text-white/80"><span className="font-medium">Localização:</span> {profile.location || "Não informado"}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Preferências</h4>
                <div className="space-y-2">
                  <p className="text-white/80"><span className="font-medium">Distância máxima:</span> {profile.maxDistance} km</p>
                  <p className="text-white/80"><span className="font-medium">Idade:</span> {profile.ageRangeMin} - {profile.ageRangeMax} anos</p>
                  <p className="text-white/80"><span className="font-medium">Conta ativa:</span> {profile.isActive ? "Sim" : "Não"}</p>
                </div>
              </div>
            </div>
            
            {profile.bio && (
              <div className="mt-4">
                <h4 className="font-semibold text-white mb-2">Bio</h4>
                <p className="text-white/80">{profile.bio}</p>
              </div>
            )}

            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-white mb-2">Interesses</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-white/70 border-white/30">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {conversations.slice(0, 5).map((conversation: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img 
                    src={conversation.profile.photos?.[0] || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face&auto=format&q=60"} 
                    alt={conversation.profile.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">{conversation.profile.name}</p>
                    <p className="text-white/60 text-sm">
                      {conversation.lastMessage ? 
                        conversation.lastMessage.content.substring(0, 50) + "..." : 
                        "Sem mensagens"
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">
                    {conversation.lastMessage ? 
                      new Date(conversation.lastMessage.createdAt).toLocaleDateString('pt-BR') : 
                      new Date(conversation.match.createdAt).toLocaleDateString('pt-BR')
                    }
                  </p>
                </div>
              </div>
            ))}
            
            {conversations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60">Nenhuma atividade recente encontrada</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
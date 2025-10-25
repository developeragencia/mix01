import { useEffect } from "react";
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
  Camera,
  Target,
  Activity
} from "lucide-react";

export default function AdminProfileDetail() {
  const [, setLocation] = useLocation();
  const { id } = useParams();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: profileDetails, isLoading } = useQuery({
    queryKey: [`/api/admin/profiles/${id}`],
    enabled: !!id
  });

  if (isLoading) {
    return (
      <AdminLayout currentPage="profiles">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Carregando detalhes do perfil...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!profileDetails) {
    return (
      <AdminLayout currentPage="profiles">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Perfil não encontrado</h1>
          <Button onClick={() => setLocation("/admin/profiles")} className="bg-pink-600 hover:bg-pink-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Perfis
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const { user, profile, matches, conversations, stats } = profileDetails as any;

  const handleProfileAction = (action: string) => {
    alert(`Ação "${action}" aplicada ao perfil ${profile.name}`);
  };

  return (
    <AdminLayout currentPage="profiles">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/admin/profiles")}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-white">Detalhes do Perfil</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleProfileAction("feature")}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Target className="w-4 h-4 mr-2" />
              Destacar
            </Button>
            <Button
              onClick={() => handleProfileAction("verify")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verificar
            </Button>
          </div>
        </div>

        {/* Profile Hero Section */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Photos */}
            <div className="flex-shrink-0">
              <div className="grid grid-cols-2 gap-3">
                {profile?.photos?.slice(0, 4).map((photo: string, index: number) => (
                  <img 
                    key={index}
                    src={photo} 
                    alt={`${profile.name} - Foto ${index + 1}`}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ))}
                {(!profile?.photos || profile.photos.length === 0) && (
                  <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
              <div className="text-center mt-2">
                <Badge className="bg-blue-100 text-blue-800">
                  {profile?.photos?.length || 0} fotos
                </Badge>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
                  <p className="text-white/70 text-lg">{profile?.age} anos</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={profile?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {profile?.isActive ? "Perfil Ativo" : "Perfil Inativo"}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      ID: {profile?.id}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <Heart className="w-6 h-6 text-pink-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{stats?.totalMatches || 0}</p>
                  <p className="text-white/70 text-sm">Matches</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{stats?.totalMessages || 0}</p>
                  <p className="text-white/70 text-sm">Mensagens</p>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <Activity className="w-6 h-6 text-green-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{profile?.photos?.length || 0}</p>
                  <p className="text-white/70 text-sm">Fotos</p>
                </div>
              </div>

              {profile?.bio && (
                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">Biografia</h4>
                  <p className="text-white/80 leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Informações Pessoais</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Nome Completo</p>
                  <p className="text-white">{profile?.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Idade</p>
                  <p className="text-white">{profile?.age} anos</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Localização</p>
                  <p className="text-white">{profile?.location || "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Profissão</p>
                  <p className="text-white">{profile?.profession || "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-white/60" />
                <div>
                  <p className="text-white/60 text-sm">Email do Usuário</p>
                  <p className="text-white">{user?.email}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Preferências de Busca</h3>
            <div className="space-y-3">
              <div>
                <p className="text-white/60 text-sm">Distância Máxima</p>
                <p className="text-white">{profile?.maxDistance} km</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Faixa de Idade</p>
                <p className="text-white">{profile?.ageRangeMin} - {profile?.ageRangeMax} anos</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Status da Conta</p>
                <Badge className={profile?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {profile?.isActive ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              <div>
                <p className="text-white/60 text-sm">Criado em</p>
                <p className="text-white">{new Date(profile?.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string, index: number) => (
                <Badge key={index} variant="outline" className="text-white/70 border-white/30">
                  {interest}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {conversations?.slice(0, 5).map((conversation: any, index: number) => (
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
                        "Novo match"
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
            
            {(!conversations || conversations.length === 0) && (
              <div className="text-center py-8">
                <p className="text-white/60">Nenhuma atividade recente encontrada</p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Ações do Perfil</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => handleProfileAction("edit")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Eye className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              onClick={() => handleProfileAction("suspend")}
              className="bg-red-600 hover:bg-red-700"
            >
              <Ban className="w-4 h-4 mr-2" />
              Suspender
            </Button>
            <Button
              onClick={() => handleProfileAction("verify")}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Verificar
            </Button>
            <Button
              onClick={() => handleProfileAction("export")}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Target className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
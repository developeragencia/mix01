import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Shield,
  Ban,
  CheckCircle,
  X,
  Eye,
  Heart,
  MessageSquare,
  CreditCard,
  Settings,
  Edit,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUserDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ['/api/admin/user-details', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/user-details/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user details');
      return response.json();
    }
  });

  // Mutations for user actions
  const suspendUserMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deactivate' })
      });
      if (!response.ok) throw new Error('Failed to suspend user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/user-details', id] });
      toast({
        title: "✅ Usuário Suspenso",
        description: "O usuário foi suspenso com sucesso",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao suspender usuário",
        variant: "destructive"
      });
    }
  });

  const reactivateUserMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'activate' })
      });
      if (!response.ok) throw new Error('Failed to reactivate user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/user-details', id] });
      toast({
        title: "✅ Usuário Reativado",
        description: "O usuário foi reativado com sucesso",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao reativar usuário",
        variant: "destructive"
      });
    }
  });

  const verifyUserMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify' })
      });
      if (!response.ok) throw new Error('Failed to verify user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/user-details', id] });
      toast({
        title: "✅ Usuário Verificado",
        description: "O usuário foi verificado com sucesso",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao verificar usuário",
        variant: "destructive"
      });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isOnline: boolean) => {
    return isOnline ? 
      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Online</Badge> :
      <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Offline</Badge>;
  };

  const getSubscriptionBadge = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'premium':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">VIP</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Grátis</Badge>;
    }
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes do Usuário">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="Usuário Não Encontrado">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
          <h3 className="text-lg font-semibold text-white mb-2">Usuário não encontrado</h3>
          <p className="text-blue-200 mb-4">O usuário solicitado não existe ou foi removido.</p>
          <Button
            onClick={() => setLocation("/admin/users")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos Usuários
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Usuário: ${user.firstName} ${user.lastName}`}>
      <div className="space-y-4 w-full max-w-full overflow-x-hidden">
        {/* Header with Back Button */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/admin/users")}
                className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <div className="flex items-center gap-2">
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-400/50"
                />
                <h2 className="text-lg font-semibold text-white">
                  {user.firstName} {user.lastName}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(user.isOnline)}
              {getSubscriptionBadge(user.subscriptionType)}
            </div>
          </div>
        </Card>

        {/* User Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informações Pessoais
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Nome:</span>
                <span className="text-white">{user.firstName} {user.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Email:</span>
                <span className="text-white truncate max-w-40">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Telefone:</span>
                <span className="text-white">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Idade:</span>
                <span className="text-white">{calculateAge(user.birthDate)} anos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Gênero:</span>
                <span className="text-white capitalize">{user.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Orientação:</span>
                <span className="text-white capitalize">{user.sexualOrientation}</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Localização e Atividade
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-200">Cidade:</span>
                <span className="text-white">{user.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Status:</span>
                <span className="text-white">{user.isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Último acesso:</span>
                <span className="text-white text-xs">{formatDate(user.lastSeen)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Membro desde:</span>
                <span className="text-white text-xs">{formatDate(user.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Likes diários:</span>
                <span className="text-white">{user.dailyLikes}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* User Statistics */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Estatísticas do Usuário
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Matches</div>
              <div className="text-white text-lg font-bold">{user.stats?.totalMatches || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Mensagens</div>
              <div className="text-white text-lg font-bold">{user.stats?.totalMessages || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Perfil</div>
              <div className="text-white text-lg font-bold">{user.stats?.profileCompleteness || 0}%</div>
            </div>
            <div className="text-center">
              <div className="text-blue-200 text-xs mb-1">Verificado</div>
              <div className="text-white text-lg font-bold">{user.stats?.verified ? '✅' : '❌'}</div>
            </div>
          </div>
        </Card>

        {/* Profile Content */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Conteúdo do Perfil
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-blue-200 text-xs mb-1">Biografia:</div>
              <div className="text-white text-sm bg-blue-700/30 p-2 rounded">
                {user.bio || 'Sem biografia'}
              </div>
            </div>
            
            <div>
              <div className="text-blue-200 text-xs mb-1">Interesses:</div>
              <div className="flex flex-wrap gap-1">
                {user.interests && user.interests.length > 0 ? (
                  user.interests.map((interest: string, index: number) => (
                    <Badge key={index} className="bg-pink-500/20 text-pink-300 text-xs">
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <span className="text-blue-300 text-sm">Nenhum interesse cadastrado</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-blue-200 text-xs mb-1">Fotos:</div>
              <div className="flex gap-2">
                {user.photos && user.photos.length > 0 ? (
                  user.photos.slice(0, 3).map((photo: string, index: number) => (
                    <img 
                      key={index} 
                      src={photo} 
                      alt={`Foto ${index + 1}`}
                      className="w-16 h-16 rounded object-cover border border-blue-600/50"
                    />
                  ))
                ) : (
                  <span className="text-blue-300 text-sm">Nenhuma foto cadastrada</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Subscription Details */}
        {user.subscription && (
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Detalhes da Assinatura
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-blue-200 text-xs mb-1">Plano:</div>
                <div className="text-white">{user.subscription.planType || user.subscriptionType}</div>
              </div>
              <div>
                <div className="text-blue-200 text-xs mb-1">Status:</div>
                <Badge className={user.subscription.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                  {user.subscription.status === 'active' ? 'Ativa' : 'Inativa'}
                </Badge>
              </div>
              <div>
                <div className="text-blue-200 text-xs mb-1">Stripe ID:</div>
                <div className="text-white text-xs font-mono truncate">
                  {user.stripeSubscriptionId || 'N/A'}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Button
              onClick={() => setLocation(`/admin/user-edit/${user.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Usuário
            </Button>
            
            {user.isOnline ? (
              <Button
                onClick={() => {
                  if (confirm('Tem certeza que deseja suspender este usuário?')) {
                    suspendUserMutation.mutate();
                  }
                }}
                disabled={suspendUserMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                <Ban className="w-4 h-4 mr-2" />
                {suspendUserMutation.isPending ? 'Suspendendo...' : 'Suspender'}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (confirm('Tem certeza que deseja reativar este usuário?')) {
                    reactivateUserMutation.mutate();
                  }
                }}
                disabled={reactivateUserMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {reactivateUserMutation.isPending ? 'Reativando...' : 'Reativar'}
              </Button>
            )}
            
            <Button
              onClick={() => setLocation(`/admin/messages?userId=${user.id}`)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ver Mensagens
            </Button>
            
            <Button
              onClick={() => {
                if (confirm('Tem certeza que deseja verificar este usuário?')) {
                  verifyUserMutation.mutate();
                }
              }}
              disabled={verifyUserMutation.isPending}
              variant="outline"
              className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50 text-sm"
            >
              <Shield className="w-4 h-4 mr-2" />
              {verifyUserMutation.isPending ? 'Verificando...' : 'Verificar'}
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
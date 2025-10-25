import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft,
  AlertTriangle,
  User,
  MessageSquare,
  Ban,
  CheckCircle,
  X,
  Eye,
  Clock,
  Flag,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminReportDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [resolution, setResolution] = useState("");
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: report, isLoading } = useQuery({
    queryKey: ['/api/admin/reports', id],
    queryFn: async () => {
      // TODO: Connect to real database
      return {
        id: parseInt(id || '1'),
        reporter: {
          id: 1,
          name: "Maria Silva",
          email: "maria@email.com",
          photo: "/api/placeholder/64/64",
          verified: true
        },
        reported: {
          id: 2,
          name: "João Santos",
          email: "joao@email.com",
          photo: "/api/placeholder/64/64",
          verified: false
        },
        type: "inappropriate_content",
        category: "harassment",
        reason: "Mensagens ofensivas e assédio",
        description: "Este usuário tem enviado mensagens inadequadas com conteúdo ofensivo e insistente mesmo após eu ter demonstrado desinteresse. As mensagens incluem comentários sobre aparência física de forma desrespeitosa.",
        evidence: {
          messages: [
            {
              id: 1,
              content: "Você é muito gostosa, vamos nos encontrar hoje?",
              sentAt: "2024-01-28T14:30:00Z"
            },
            {
              id: 2,
              content: "Por que não responde? Sei que você está online",
              sentAt: "2024-01-28T14:45:00Z"
            },
            {
              id: 3,
              content: "Mulheres assim sempre se fazem de difíceis",
              sentAt: "2024-01-28T15:00:00Z"
            }
          ],
          screenshots: [
            "/api/placeholder/400/600",
            "/api/placeholder/400/600"
          ]
        },
        status: "pending",
        priority: "high",
        severity: "major",
        reportedAt: "2024-01-28T15:30:00Z",
        reviewedAt: null,
        reviewedBy: null,
        resolution: null,
        actionTaken: null,
        metadata: {
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          deviceType: "mobile",
          location: "São Paulo, SP"
        }
      };
    }
  });

  const resolveReportMutation = useMutation({
    mutationFn: async ({ action, resolution }: { action: string; resolution: string }) => {
      // TODO: Connect to real API
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      toast({
        title: "Sucesso",
        description: "Denúncia resolvida com sucesso"
      });
      setLocation("/admin/reports");
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente</Badge>;
      case 'reviewing':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Em Análise</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Resolvida</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Descartada</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Baixa</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Média</Badge>;
      case 'high':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Alta</Badge>;
      case 'critical':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Crítica</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">{priority}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'minor':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Menor</Badge>;
      case 'moderate':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Moderada</Badge>;
      case 'major':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Grave</Badge>;
      case 'critical':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Crítica</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{severity}</Badge>;
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

  const getReasonLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      'inappropriate_content': 'Conteúdo Inadequado',
      'harassment': 'Assédio',
      'spam': 'Spam',
      'fake_profile': 'Perfil Falso',
      'underage': 'Menor de Idade',
      'violence': 'Violência',
      'hate_speech': 'Discurso de Ódio',
      'scam': 'Golpe',
      'other': 'Outro'
    };
    return reasons[reason] || reason;
  };

  const handleResolve = (action: string) => {
    if (!resolution.trim() && action !== 'dismiss') {
      toast({
        title: "Erro",
        description: "Resolução é obrigatória",
        variant: "destructive"
      });
      return;
    }
    resolveReportMutation.mutate({ action, resolution });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes da Denúncia">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="h-64 bg-blue-800/50 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!report) {
    return (
      <AdminLayout title="Denúncia não encontrada">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
          <p className="text-blue-200">Denúncia não encontrada.</p>
          <Button
            onClick={() => setLocation("/admin/reports")}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            Voltar à lista
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Denúncia: ${getReasonLabel(report.type)}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/reports")}
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Denúncia #{report.id}</h1>
              {getStatusBadge(report.status)}
              {getPriorityBadge(report.priority)}
              {getSeverityBadge(report.severity)}
            </div>
          </div>

          {report.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                onClick={() => setShowResolutionForm(!showResolutionForm)}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Resolver
              </Button>
            </div>
          )}
        </div>

        {/* Resolution Form */}
        {showResolutionForm && (
          <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Resolver Denúncia
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-blue-200 text-sm mb-2 block">Resolução e ação tomada</label>
                <Textarea
                  placeholder="Descreva a resolução e ação tomada..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="bg-blue-700/30 border-blue-600/50 text-white placeholder:text-blue-300"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleResolve('ban_user')}
                  disabled={resolveReportMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Banir Usuário
                </Button>
                <Button
                  onClick={() => handleResolve('suspend_user')}
                  disabled={resolveReportMutation.isPending}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Suspender
                </Button>
                <Button
                  onClick={() => handleResolve('warning')}
                  disabled={resolveReportMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Advertir
                </Button>
                <Button
                  onClick={() => handleResolve('dismiss')}
                  disabled={resolveReportMutation.isPending}
                  variant="outline"
                  className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
                >
                  Descartar
                </Button>
                <Button
                  onClick={() => setShowResolutionForm(false)}
                  variant="outline"
                  className="border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Details */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <Flag className="w-5 h-5" />
                Detalhes da Denúncia
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-blue-200 text-sm">Tipo de denúncia</label>
                  <p className="text-white font-medium">{getReasonLabel(report.type)}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Categoria</label>
                  <p className="text-white font-medium">{getReasonLabel(report.category)}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Motivo</label>
                  <p className="text-white">{report.reason}</p>
                </div>
                <div>
                  <label className="text-blue-200 text-sm">Descrição detalhada</label>
                  <p className="text-white leading-relaxed">{report.description}</p>
                </div>
              </div>
            </Card>

            {/* Users Involved */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Usuários Envolvidos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reporter */}
                <div className="bg-green-700/20 p-4 rounded-lg">
                  <h4 className="text-green-300 font-medium mb-3">Denunciante</h4>
                  <div className="flex items-center gap-3">
                    <img
                      src={report.reporter.photo}
                      alt={report.reporter.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h5 className="text-white font-medium">{report.reporter.name}</h5>
                      <p className="text-green-200 text-sm">{report.reporter.email}</p>
                      {report.reporter.verified && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs mt-1">
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                    onClick={() => setLocation(`/admin/users/${report.reporter.id}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver Perfil
                  </Button>
                </div>

                {/* Reported */}
                <div className="bg-red-700/20 p-4 rounded-lg">
                  <h4 className="text-red-300 font-medium mb-3">Denunciado</h4>
                  <div className="flex items-center gap-3">
                    <img
                      src={report.reported.photo}
                      alt={report.reported.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h5 className="text-white font-medium">{report.reported.name}</h5>
                      <p className="text-red-200 text-sm">{report.reported.email}</p>
                      {!report.reported.verified && (
                        <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs mt-1">
                          Não Verificado
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3 bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                    onClick={() => setLocation(`/admin/users/${report.reported.id}`)}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </Card>

            {/* Evidence */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Evidências</h3>
              
              {/* Messages */}
              {report.evidence.messages.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-blue-200 font-medium mb-3">Mensagens Relacionadas</h4>
                  <div className="space-y-3">
                    {report.evidence.messages.map((message) => (
                      <div key={message.id} className="bg-red-700/20 p-3 rounded-lg">
                        <p className="text-white">{message.content}</p>
                        <p className="text-red-300 text-xs mt-1">{formatDate(message.sentAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Screenshots */}
              {report.evidence.screenshots.length > 0 && (
                <div>
                  <h4 className="text-blue-200 font-medium mb-3">Capturas de Tela</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {report.evidence.screenshots.map((screenshot, index) => (
                      <img
                        key={index}
                        src={screenshot}
                        alt={`Evidência ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => window.open(screenshot, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Status */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Status da Denúncia</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Status:</span>
                  {getStatusBadge(report.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Prioridade:</span>
                  {getPriorityBadge(report.priority)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Severidade:</span>
                  {getSeverityBadge(report.severity)}
                </div>
                <div>
                  <span className="text-blue-200 text-sm">Denunciada em:</span>
                  <p className="text-white">{formatDate(report.reportedAt)}</p>
                </div>
                {report.reviewedAt && (
                  <div>
                    <span className="text-blue-200 text-sm">Revisada em:</span>
                    <p className="text-white">{formatDate(report.reviewedAt)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  onClick={() => setLocation(`/admin/users/${report.reported.id}`)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Ver Denunciado
                </Button>
                
                <Button
                  className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/users/${report.reporter.id}`)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Ver Denunciante
                </Button>
                
                <Button
                  className="w-full border-purple-600/50 text-purple-300 hover:bg-purple-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/messages?users=${report.reporter.id},${report.reported.id}`)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ver Mensagens
                </Button>
                
                <Button
                  className="w-full border-yellow-600/50 text-yellow-300 hover:bg-yellow-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/reports?reported=${report.reported.id}`)}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Outras Denúncias
                </Button>
              </div>
            </Card>

            {/* Metadata */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Metadados</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-blue-200">IP Address:</span>
                  <p className="text-white font-mono">{report.metadata.ipAddress}</p>
                </div>
                <div>
                  <span className="text-blue-200">Device:</span>
                  <p className="text-white capitalize">{report.metadata.deviceType}</p>
                </div>
                <div>
                  <span className="text-blue-200">Localização:</span>
                  <p className="text-white">{report.metadata.location}</p>
                </div>
                <div>
                  <span className="text-blue-200">User Agent:</span>
                  <p className="text-white text-xs break-all">{report.metadata.userAgent}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
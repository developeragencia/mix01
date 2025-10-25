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
  CheckCircle,
  X,
  Shield,
  Camera,
  FileText,
  AlertTriangle,
  User,
  Calendar,
  Eye,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminVerificationDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: verification, isLoading } = useQuery({
    queryKey: ['/api/admin/verifications', id],
    queryFn: async () => {
      // TODO: Connect to real database
      return {
        id: parseInt(id || '1'),
        user: {
          id: 1,
          name: "Maria Silva",
          email: "maria@email.com",
          photo: "/api/placeholder/64/64",
          createdAt: "2023-06-15T10:00:00Z"
        },
        type: "identity",
        status: "pending",
        documents: [
          { 
            type: "id_front", 
            url: "/api/placeholder/600/400", 
            uploaded: "2024-01-28T10:00:00Z",
            filename: "rg_frente.jpg",
            size: "2.1 MB"
          },
          { 
            type: "id_back", 
            url: "/api/placeholder/600/400", 
            uploaded: "2024-01-28T10:01:00Z",
            filename: "rg_verso.jpg",
            size: "1.8 MB"
          },
          { 
            type: "selfie", 
            url: "/api/placeholder/400/600", 
            uploaded: "2024-01-28T10:02:00Z",
            filename: "selfie_verificacao.jpg",
            size: "1.2 MB"
          }
        ],
        submittedAt: "2024-01-28T10:00:00Z",
        reviewedAt: null,
        reviewedBy: null,
        rejectionReason: null,
        notes: "Documentos enviados para verificação de identidade conforme política da plataforma.",
        metadata: {
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          deviceType: "mobile"
        }
      };
    }
  });

  const approveVerificationMutation = useMutation({
    mutationFn: async () => {
      // TODO: Connect to real API
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      toast({
        title: "Sucesso",
        description: "Verificação aprovada com sucesso"
      });
      setLocation("/admin/verifications");
    }
  });

  const rejectVerificationMutation = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      // TODO: Connect to real API
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      toast({
        title: "Sucesso",
        description: "Verificação rejeitada"
      });
      setLocation("/admin/verifications");
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejeitado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'identity':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30"><Shield className="w-3 h-3 mr-1" />Identidade</Badge>;
      case 'profile':
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30"><Camera className="w-3 h-3 mr-1" />Perfil</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{type}</Badge>;
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'id_front':
      case 'id_back':
        return <FileText className="w-4 h-4" />;
      case 'selfie':
        return <Camera className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getDocumentName = (type: string) => {
    switch (type) {
      case 'id_front':
        return 'RG/CNH - Frente';
      case 'id_back':
        return 'RG/CNH - Verso';
      case 'selfie':
        return 'Selfie de Verificação';
      default:
        return type;
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

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Erro",
        description: "Motivo da rejeição é obrigatório",
        variant: "destructive"
      });
      return;
    }
    rejectVerificationMutation.mutate({ reason: rejectionReason });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Detalhes da Verificação">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-800/50 rounded w-48"></div>
          <div className="h-64 bg-blue-800/50 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!verification) {
    return (
      <AdminLayout title="Verificação não encontrada">
        <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
          <p className="text-blue-200">Verificação não encontrada.</p>
          <Button
            onClick={() => setLocation("/admin/verifications")}
            className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            Voltar à lista
          </Button>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Verificação: ${verification.user.name}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLocation("/admin/verifications")}
              variant="outline"
              className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Verificação #{verification.id}</h1>
              {getStatusBadge(verification.status)}
              {getTypeBadge(verification.type)}
            </div>
          </div>

          {verification.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                onClick={() => approveVerificationMutation.mutate()}
                disabled={approveVerificationMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button
                onClick={() => setShowRejectForm(!showRejectForm)}
                variant="outline"
                className="border-red-600/50 text-red-300 hover:bg-red-700/50"
              >
                <X className="w-4 h-4 mr-2" />
                Rejeitar
              </Button>
            </div>
          )}
        </div>

        {/* Reject Form */}
        {showRejectForm && (
          <Card className="p-6 bg-red-800/20 backdrop-blur-sm border-red-700/50">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Rejeitar Verificação
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-red-200 text-sm mb-2 block">Motivo da rejeição</label>
                <Textarea
                  placeholder="Descreva o motivo da rejeição..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="bg-red-700/30 border-red-600/50 text-white placeholder:text-red-300"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleReject}
                  disabled={rejectVerificationMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {rejectVerificationMutation.isPending ? 'Rejeitando...' : 'Confirmar Rejeição'}
                </Button>
                <Button
                  onClick={() => setShowRejectForm(false)}
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
            {/* User Info */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Usuário
              </h3>
              
              <div className="flex items-center gap-4">
                <img
                  src={verification.user.photo}
                  alt={verification.user.name}
                  className="w-16 h-16 rounded-full bg-blue-700/50"
                />
                <div>
                  <h4 className="text-white font-semibold">{verification.user.name}</h4>
                  <p className="text-blue-200">{verification.user.email}</p>
                  <p className="text-blue-300 text-sm">Membro desde: {formatDate(verification.user.createdAt)}</p>
                </div>
              </div>
            </Card>

            {/* Documents */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos Enviados
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verification.documents.map((doc, index) => (
                  <div key={index} className="space-y-3">
                    <div className="bg-blue-700/30 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-blue-200">
                          {getDocumentIcon(doc.type)}
                          <span className="text-sm font-medium">{getDocumentName(doc.type)}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-blue-300">
                        {doc.filename} • {doc.size}
                      </p>
                      <p className="text-xs text-blue-400">
                        Enviado: {formatDate(doc.uploaded)}
                      </p>
                    </div>
                    
                    <div className="relative group">
                      <img
                        src={doc.url}
                        alt={getDocumentName(doc.type)}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform group-hover:scale-105"
                        onClick={() => window.open(doc.url, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Notes */}
            {verification.notes && (
              <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
                <h3 className="text-white text-lg font-semibold mb-4">Observações</h3>
                <p className="text-blue-200">{verification.notes}</p>
              </Card>
            )}

            {/* Rejection Reason */}
            {verification.rejectionReason && (
              <Card className="p-6 bg-red-800/20 backdrop-blur-sm border-red-700/50">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Motivo da Rejeição
                </h3>
                <p className="text-red-200">{verification.rejectionReason}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Info */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Status da Verificação</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Status:</span>
                  {getStatusBadge(verification.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Tipo:</span>
                  {getTypeBadge(verification.type)}
                </div>
                <div>
                  <span className="text-blue-200 text-sm">Enviado em:</span>
                  <p className="text-white">{formatDate(verification.submittedAt)}</p>
                </div>
                {verification.reviewedAt && (
                  <div>
                    <span className="text-blue-200 text-sm">Revisado em:</span>
                    <p className="text-white">{formatDate(verification.reviewedAt)}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Metadata */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Metadados</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-blue-200">IP Address:</span>
                  <p className="text-white font-mono">{verification.metadata.ipAddress}</p>
                </div>
                <div>
                  <span className="text-blue-200">Device:</span>
                  <p className="text-white capitalize">{verification.metadata.deviceType}</p>
                </div>
                <div>
                  <span className="text-blue-200">User Agent:</span>
                  <p className="text-white text-xs break-all">{verification.metadata.userAgent}</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <h3 className="text-white text-lg font-semibold mb-4">Ações Rápidas</h3>
              
              <div className="space-y-3">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  onClick={() => setLocation(`/admin/users/${verification.user.id}`)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Ver Perfil do Usuário
                </Button>
                
                <Button
                  className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                  variant="outline"
                  onClick={() => setLocation(`/admin/verifications?user=${verification.user.id}`)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Outras Verificações
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
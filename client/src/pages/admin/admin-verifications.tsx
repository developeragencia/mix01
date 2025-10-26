import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  User,
  Calendar,
  FileText,
  Camera,
  ChevronDown,
  X,
  AlertCircle
} from "lucide-react";

interface Verification {
  id: number;
  userId: number;
  email: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected' | 'none';
  verificationMethod?: string;
  documentImage?: string;
  selfieImage?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export default function AdminVerifications() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: verifications, isLoading } = useQuery<Verification[]>({
    queryKey: ['/api/admin/verifications'],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch('/api/admin/verifications', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Erro ao carregar verificações');
      }
      
      return res.json();
    },
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/verifications/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Erro ao aprovar verificação');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      toast({
        title: "Verificação Aprovada",
        description: "O usuário foi verificado com sucesso"
      });
      setSelectedVerification(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/verifications/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ reason })
      });
      
      if (!res.ok) {
        throw new Error('Erro ao rejeitar verificação');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      toast({
        title: "Verificação Rejeitada",
        description: "O usuário foi notificado"
      });
      setSelectedVerification(null);
      setRejectReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const filteredVerifications = verifications?.filter(verification => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      verification.email.toLowerCase().includes(searchLower) ||
      verification.userName.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus === 'all' || verification.status === filterStatus;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
    const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
    return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const stats = {
    total: verifications?.length || 0,
    pending: verifications?.filter(v => v.status === 'pending').length || 0,
    approved: verifications?.filter(v => v.status === 'approved').length || 0,
    rejected: verifications?.filter(v => v.status === 'rejected').length || 0
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejeitado</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Sem Status</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Verificações de Usuários">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-blue-800/50 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-blue-800/50 rounded-xl"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Verificações de Usuários">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-900/50 to-blue-800/30 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-sm font-medium">Total</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-900/50 to-yellow-800/30 backdrop-blur-sm border-yellow-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium">Pendentes</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-green-900/50 to-green-800/30 backdrop-blur-sm border-green-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-300 text-sm font-medium">Aprovadas</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.approved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-red-900/50 to-red-800/30 backdrop-blur-sm border-red-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Rejeitadas</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.rejected}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-4 bg-blue-900/30 backdrop-blur-sm border-blue-700/50">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                <Input
                  type="text"
                  placeholder="Buscar por email ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-blue-800/50 border-blue-700/50 text-white placeholder:text-blue-400 h-12"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="bg-blue-800/50 border-blue-700/50 text-white hover:bg-blue-700/50 h-12"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-blue-700/50">
                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
                    <option value="pending">Pendentes</option>
                    <option value="approved">Aprovadas</option>
                    <option value="rejected">Rejeitadas</option>
                  </select>
                </div>

                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block">Ordenar Por</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2"
                  >
                    <option value="newest">Mais Recentes</option>
                    <option value="oldest">Mais Antigas</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-blue-300 text-sm">
            Mostrando <span className="font-bold text-white">{filteredVerifications?.length || 0}</span> de <span className="font-bold text-white">{verifications?.length || 0}</span> verificações
          </p>
        </div>

        {/* Verifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVerifications && filteredVerifications.length > 0 ? (
            filteredVerifications.map((verification) => (
              <Card 
                key={verification.id} 
                className="p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50 hover:border-pink-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {verification.userName[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{verification.userName}</h3>
                      <p className="text-blue-400 text-sm">{verification.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(verification.status)}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Enviado em:
                    </span>
                    <span className="text-white font-medium">{formatDate(verification.submittedAt)}</span>
                  </div>

                  {verification.verificationMethod && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-300 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Método:
                      </span>
                      <span className="text-white font-medium capitalize">{verification.verificationMethod}</span>
                    </div>
                  )}

                  {verification.status === 'rejected' && verification.rejectionReason && (
                    <div className="bg-red-900/30 rounded-lg p-3 border border-red-700/50">
                      <p className="text-red-200 text-xs">
                        <strong>Motivo da Rejeição:</strong> {verification.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Images Preview */}
                {(verification.documentImage || verification.selfieImage) && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {verification.documentImage && (
                      <div>
                        <p className="text-blue-300 text-xs mb-2 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Documento
                        </p>
                        <img
                          src={verification.documentImage}
                          alt="Documento"
                          className="w-full h-32 object-cover rounded-lg border border-blue-700/50 cursor-pointer hover:border-pink-500/50 transition-all"
                          onClick={() => window.open(verification.documentImage, '_blank')}
                        />
                      </div>
                    )}
                    {verification.selfieImage && (
                      <div>
                        <p className="text-blue-300 text-xs mb-2 flex items-center gap-1">
                          <Camera className="w-3 h-3" />
                          Selfie
                        </p>
                        <img
                          src={verification.selfieImage}
                          alt="Selfie"
                          className="w-full h-32 object-cover rounded-lg border border-blue-700/50 cursor-pointer hover:border-pink-500/50 transition-all"
                          onClick={() => window.open(verification.selfieImage, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                {verification.status === 'pending' && (
                  <div className="flex gap-2">
                        <Button
                      onClick={() => approveMutation.mutate(verification.id)}
                      disabled={approveMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                      onClick={() => setSelectedVerification(verification)}
                      disabled={rejectMutation.isPending}
                      variant="outline"
                      className="flex-1 border-red-600/50 text-red-300 hover:bg-red-700/50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                  </div>
                )}

                <div className="mt-3">
                  <Button
                    onClick={() => setLocation(`/admin/users/${verification.userId}`)}
                    variant="outline"
                    size="sm"
                    className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Ver Perfil do Usuário
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-2">
              <Card className="p-12 bg-blue-900/30 backdrop-blur-sm border-blue-700/50 text-center">
                <Shield className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
                <p className="text-blue-300 text-lg">Nenhuma verificação encontrada</p>
                <p className="text-blue-400 text-sm mt-2">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Tente ajustar os filtros de busca'
                    : 'Não há verificações pendentes no momento'}
                </p>
              </Card>
            </div>
          )}
      </div>

        {/* Reject Modal */}
          {selectedVerification && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-6 bg-blue-900 border-blue-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-xl font-bold">Rejeitar Verificação</h3>
                <button
                  onClick={() => {
                    setSelectedVerification(null);
                    setRejectReason("");
                  }}
                  className="text-blue-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-blue-300 mb-2">
                  Você está prestes a rejeitar a verificação de <strong className="text-white">{selectedVerification.userName}</strong>
                </p>
              </div>

              <div className="mb-6">
                <label className="text-blue-300 text-sm font-medium mb-2 block">
                  Motivo da Rejeição
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explique o motivo da rejeição..."
                  className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2 min-h-[100px] placeholder:text-blue-400"
                  required
                />
                </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedVerification(null);
                    setRejectReason("");
                  }}
                  variant="outline"
                  className="flex-1 border-blue-600/50 text-blue-300"
                >
                  Cancelar
              </Button>
              <Button
                onClick={() => {
                    if (rejectReason.trim()) {
                      rejectMutation.mutate({
                        id: selectedVerification.id,
                      reason: rejectReason
                    });
                  }
                }}
                  disabled={!rejectReason.trim() || rejectMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
              >
                  <XCircle className="w-4 h-4 mr-2" />
                Confirmar Rejeição
              </Button>
            </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

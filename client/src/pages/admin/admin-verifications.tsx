import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserCheck, 
  CheckCircle,
  X,
  Clock,
  AlertTriangle,
  Eye,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, adminRequest } from "@/lib/admin-fetch";

interface Verification {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  userPhoto: string | null;
  isVerified: boolean;
  verificationMethod: string | null;
  verifiedAt: string | null;
  verificationImages: string[];
  createdAt: string;
}

export default function AdminVerifications() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: verifications = [], isLoading } = useQuery<Verification[]>({
    queryKey: ['/api/admin/verifications'],
    staleTime: 15000,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await adminFetch('/api/admin/verifications');
      if (!response.ok) throw new Error('Failed to fetch verifications');
      return response.json();
    }
  });

  const approveVerificationMutation = useMutation({
    mutationFn: async (verificationId: number) => {
      const response = await adminRequest(`/api/admin/verifications/${verificationId}/approve`, 'POST');
      if (!response.ok) throw new Error('Failed to approve verification');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      toast({
        title: "✅ Verificação Aprovada",
        description: "O perfil do usuário foi verificado com sucesso"
      });
      setSelectedVerification(null);
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao aprovar verificação",
        variant: "destructive"
      });
    }
  });

  const rejectVerificationMutation = useMutation({
    mutationFn: async ({ verificationId, reason }: { verificationId: number; reason: string }) => {
      const response = await fetch(`/api/admin/verifications/${verificationId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      if (!response.ok) throw new Error('Failed to reject verification');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/verifications'] });
      toast({
        title: "❌ Verificação Rejeitada",
        description: "A solicitação foi rejeitada"
      });
      setShowRejectDialog(false);
      setRejectReason("");
      setSelectedVerification(null);
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao rejeitar verificação",
        variant: "destructive"
      });
    }
  });

  const pendingVerifications = verifications.filter(v => !v.isVerified && !v.verifiedAt);
  const approvedVerifications = verifications.filter(v => v.isVerified);

  if (isLoading) {
    return (
      <AdminLayout title="Verificações de Perfil">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Verificações de Perfil">
      <div className="space-y-3 w-full">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-blue-200 text-xs">Pendentes</p>
                <p className="text-white text-xl font-bold">{pendingVerifications.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-blue-200 text-xs">Aprovadas</p>
                <p className="text-white text-xl font-bold">{approvedVerifications.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-blue-200 text-xs">Total</p>
                <p className="text-white text-xl font-bold">{verifications.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Verifications List */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Solicitações de Verificação</h3>
          
          {verifications.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <p className="text-blue-200">Nenhuma solicitação de verificação no momento</p>
            </div>
          ) : (
            <div className="space-y-3">
              {verifications.map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg hover:bg-blue-700/50 transition-all">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={verification.userPhoto || `https://ui-avatars.com/api/?name=${verification.userName}&background=ec4899&color=fff`}
                      alt={verification.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{verification.userName}</p>
                      <p className="text-blue-200 text-xs truncate">{verification.userEmail}</p>
                      <p className="text-blue-300 text-xs">
                        {verification.verificationMethod || 'Selfie'} • {new Date(verification.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {verification.isVerified ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        Verificado
                      </Badge>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          onClick={() => setSelectedVerification(verification)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => approveVerificationMutation.mutate(verification.id)}
                          disabled={approveVerificationMutation.isPending}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedVerification(verification);
                            setShowRejectDialog(true);
                          }}
                          disabled={rejectVerificationMutation.isPending}
                          className="text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Rejeitar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* View Verification Details Dialog */}
      <Dialog open={!!selectedVerification && !showRejectDialog} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 border-blue-700">
          <DialogHeader>
            <DialogTitle className="text-white">Detalhes da Verificação</DialogTitle>
            <DialogDescription className="text-blue-200">
              Revise as informações antes de aprovar ou rejeitar
            </DialogDescription>
          </DialogHeader>
          
          {selectedVerification && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedVerification.userPhoto || `https://ui-avatars.com/api/?name=${selectedVerification.userName}&background=ec4899&color=fff`}
                  alt={selectedVerification.userName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-semibold text-lg">{selectedVerification.userName}</p>
                  <p className="text-blue-200 text-sm">{selectedVerification.userEmail}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-blue-200 text-sm">
                  <strong className="text-white">Método:</strong> {selectedVerification.verificationMethod || 'Selfie'}
                </p>
                <p className="text-blue-200 text-sm">
                  <strong className="text-white">Solicitado em:</strong> {new Date(selectedVerification.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>

              {selectedVerification.verificationImages.length > 0 && (
                <div>
                  <p className="text-white font-semibold mb-2">Imagens de Verificação:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedVerification.verificationImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Verification ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => approveVerificationMutation.mutate(selectedVerification.id)}
                  disabled={approveVerificationMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aprovar Verificação
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowRejectDialog(true);
                  }}
                  disabled={rejectVerificationMutation.isPending}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeitar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Verification Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 border-blue-700">
          <DialogHeader>
            <DialogTitle className="text-white">Rejeitar Verificação</DialogTitle>
            <DialogDescription className="text-blue-200">
              Informe o motivo da rejeição (opcional)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Motivo da rejeição..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="bg-blue-700/50 border-blue-600/50 text-white min-h-[100px]"
            />

            <div className="flex gap-2">
              <Button
                onClick={() => setShowRejectDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedVerification) {
                    rejectVerificationMutation.mutate({
                      verificationId: selectedVerification.id,
                      reason: rejectReason
                    });
                  }
                }}
                disabled={rejectVerificationMutation.isPending}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Confirmar Rejeição
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

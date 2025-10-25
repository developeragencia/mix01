import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  Flag, 
  Search, 
  AlertTriangle,
  User,
  Ban,
  CheckCircle,
  X,
  Eye,
  MessageCircle,
  Shield,
  Clock
} from "lucide-react";
import type { Report } from "@shared/schema";

interface ReportWithUsers extends Report {
  reporterEmail?: string;
  reportedEmail?: string;
  reporterName?: string;
  reportedName?: string;
}

export default function AdminReportsNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<ReportWithUsers | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: reports = [], isLoading } = useQuery<ReportWithUsers[]>({
    queryKey: ['/api/admin/reports', searchTerm, statusFilter],
    staleTime: 10000, // Cache por 10 segundos
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const response = await fetch(`/api/admin/reports?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch reports');
      return response.json();
    }
  });

  const resolveReportMutation = useMutation({
    mutationFn: async ({ reportId, action, notes }: { reportId: number; action: string; notes?: string }) => {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ action, notes })
      });
      if (!response.ok) throw new Error('Failed to resolve report');
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      setModalOpen(false);
      setSelectedReport(null);
      setActionNotes("");
      
      const actionMessages = {
        'ban': 'Usuário banido com sucesso',
        'warn': 'Aviso enviado ao usuário',
        'dismiss': 'Denúncia descartada',
        'resolve': 'Denúncia resolvida'
      };
      
      toast({
        title: "✅ Ação Executada",
        description: actionMessages[variables.action as keyof typeof actionMessages] || 'Ação concluída',
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao executar ação",
        variant: "destructive"
      });
    }
  });

  const handleAction = (report: ReportWithUsers) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const executeAction = (action: string) => {
    if (!selectedReport) return;
    resolveReportMutation.mutate({
      reportId: selectedReport.id,
      action,
      notes: actionNotes
    });
  };

  const formatDate = (dateString: Date | string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'reviewing':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'dismissed':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getReasonLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      'harassment': 'Assédio',
      'fake_profile': 'Perfil Falso',
      'inappropriate_content': 'Conteúdo Inapropriado',
      'spam': 'Spam',
      'other': 'Outro'
    };
    return reasons[reason] || reason;
  };

  const getReasonIcon = (reason: string) => {
    switch (reason) {
      case 'harassment':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'fake_profile':
        return <User className="w-5 h-5 text-orange-400" />;
      case 'inappropriate_content':
        return <Flag className="w-5 h-5 text-pink-400" />;
      case 'spam':
        return <MessageCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Shield className="w-5 h-5 text-blue-400" />;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Denúncias">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSearch = !searchTerm || 
      report.reportedEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = reports.filter(r => r.status === 'pending').length;
  const reviewingCount = reports.filter(r => r.status === 'reviewing').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;

  return (
    <AdminLayout title="Gerenciar Denúncias">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border-yellow-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-300">Pendentes</p>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Em Análise</p>
                <p className="text-2xl font-bold text-white">{reviewingCount}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Resolvidas</p>
                <p className="text-2xl font-bold text-white">{resolvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-300">Total</p>
                <p className="text-2xl font-bold text-white">{reports.length}</p>
              </div>
              <Flag className="w-8 h-8 text-red-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 bg-gray-900/50 border-gray-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por email ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
                data-testid="input-search-reports"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? 'bg-gradient-to-r from-pink-500 to-purple-600' : ''}
                data-testid="button-filter-all"
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === 'pending' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('pending')}
                className={statusFilter === 'pending' ? 'bg-yellow-600' : ''}
                data-testid="button-filter-pending"
              >
                Pendentes
              </Button>
              <Button
                variant={statusFilter === 'resolved' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('resolved')}
                className={statusFilter === 'resolved' ? 'bg-green-600' : ''}
                data-testid="button-filter-resolved"
              >
                Resolvidas
              </Button>
            </div>
          </div>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <Card className="p-8 bg-gray-900/50 border-gray-700/50 text-center">
              <Flag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Nenhuma denúncia encontrada</h3>
              <p className="text-gray-400">Não há denúncias que correspondam aos filtros selecionados</p>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/50 border-gray-700/50 hover:border-gray-600/50 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      {getReasonIcon(report.reason)}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={`${getStatusColor(report.status)} border`}>
                          {report.status === 'pending' && 'Pendente'}
                          {report.status === 'reviewing' && 'Em Análise'}
                          {report.status === 'resolved' && 'Resolvida'}
                          {report.status === 'dismissed' && 'Descartada'}
                        </Badge>
                        <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
                          {getReasonLabel(report.reason)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Denunciante</p>
                          <p className="text-sm text-white font-medium">
                            {report.reporterEmail || `ID: ${report.reporterId}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Denunciado</p>
                          <p className="text-sm text-white font-medium">
                            {report.reportedEmail || `ID: ${report.reportedUserId}`}
                          </p>
                        </div>
                      </div>

                      {report.description && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Descrição</p>
                          <p className="text-sm text-gray-300">{report.description}</p>
                        </div>
                      )}

                      {report.notes && (
                        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                          <p className="text-xs text-blue-300 mb-1">Notas do Administrador</p>
                          <p className="text-sm text-blue-200">{report.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Criada em: {formatDate(report.createdAt)}</span>
                        {report.reviewedAt && (
                          <span>Revisada em: {formatDate(report.reviewedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {report.status === 'pending' && (
                    <Button
                      onClick={() => handleAction(report)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      data-testid={`button-action-${report.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Analisar
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Action Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-400" />
              Moderar Denúncia
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Escolha a ação apropriada para esta denúncia
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-gray-400">Motivo:</p>
                <p className="text-white font-medium">{getReasonLabel(selectedReport.reason)}</p>
                {selectedReport.description && (
                  <>
                    <p className="text-sm text-gray-400 mt-3">Descrição:</p>
                    <p className="text-white">{selectedReport.description}</p>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-white">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Adicione observações sobre esta denúncia..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  data-testid="textarea-action-notes"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => executeAction('ban')}
                  disabled={resolveReportMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                  data-testid="button-ban-user"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Banir Usuário
                </Button>
                <Button
                  onClick={() => executeAction('warn')}
                  disabled={resolveReportMutation.isPending}
                  className="bg-yellow-600 hover:bg-yellow-700"
                  data-testid="button-warn-user"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Enviar Aviso
                </Button>
                <Button
                  onClick={() => executeAction('resolve')}
                  disabled={resolveReportMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-resolve-report"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolver
                </Button>
                <Button
                  onClick={() => executeAction('dismiss')}
                  disabled={resolveReportMutation.isPending}
                  className="bg-gray-600 hover:bg-gray-700"
                  data-testid="button-dismiss-report"
                >
                  <X className="w-4 h-4 mr-2" />
                  Descartar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

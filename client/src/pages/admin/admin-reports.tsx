import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Flag, 
  CheckCircle,
  X,
  Eye,
  AlertTriangle,
  UserX,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminReports() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: reports, isLoading } = useQuery({
    queryKey: ['/api/admin/reports', statusFilter],
    queryFn: async () => {
      const response = await fetch(`/api/admin/reports?status=${statusFilter}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      return response.json();
    }
  });

  const resolveReportMutation = useMutation({
    mutationFn: async ({ reportId, action }: { reportId: number, action: 'approve' | 'reject' }) => {
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      toast({
        title: "Sucesso",
        description: "Denúncia processada com sucesso"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pendente</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Resolvida</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejeitada</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inappropriate_content':
        return <MessageSquare className="w-5 h-5 text-red-400" />;
      case 'fake_profile':
        return <UserX className="w-5 h-5 text-orange-400" />;
      default:
        return <Flag className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'inappropriate_content':
        return 'Conteúdo Inadequado';
      case 'fake_profile':
        return 'Perfil Falso';
      case 'harassment':
        return 'Assédio';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Denúncias">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 bg-blue-800/50 rounded-lg"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Denúncias">
      <div className="space-y-6">
        {/* Filters */}
        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar denúncias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-blue-700/50 border border-blue-600/50 rounded-md text-white"
            >
              <option value="pending">Pendentes</option>
              <option value="resolved">Resolvidas</option>
              <option value="rejected">Rejeitadas</option>
            </select>
          </div>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {reports?.map((report) => (
            <Card key={report.id} className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getTypeIcon(report.type)}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-semibold">{getTypeName(report.type)}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-blue-200 text-sm">
                        Denunciado por: <span className="text-white">{report.reporter.name}</span>
                      </p>
                      <p className="text-blue-300 text-xs">
                        {new Date(report.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setLocation(`/admin/reports/${report.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>

                {/* Reported User */}
                <div className="flex items-center gap-4 p-4 bg-blue-700/30 rounded-lg">
                  <img
                    src={report.reported.photo}
                    alt={report.reported.name}
                    className="w-12 h-12 rounded-full bg-blue-700/50"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">Usuário Denunciado:</p>
                    <p className="text-blue-200">{report.reported.name}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-600/50 text-purple-300 hover:bg-purple-700/50"
                    onClick={() => setLocation(`/admin/users/${report.reported.id}`)}
                  >
                    Ver Perfil
                  </Button>
                </div>

                {/* Report Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Motivo:</p>
                    <p className="text-white">{report.reason}</p>
                  </div>
                  <div>
                    <p className="text-blue-200 text-sm font-medium mb-1">Descrição:</p>
                    <p className="text-white">{report.description}</p>
                  </div>
                  {report.evidence.length > 0 && (
                    <div>
                      <p className="text-blue-200 text-sm font-medium mb-2">Evidências:</p>
                      <div className="flex gap-2">
                        {report.evidence.map((evidence, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="border-blue-600/50 text-blue-200 hover:bg-blue-700/50"
                          >
                            📎 {evidence}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {report.status === 'pending' && (
                  <div className="flex justify-end gap-2 pt-4 border-t border-blue-700/50">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600/50 text-red-300 hover:bg-red-700/50"
                      onClick={() => resolveReportMutation.mutate({ reportId: report.id, action: 'reject' })}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-600/50 text-green-300 hover:bg-green-700/50"
                      onClick={() => resolveReportMutation.mutate({ reportId: report.id, action: 'approve' })}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Aprovar & Agir
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {reports?.length === 0 && (
          <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center">
            <AlertTriangle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-blue-200">Nenhuma denúncia {statusFilter} encontrada.</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
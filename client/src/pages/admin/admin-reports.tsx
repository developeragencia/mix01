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
  AlertCircle,
  Search, 
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Flag,
  ChevronDown,
  X,
  Ban
} from "lucide-react";

interface Report {
  id: number;
  reporterId: number;
  reporterName: string;
  reportedId: number;
  reportedName: string;
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
}

export default function AdminReports() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['/api/admin/reports'],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch('/api/admin/reports', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Erro ao carregar denúncias');
      }
      
      return res.json();
    },
    refetchInterval: 30000,
  });

  const resolveMutation = useMutation({
    mutationFn: async ({ id, action }: { id: number; action: 'resolve' | 'dismiss' }) => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/reports/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error(`Erro ao ${action === 'resolve' ? 'resolver' : 'descartar'} denúncia`);
      }
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      toast({
        title: variables.action === 'resolve' ? "Denúncia Resolvida" : "Denúncia Descartada",
        description: `A denúncia foi ${variables.action === 'resolve' ? 'resolvida' : 'descartada'} com sucesso`
      });
      setSelectedReport(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const filteredReports = reports?.filter(report => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      report.reporterName.toLowerCase().includes(searchLower) ||
      report.reportedName.toLowerCase().includes(searchLower) ||
      report.reason.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
  });

  const stats = {
    total: reports?.length || 0,
    pending: reports?.filter(r => r.status === 'pending').length || 0,
    resolved: reports?.filter(r => r.status === 'resolved').length || 0,
    urgent: reports?.filter(r => r.priority === 'high').length || 0
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Resolvida</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30"><XCircle className="w-3 h-3 mr-1" />Descartada</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30"><AlertCircle className="w-3 h-3 mr-1" />Alta</Badge>;
      case 'medium':
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30"><AlertCircle className="w-3 h-3 mr-1" />Média</Badge>;
      case 'low':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30"><AlertCircle className="w-3 h-3 mr-1" />Baixa</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciamento de Denúncias">
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
    <AdminLayout title="Gerenciamento de Denúncias">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-red-900/50 to-red-800/30 backdrop-blur-sm border-red-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-300 text-sm font-medium">Total de Denúncias</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.total}</p>
              </div>
              <Flag className="w-10 h-10 text-red-400" />
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
                <p className="text-green-300 text-sm font-medium">Resolvidas</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-900/50 to-orange-800/30 backdrop-blur-sm border-orange-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium">Urgentes</p>
                <p className="text-white text-3xl font-bold mt-1">{stats.urgent}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-orange-400" />
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
                  placeholder="Buscar por usuário ou motivo..."
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-blue-700/50">
                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block">Status</label>
            <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="resolved">Resolvidas</option>
                    <option value="dismissed">Descartadas</option>
                  </select>
                </div>

                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block">Prioridade</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as any)}
                    className="w-full bg-blue-800/50 border border-blue-700/50 text-white rounded-lg px-3 py-2"
                  >
                    <option value="all">Todas</option>
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
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
                    <option value="priority">Por Prioridade</option>
            </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-blue-300 text-sm">
            Mostrando <span className="font-bold text-white">{filteredReports?.length || 0}</span> de <span className="font-bold text-white">{reports?.length || 0}</span> denúncias
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredReports && filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card 
                key={report.id} 
                className={`p-6 bg-blue-900/30 backdrop-blur-sm border-blue-700/50 hover:border-red-500/50 transition-all ${
                  report.priority === 'high' ? 'border-l-4 border-l-red-500' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Section - Report Info */}
                  <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Flag className={`w-6 h-6 ${
                          report.priority === 'high' ? 'text-red-400' :
                          report.priority === 'medium' ? 'text-orange-400' :
                          'text-blue-400'
                        }`} />
                    <div>
                          <h3 className="text-white font-semibold text-lg">Denúncia #{report.id}</h3>
                          <p className="text-blue-400 text-sm">{formatDate(report.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(report.status)}
                        {getPriorityBadge(report.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-800/30 rounded-lg p-3">
                        <p className="text-blue-300 text-xs mb-1 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Denunciante
                        </p>
                        <p className="text-white font-medium">{report.reporterName}</p>
                        <p className="text-blue-400 text-xs">ID: {report.reporterId}</p>
                  </div>
                  
                      <div className="bg-red-900/20 rounded-lg p-3 border border-red-700/30">
                        <p className="text-red-300 text-xs mb-1 flex items-center gap-1">
                          <Ban className="w-3 h-3" />
                          Denunciado
                        </p>
                        <p className="text-white font-medium">{report.reportedName}</p>
                        <p className="text-red-400 text-xs">ID: {report.reportedId}</p>
                  </div>
                </div>

                    <div className="bg-blue-800/30 rounded-lg p-4">
                      <p className="text-blue-300 text-sm font-semibold mb-2">Motivo:</p>
                      <p className="text-white">{report.reason}</p>
                      {report.description && (
                        <>
                          <p className="text-blue-300 text-sm font-semibold mt-3 mb-2">Descrição:</p>
                          <p className="text-white text-sm">{report.description}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Section - Actions */}
                  <div className="lg:w-64 space-y-3">
                    {report.status === 'pending' && (
                      <>
                  <Button
                          onClick={() => resolveMutation.mutate({ id: report.id, action: 'resolve' })}
                          disabled={resolveMutation.isPending}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Resolver
                  </Button>
                          <Button
                          onClick={() => resolveMutation.mutate({ id: report.id, action: 'dismiss' })}
                          disabled={resolveMutation.isPending}
                            variant="outline"
                          className="w-full border-gray-600/50 text-gray-300 hover:bg-gray-700/50"
                          >
                          <XCircle className="w-4 h-4 mr-2" />
                          Descartar
                          </Button>
                      </>
                  )}

                    <Button
                      onClick={() => setLocation(`/admin/users/${report.reportedId}`)}
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Denunciado
                    </Button>

                    <Button
                      onClick={() => setLocation(`/admin/users/${report.reporterId}`)}
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-600/50 text-blue-300 hover:bg-blue-700/50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Ver Denunciante
                    </Button>
                  </div>
              </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 bg-blue-900/30 backdrop-blur-sm border-blue-700/50 text-center">
              <Flag className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
              <p className="text-blue-300 text-lg">Nenhuma denúncia encontrada</p>
              <p className="text-blue-400 text-sm mt-2">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Não há denúncias registradas ainda'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

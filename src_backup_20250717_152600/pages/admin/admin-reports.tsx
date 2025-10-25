import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Flag, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  User,
  Calendar,
  Clock
} from "lucide-react";

export default function AdminReports() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Mock reports data
  const { data: reports = [] } = useQuery({
    queryKey: ["admin-reports", searchTerm, filterStatus, filterType],
    queryFn: async () => {
      return [
        {
          id: 1,
          type: "inappropriate_content",
          status: "pending",
          reportedUser: {
            id: 123,
            name: "João Silva",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reporter: {
            id: 456,
            name: "Maria Santos",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b2bc?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reason: "Conteúdo inadequado nas fotos do perfil",
          description: "O usuário possui fotos com conteúdo explícito em seu perfil.",
          createdAt: "2024-06-22T10:30:00Z",
          evidence: ["screenshot1.jpg", "screenshot2.jpg"],
          priority: "high"
        },
        {
          id: 2,
          type: "harassment",
          status: "under_review",
          reportedUser: {
            id: 789,
            name: "Carlos Oliveira",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reporter: {
            id: 321,
            name: "Ana Costa",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reason: "Assédio através de mensagens",
          description: "Usuário enviando mensagens ofensivas e persistentes mesmo após bloqueio.",
          createdAt: "2024-06-21T15:45:00Z",
          evidence: ["chat_log.txt"],
          priority: "urgent"
        },
        {
          id: 3,
          type: "fake_profile",
          status: "resolved",
          reportedUser: {
            id: 654,
            name: "Perfil Falso",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reporter: {
            id: 987,
            name: "Pedro Lima",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reason: "Perfil falso com fotos roubadas",
          description: "Usuário utilizando fotos de terceiros para criar perfil falso.",
          createdAt: "2024-06-20T09:15:00Z",
          evidence: ["reverse_search.jpg"],
          priority: "medium",
          resolution: "Perfil suspenso permanentemente após investigação."
        }
      ];
    }
  });

  const handleReportAction = (reportId: number, action: string) => {
    alert(`Ação "${action}" aplicada ao relatório ID: ${reportId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "under_review":
        return <Badge className="bg-blue-100 text-blue-800">Em Análise</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolvido</Badge>;
      case "dismissed":
        return <Badge className="bg-gray-100 text-gray-800">Descartado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgente</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Normal</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    const types = {
      inappropriate_content: "Conteúdo Inadequado",
      harassment: "Assédio",
      fake_profile: "Perfil Falso",
      spam: "Spam",
      underage: "Menor de Idade",
      violence: "Violência",
      other: "Outro"
    };
    return types[type as keyof typeof types] || type;
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesType = filterType === "all" || report.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AdminLayout currentPage="reports">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gerenciar Denúncias</h1>
            <p className="text-gray-600">Analise e resolva relatórios de usuários</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Casos Urgentes
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">23</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Análise</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolvidos Hoje</p>
                <p className="text-2xl font-bold text-green-600">15</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Casos Urgentes</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por usuário, motivo ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendentes</option>
                <option value="under_review">Em Análise</option>
                <option value="resolved">Resolvidos</option>
                <option value="dismissed">Descartados</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Todos os Tipos</option>
                <option value="inappropriate_content">Conteúdo Inadequado</option>
                <option value="harassment">Assédio</option>
                <option value="fake_profile">Perfil Falso</option>
                <option value="spam">Spam</option>
                <option value="underage">Menor de Idade</option>
                <option value="violence">Violência</option>
                <option value="other">Outro</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className={`p-6 ${report.priority === 'urgent' ? 'border-l-4 border-red-500' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Flag className="w-5 h-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">#{report.id} - {getTypeLabel(report.type)}</h3>
                    {getStatusBadge(report.status)}
                    {getPriorityBadge(report.priority)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    {/* Reported User */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Usuário Denunciado</h4>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={report.reportedUser.avatar} 
                          alt={report.reportedUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{report.reportedUser.name}</p>
                          <p className="text-sm text-gray-500">ID: {report.reportedUser.id}</p>
                        </div>
                      </div>
                    </div>

                    {/* Reporter */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Denunciante</h4>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={report.reporter.avatar} 
                          alt={report.reporter.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{report.reporter.name}</p>
                          <p className="text-sm text-gray-500">ID: {report.reporter.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Motivo</h4>
                    <p className="text-gray-900">{report.reason}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Descrição</h4>
                    <p className="text-gray-600">{report.description}</p>
                  </div>

                  {report.evidence && report.evidence.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Evidências</h4>
                      <div className="flex space-x-2">
                        {report.evidence.map((evidence, index) => (
                          <Badge key={index} variant="outline" className="text-blue-600">
                            📎 {evidence}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.resolution && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="text-sm font-medium text-green-800 mb-1">Resolução</h4>
                      <p className="text-green-700 text-sm">{report.resolution}</p>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(report.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2 ml-6">
                  <Button
                    size="sm"
                    onClick={() => setLocation(`/admin/reports/${report.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detalhar
                  </Button>
                  
                  {report.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleReportAction(report.id, "start_review")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Iniciar Análise
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction(report.id, "dismiss")}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Descartar
                      </Button>
                    </>
                  )}
                  
                  {report.status === "under_review" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleReportAction(report.id, "resolve")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction(report.id, "escalate")}
                      >
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Escalar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{filteredReports.length}</span> denúncias
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" disabled>Anterior</Button>
            <Button variant="outline">1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Próximo</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
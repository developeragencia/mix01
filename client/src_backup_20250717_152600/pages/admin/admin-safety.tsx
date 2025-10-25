import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  Lock, 
  Eye,
  Ban,
  UserX,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  FileText,
  Activity
} from "lucide-react";

export default function AdminSafety() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  // Mock safety incidents data
  const { data: incidents = [] } = useQuery({
    queryKey: ["admin-safety", searchTerm, filterType],
    queryFn: async () => {
      return [
        {
          id: 1,
          type: "harassment",
          severity: "high",
          status: "investigating",
          reportedUser: {
            id: 456,
            name: "João Suspeito",
            email: "joao@example.com",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reportingUser: {
            id: 123,
            name: "Maria Silva",
            email: "maria@example.com"
          },
          description: "Usuário enviando mensagens inadequadas e persistindo após ser bloqueado",
          reportedAt: "2024-06-22T10:30:00Z",
          evidence: ["screenshot1.jpg", "messages.txt"],
          assignedTo: "admin@mix.com",
          actionsTaken: []
        },
        {
          id: 2,
          type: "fake_profile",
          severity: "medium",
          status: "resolved",
          reportedUser: {
            id: 789,
            name: "Perfil Falso",
            email: "fake@example.com",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reportingUser: {
            id: 321,
            name: "Ana Costa",
            email: "ana@example.com"
          },
          description: "Perfil usando fotos de terceiros e informações falsas",
          reportedAt: "2024-06-21T14:20:00Z",
          evidence: ["comparison.jpg"],
          assignedTo: "admin@mix.com",
          actionsTaken: ["profile_suspended", "user_notified"],
          resolvedAt: "2024-06-21T16:45:00Z"
        },
        {
          id: 3,
          type: "inappropriate_content",
          severity: "low",
          status: "pending",
          reportedUser: {
            id: 654,
            name: "Carlos Santos",
            email: "carlos@example.com",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format&q=60"
          },
          reportingUser: {
            id: 987,
            name: "Julia Lima",
            email: "julia@example.com"
          },
          description: "Fotos de perfil com conteúdo inadequado",
          reportedAt: "2024-06-22T16:15:00Z",
          evidence: ["photo1.jpg"],
          assignedTo: null,
          actionsTaken: []
        }
      ];
    }
  });

  const safetyStats = {
    totalIncidents: 247,
    activeIncidents: 23,
    resolvedToday: 15,
    pendingReview: 8,
    averageResolutionTime: "4.2h",
    falseReports: 12
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-800">Baixa</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecida</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "investigating":
        return <Badge className="bg-blue-100 text-blue-800">Investigando</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolvido</Badge>;
      case "dismissed":
        return <Badge className="bg-gray-100 text-gray-800">Arquivado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "harassment":
        return <UserX className="w-5 h-5 text-red-500" />;
      case "fake_profile":
        return <Eye className="w-5 h-5 text-orange-500" />;
      case "inappropriate_content":
        return <Flag className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleIncidentAction = (incidentId: number, action: string) => {
    alert(`Ação "${action}" aplicada ao incidente ID: ${incidentId}`);
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.reportedUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || incident.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout currentPage="safety">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Centro de Segurança</h1>
          <p className="text-white/80">Monitore e gerencie incidentes de segurança da plataforma</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Incidentes Ativos</p>
                <p className="text-2xl font-bold text-white">{safetyStats.activeIncidents}</p>
                <p className="text-sm text-orange-300 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {safetyStats.pendingReview} pendentes
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-300" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Resolvidos Hoje</p>
                <p className="text-2xl font-bold text-white">{safetyStats.resolvedToday}</p>
                <p className="text-sm text-green-300 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Média {safetyStats.averageResolutionTime}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-300" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total de Incidentes</p>
                <p className="text-2xl font-bold text-white">{safetyStats.totalIncidents}</p>
                <p className="text-sm text-blue-300 flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  {safetyStats.falseReports} falsos alertas
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-300" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <Input
                  placeholder="Buscar por usuário ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/60"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              >
                <option value="all" className="bg-blue-900 text-white">Todos os Status</option>
                <option value="pending" className="bg-blue-900 text-white">Pendentes</option>
                <option value="investigating" className="bg-blue-900 text-white">Investigando</option>
                <option value="resolved" className="bg-blue-900 text-white">Resolvidos</option>
                <option value="dismissed" className="bg-blue-900 text-white">Arquivados</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Incidents List */}
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <Card key={incident.id} className="p-6 bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Type Icon */}
                  <div className="mt-1">
                    {getTypeIcon(incident.type)}
                  </div>

                  {/* Incident Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-white">Incidente #{incident.id}</h3>
                      {getSeverityBadge(incident.severity)}
                      {getStatusBadge(incident.status)}
                    </div>

                    <p className="text-white/80 mb-3">{incident.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Reported User */}
                      <div className="flex items-center space-x-3">
                        <img 
                          src={incident.reportedUser.avatar} 
                          alt={incident.reportedUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">Usuário Denunciado</p>
                          <p className="text-sm text-white/70">{incident.reportedUser.name}</p>
                          <p className="text-xs text-white/50">{incident.reportedUser.email}</p>
                        </div>
                      </div>

                      {/* Reporting User */}
                      <div>
                        <p className="font-medium text-white">Denunciado por</p>
                        <p className="text-sm text-white/70">{incident.reportingUser.name}</p>
                        <p className="text-xs text-white/50">{incident.reportingUser.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>Reportado em: {new Date(incident.reportedAt).toLocaleString('pt-BR')}</span>
                      {incident.resolvedAt && (
                        <span>Resolvido em: {new Date(incident.resolvedAt).toLocaleString('pt-BR')}</span>
                      )}
                      {incident.assignedTo && (
                        <span>Responsável: {incident.assignedTo}</span>
                      )}
                    </div>

                    {/* Evidence */}
                    {incident.evidence.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-white mb-1">Evidências:</p>
                        <div className="flex space-x-2">
                          {incident.evidence.map((evidence, index) => (
                            <Badge key={index} variant="outline" className="text-white/70 border-white/30">
                              {evidence}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions Taken */}
                    {incident.actionsTaken.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-white mb-1">Ações Tomadas:</p>
                        <div className="flex space-x-2">
                          {incident.actionsTaken.map((action, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLocation(`/admin/safety/${incident.id}`)}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                  
                  {incident.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleIncidentAction(incident.id, "assign")}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Assumir Caso
                    </Button>
                  )}

                  {incident.status === "investigating" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleIncidentAction(incident.id, "suspend_user")}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Ban className="w-4 h-4 mr-1" />
                        Suspender
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleIncidentAction(incident.id, "dismiss")}
                        className="bg-gray-500/20 border-gray-300/30 text-gray-300 hover:bg-gray-500/30"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Arquivar
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
          <div className="text-sm text-white/70">
            Mostrando <span className="font-medium text-white">{filteredIncidents.length}</span> incidentes
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" disabled className="bg-white/10 border-white/30 text-white">Anterior</Button>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white">1</Button>
            <Button variant="outline" className="bg-white/10 border-white/30 text-white">2</Button>
            <Button variant="outline" className="bg-white/10 border-white/30 text-white">Próximo</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
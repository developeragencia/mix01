import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MessageSquare, 
  Eye,
  Edit,
  Flag,
  Trash2,
  Filter,
  Clock,
  Users
} from "lucide-react";

export default function AdminMessages() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['/api/admin/messages'],
    queryFn: async () => {
      const response = await fetch('/api/admin/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/message-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/message-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch message stats');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Mensagens">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-blue-800/50 rounded-lg"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Mensagens">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-blue-200 text-sm">Total de Mensagens</p>
                <p className="text-white text-xl font-bold">{stats?.totalMessages?.toLocaleString('pt-BR') || '0'}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-blue-200 text-sm">Últimas 24h</p>
                <p className="text-white text-xl font-bold">{stats?.messagesLast24h?.toLocaleString('pt-BR') || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Flag className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-blue-200 text-sm">Denúncias</p>
                <p className="text-white text-xl font-bold">{stats?.reportedMessages || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-blue-200 text-sm">Tempo Resposta</p>
                <p className="text-white text-xl font-bold">{stats?.avgResponseTime || '0'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar mensagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
              />
            </div>
            <Button variant="outline" className="border-blue-600/50 text-blue-200 hover:bg-blue-700/50">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </Card>

        {/* Messages */}
        <div className="space-y-4">
          {messages?.map((message) => (
            <Card key={message.id} className="p-6 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={message.sender.photo}
                    alt={message.sender.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">{message.sender.name}</span>
                      <span className="text-blue-300">→</span>
                      <span className="text-blue-200">{message.receiver.name}</span>
                      {message.reported && (
                        <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                          <Flag className="w-3 h-3 mr-1" />
                          Denunciada
                        </Badge>
                      )}
                    </div>
                    <p className="text-white mb-2">{message.content}</p>
                    <p className="text-blue-300 text-sm">
                      {new Date(message.sentAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
                    onClick={() => setLocation(`/admin/messages/${message.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-600/50 text-blue-200 hover:bg-blue-700/50"
                    onClick={() => setLocation(`/admin/messages/${message.id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600/50 text-red-300 hover:bg-red-700/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { adminFetch, adminRequest } from "@/lib/admin-fetch";
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Users, 
  Clock,
  Calendar,
  Eye,
  Trash2,
  Flag,
  Ban
} from "lucide-react";

interface Message {
  id: number;
  senderName: string;
  receiverName: string;
  senderId: number;
  receiverId: number;
  content: string;
  sentAt: string;
  isRead: boolean;
  matchId: number;
  reported: boolean;
}

export default function AdminMessagesNew() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      setLocation("/admin/login");
    }
  }, [setLocation]);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/admin/messages', searchTerm, statusFilter],
    staleTime: 15000, // Cache por 15 segundos
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set('search', searchTerm);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      
      const response = await adminFetch(`/api/admin/messages?${params}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    }
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const response = await adminRequest(`/api/admin/messages/${messageId}`, 'DELETE');
      if (!response.ok) throw new Error('Failed to delete message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "✅ Mensagem Removida",
        description: "Mensagem foi excluída com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "❌ Erro",
        description: "Falha ao excluir mensagem",
        variant: "destructive"
      });
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Mensagens">
        <div className="flex items-center justify-center h-64 w-full">
          <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Mensagens">
      <div className="space-y-3 w-full max-w-full overflow-x-hidden">
        {/* Search and Filters */}
        <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
              <Input
                placeholder="Buscar mensagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-blue-700/50 border-blue-600/50 text-white text-sm w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className="text-xs whitespace-nowrap"
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === 'reported' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('reported')}
                className="text-xs whitespace-nowrap"
              >
                Denunciadas
              </Button>
              <Button
                variant={statusFilter === 'unread' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('unread')}
                className="text-xs whitespace-nowrap"
              >
                Não Lidas
              </Button>
            </div>
          </div>
        </Card>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 gap-3 w-full">
          {messages.map((message: Message) => (
            <Card key={message.id} className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 hover:bg-blue-800/70 transition-all w-full">
              {/* Message Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">
                    {message.senderName} → {message.receiverName}
                  </h3>
                  <p className="text-xs text-blue-200">Match #{message.matchId}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-1">
                    {message.reported && (
                      <Badge className="bg-red-500/20 text-red-300 text-xs">
                        <Flag className="w-3 h-3 mr-1" />
                        Denunciada
                      </Badge>
                    )}
                    <Badge 
                      variant={message.isRead ? "secondary" : "default"} 
                      className={`text-xs ${message.isRead ? 'bg-gray-500/20 text-gray-300' : 'bg-blue-500/20 text-blue-300'}`}
                    >
                      {message.isRead ? 'Lida' : 'Não Lida'}
                    </Badge>
                  </div>
                  <span className="text-xs text-blue-300">{formatTime(message.sentAt)}</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="mb-3">
                <p className="text-sm text-white bg-blue-700/30 p-2 rounded text-left">
                  {message.content.length > 100 
                    ? `${message.content.substring(0, 100)}...` 
                    : message.content
                  }
                </p>
              </div>

              {/* Message Info */}
              <div className="flex items-center justify-between text-xs text-blue-200 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(message.sentAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(message.sentAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setLocation(`/admin/message-details/${message.id}`)}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-xs"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Ver Detalhes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20 text-xs"
                >
                  <Flag className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
                      deleteMessageMutation.mutate(message.id);
                    }
                  }}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20 text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {messages.length === 0 && (
          <Card className="p-8 bg-blue-800/50 backdrop-blur-sm border-blue-700/50 text-center w-full">
            <MessageCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Nenhuma mensagem encontrada</h3>
            <p className="text-blue-200">Ajuste os filtros ou tente uma busca diferente.</p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
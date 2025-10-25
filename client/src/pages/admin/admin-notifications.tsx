import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Send,
  Users,
  MessageSquare,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminNotifications() {
  const [, setLocation] = useLocation();
  const [notificationText, setNotificationText] = useState("");
  const [targetType, setTargetType] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setLocation("/admin");
    }
  }, [setLocation]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['/api/admin/notifications'],
    queryFn: async () => {
      const response = await fetch('/api/admin/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return response.json();
    }
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (data: { message: string; targetType: string }) => {
      const response = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
      setNotificationText("");
      toast({
        title: "Sucesso",
        description: "Notificação enviada com sucesso"
      });
    }
  });

  const handleSendNotification = () => {
    if (!notificationText.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma mensagem para enviar",
        variant: "destructive"
      });
      return;
    }

    sendNotificationMutation.mutate({
      message: notificationText,
      targetType
    });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gerenciar Notificações">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-blue-800/50 rounded-lg"></div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gerenciar Notificações">
      <div className="space-y-4 w-full">
        {/* Send Notification */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Enviar Notificação</h3>
          <div className="space-y-4">
            <div>
              <label className="text-blue-200 text-sm mb-2 block">Público Alvo</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full p-2 bg-blue-700/50 border border-blue-600/50 rounded text-white"
              >
                <option value="all">Todos os usuários</option>
                <option value="premium">Usuários Premium</option>
                <option value="vip">Usuários VIP</option>
                <option value="free">Usuários Gratuitos</option>
              </select>
            </div>
            <div>
              <label className="text-blue-200 text-sm mb-2 block">Mensagem</label>
              <Input
                value={notificationText}
                onChange={(e) => setNotificationText(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="bg-blue-700/50 border-blue-600/50 text-white placeholder-blue-300"
              />
            </div>
            <Button
              onClick={handleSendNotification}
              disabled={sendNotificationMutation.isPending}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendNotificationMutation.isPending ? 'Enviando...' : 'Enviar Notificação'}
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-blue-200 text-sm">Total Enviadas</p>
                <p className="text-white text-lg font-bold">{notifications?.length || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-blue-200 text-sm">Usuários Alcançados</p>
                <p className="text-white text-lg font-bold">
                  {notifications?.reduce((acc: number, n: any) => acc + (n.recipientsCount || 0), 0) || 0}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-blue-200 text-sm">Taxa de Abertura</p>
                <p className="text-white text-lg font-bold">78%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Notifications History */}
        <Card className="p-4 bg-blue-800/50 backdrop-blur-sm border-blue-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Histórico de Notificações</h3>
          <div className="space-y-3">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification: any) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-blue-700/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{notification.message || 'Notificação'}</p>
                      <p className="text-blue-200 text-sm">
                        Para: {notification.targetType === 'all' ? 'Todos os usuários' : notification.targetType}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-1">
                      {notification.recipientsCount || 0} usuários
                    </Badge>
                    <p className="text-blue-200 text-xs">
                      {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-blue-200">Nenhuma notificação enviada</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
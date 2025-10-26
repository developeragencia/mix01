import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bell, 
  X,
  CheckCircle,
  AlertCircle,
  Users,
  Heart,
  Flag,
  Shield
} from "lucide-react";

interface Notification {
  id: number;
  type: 'user' | 'match' | 'report' | 'verification';
  title: string;
  message: string;
  url?: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationBell() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['/api/admin/notifications'],
    queryFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch('/api/admin/notifications', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/notifications/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Erro ao marcar como lida');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch('/api/admin/notifications/mark-all-read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) throw new Error('Erro ao marcar todas como lidas');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/notifications'] });
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'match':
        return <Heart className="w-4 h-4 text-pink-400" />;
      case 'report':
        return <Flag className="w-4 h-4 text-red-400" />;
      case 'verification':
        return <Shield className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-orange-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} dias atrás`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    if (notification.url) {
      setLocation(notification.url);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-blue-800/50 border border-blue-700/50 text-blue-300 hover:bg-blue-700/50 transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white border-0 text-xs animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute right-0 top-12 w-80 md:w-96 max-h-[80vh] overflow-hidden bg-blue-900/95 backdrop-blur-xl border-blue-700/50 shadow-2xl z-50">
            {/* Header */}
            <div className="p-4 border-b border-blue-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">Notificações</h3>
                <p className="text-blue-400 text-sm">{unreadCount} não lidas</p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAllAsReadMutation.mutate()}
                    disabled={markAllAsReadMutation.isPending}
                    className="text-blue-300 hover:text-white text-xs"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Marcar todas
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-blue-700/30">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full p-4 text-left hover:bg-blue-800/30 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.isRead ? 'bg-blue-800/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`font-medium truncate ${
                              notification.isRead ? 'text-blue-300' : 'text-white'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>
                          <p className="text-blue-400 text-sm line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-blue-500 text-xs mt-2">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
                  <p className="text-blue-300 text-sm">Nenhuma notificação</p>
                  <p className="text-blue-400 text-xs mt-1">Você está em dia!</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-blue-700/50">
                <Button
                  onClick={() => {
                    setLocation('/admin/notifications');
                    setIsOpen(false);
                  }}
                  variant="ghost"
                  className="w-full text-blue-300 hover:text-white hover:bg-blue-800/50"
                  size="sm"
                >
                  Ver todas as notificações
                </Button>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}


import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowLeft, Heart, MessageCircle, Star, Zap, Crown, Check, X, Settings } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [filter, setFilter] = useState<string>("all");
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    permission,
    subscribeToPush
  } = useNotifications();

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "all") return true;
    return notification.type === filter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'like': return <Heart className="w-5 h-5 text-red-500" />;
      case 'super_like': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'boost': return <Zap className="w-5 h-5 text-purple-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "agora";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const handleEnablePushNotifications = async () => {
    if (permission !== 'granted') {
      const newPermission = await Notification.requestPermission();
      if (newPermission === 'granted') {
        const subscription = await subscribeToPush();
        if (subscription) {
          toast({
            title: "Notificações ativadas! 🔔",
            description: "Você receberá alertas de matches e mensagens",
          });
        }
      } else {
        toast({
          title: "Permissão negada",
          description: "Ative as notificações nas configurações do navegador",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/profile")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                Notificações
              </h1>
              {unreadCount > 0 && (
                <p className="text-white/60 text-sm">{unreadCount} não lidas</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Check className="w-4 h-4 mr-1" />
                Marcar todas
              </Button>
            )}
            <Button
              onClick={() => setLocation("/notification-settings")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Push Notifications Enable */}
        {permission !== 'granted' && (
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 text-white mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-500 rounded-full p-2">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Ativar notificações</h3>
                  <p className="text-white/70 text-sm">Receba alertas de matches e mensagens</p>
                </div>
              </div>
              <Button
                onClick={handleEnablePushNotifications}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Ativar Notificações
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: "all", label: "Todas", count: notifications.length },
            { key: "match", label: "Matches", count: notifications.filter(n => n.type === 'match').length },
            { key: "message", label: "Mensagens", count: notifications.filter(n => n.type === 'message').length },
            { key: "like", label: "Curtidas", count: notifications.filter(n => n.type === 'like' || n.type === 'super_like').length },
          ].map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              variant={filter === tab.key ? "default" : "ghost"}
              className={`whitespace-nowrap ${
                filter === tab.key
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge className="ml-2 bg-pink-500 text-white text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="bg-white/5 border-white/10 text-white">
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma notificação</h3>
                <p className="text-white/60 text-sm">
                  Suas notificações aparecerão aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`${
                  notification.isRead 
                    ? "bg-white/5 border-white/10" 
                    : "bg-white/10 border-white/20"
                } text-white cursor-pointer hover:bg-white/15 transition-colors`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm leading-tight">
                            {notification.title}
                          </h4>
                          <p className="text-white/70 text-sm mt-1 leading-relaxed">
                            {notification.body}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-white/50 text-xs">
                            {formatTime(notification.timestamp)}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-white/40 hover:text-white/60 hover:bg-white/10 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {notifications.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              onClick={() => setLocation("/matches")}
              className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
            >
              <Heart className="w-4 h-4 mr-2" />
              Ver Matches
            </Button>
            <Button
              onClick={() => setLocation("/messages")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Mensagens
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
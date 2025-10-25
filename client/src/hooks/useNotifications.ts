import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface NotificationData {
  id: string;
  type: 'match' | 'message' | 'like' | 'super_like' | 'boost';
  title: string;
  body: string;
  data?: any;
  timestamp: Date;
  isRead: boolean;
}

interface UseNotificationsOptions {
  enablePush?: boolean;
  enableInApp?: boolean;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { enablePush = true, enableInApp = true } = options;
  const { toast } = useToast();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Request permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
      
      if (enablePush && Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission).catch(() => {});
      }
    }
  }, [enablePush]);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const addNotification = (notification: Omit<NotificationData, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: NotificationData = {
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show in-app notification
    if (enableInApp) {
      const getIcon = (type: string) => {
        switch (type) {
          case 'match': return '💕';
          case 'message': return '💬';
          case 'like': return '❤️';
          case 'super_like': return '⭐';
          case 'boost': return '🚀';
          default: return '🔔';
        }
      };

      toast({
        title: `${getIcon(notification.type)} ${notification.title}`,
        description: notification.body,
      });
    }

    // Show push notification
    if (enablePush && permission === 'granted' && 'Notification' in window) {
      try {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.png', // App icon
          badge: '/badge.png', // Small icon for status bar
          tag: notification.type, // Group similar notifications
          requireInteraction: notification.type === 'match', // Keep match notifications visible
          data: notification.data
        });
      } catch (error) {
        // Silent error handling
      }
    }

    return newNotification.id;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Predefined notification helpers
  const notifyNewMatch = (userName: string, userPhoto?: string) => {
    return addNotification({
      type: 'match',
      title: "É um Match! 💕",
      body: `Você e ${userName} se curtiram!`,
      data: { userName, userPhoto }
    });
  };

  const notifyNewMessage = (userName: string, message: string) => {
    return addNotification({
      type: 'message',
      title: `Nova mensagem de ${userName}`,
      body: message,
      data: { userName, message }
    });
  };

  const notifyNewLike = (userName: string) => {
    return addNotification({
      type: 'like',
      title: "Nova curtida! ❤️",
      body: `${userName} curtiu seu perfil`,
      data: { userName }
    });
  };

  const notifySuperLike = (userName: string) => {
    return addNotification({
      type: 'super_like',
      title: "Super Like! ⭐",
      body: `${userName} te deu um Super Like!`,
      data: { userName }
    });
  };

  const notifyBoostComplete = (likesReceived: number, views: number) => {
    return addNotification({
      type: 'boost',
      title: "Boost finalizado! 🚀",
      body: `Seu perfil recebeu ${likesReceived} curtidas e ${views} visualizações`,
      data: { likesReceived, views }
    });
  };

  // Service Worker DISABLED to prevent cache issues
  const registerServiceWorker = async () => {
    return null;
  };

  // Push notifications DISABLED
  const subscribeToPush = async () => {
    return null;
  };

  return {
    // State
    permission,
    notifications,
    unreadCount,
    
    // Actions
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    
    // Predefined helpers
    notifyNewMatch,
    notifyNewMessage,
    notifyNewLike,
    notifySuperLike,
    notifyBoostComplete,
    
    // Service Worker
    registerServiceWorker,
    subscribeToPush
  };
};
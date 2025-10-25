import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Phone, Video, MoreHorizontal, Camera, Mic } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatUser {
  id: number;
  name: string;
  photo: string;
  isOnline: boolean;
  lastSeen?: string;
  isTyping?: boolean;
}

export default function RealTimeChat() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/chat/:matchId");
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [currentUserId] = useState(1); // Would come from auth context
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { isConnected, sendMessage, lastMessage } = useWebSocket({
    onOpen: () => {
      console.log('Chat WebSocket connected');
      // Join the chat room
      if (params?.matchId) {
        sendMessage({
          type: 'join_chat',
          userId: currentUserId,
          matchId: parseInt(params.matchId)
        });
      }
    },
    onMessage: (message) => {
      switch (message.type) {
        case 'new_message':
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            senderId: message.senderId,
            content: message.message.content,
            timestamp: message.timestamp,
            isRead: false
          }]);
          break;
        
        case 'user_typing':
          if (chatUser && message.userId !== currentUserId) {
            setChatUser(prev => prev ? { ...prev, isTyping: message.isTyping } : null);
          }
          break;
        
        case 'user_online':
          if (chatUser && message.userId === chatUser.id) {
            setChatUser(prev => prev ? { ...prev, isOnline: message.isOnline } : null);
          }
          break;
      }
    }
  });

  // Load chat data and user info
  useEffect(() => {
    if (!params?.matchId) return;

    // Simulated chat data - in production would come from API
    const mockUser: ChatUser = {
      id: 2,
      name: "Maria Silva",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b48ec4db?w=400&h=400&fit=crop",
      isOnline: true,
    };

    const mockMessages: Message[] = [
      {
        id: "1",
        senderId: 2,
        content: "Oi! Vi que você também gosta de café ☕",
        timestamp: "2025-07-19T18:30:00Z",
        isRead: true
      },
      {
        id: "2", 
        senderId: 1,
        content: "Oi Maria! Sim, sou viciado em café mesmo 😄 Qual seu tipo favorito?",
        timestamp: "2025-07-19T18:32:00Z",
        isRead: true
      },
      {
        id: "3",
        senderId: 2,
        content: "Adoro um espresso bem forte! Conhece alguma cafeteria boa por aí?",
        timestamp: "2025-07-19T18:35:00Z",
        isRead: true
      }
    ];

    setChatUser(mockUser);
    setMessages(mockMessages);
  }, [params?.matchId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected || !params?.matchId) return;

    const message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Add to local state immediately
    setMessages(prev => [...prev, message]);

    // Send via WebSocket
    sendMessage({
      type: 'send_message',
      data: {
        content: newMessage.trim(),
        matchId: parseInt(params.matchId)
      }
    });

    setNewMessage("");
    inputRef.current?.focus();
  };

  const handleTyping = () => {
    if (!isConnected) return;

    // Send typing start
    sendMessage({
      type: 'typing_start'
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      sendMessage({
        type: 'typing_stop'
      });
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!chatUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/messages")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={chatUser.photo}
                  alt={chatUser.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {chatUser.isOnline && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div>
                <h1 className="font-semibold text-white">{chatUser.name}</h1>
                <div className="flex items-center gap-1 text-xs text-white/70">
                  {!isConnected && <span>Conectando...</span>}
                  {isConnected && chatUser.isTyping && <span>digitando...</span>}
                  {isConnected && !chatUser.isTyping && (
                    <span>{chatUser.isOnline ? "online" : "offline"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.senderId === currentUserId
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === currentUserId ? 'text-white/70' : 'text-white/50'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Camera className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12"
            />
            {!isConnected && (
              <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs">
                Offline
              </Badge>
            )}
          </div>
          
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Mic className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
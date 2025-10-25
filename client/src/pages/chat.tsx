import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Heart, Phone, Video, MoreHorizontal, Image as ImageIcon, Smile, X } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@shared/schema";
import BottomNavigation from "@/components/BottomNavigation";

// Emojis mais usados
const POPULAR_EMOJIS = [
  '😊', '😂', '❤️', '🔥', '👍', '😍', '🥰', '😘', 
  '💕', '💖', '😎', '🤗', '😉', '😜', '🙌', '👏',
  '💪', '🎉', '✨', '🌟', '💯', '🙏', '👀', '😳'
];

export default function Chat() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const matchId = parseInt(params.matchId || "0");
  const [messageText, setMessageText] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Buscar dados REAIS do usuário atual
  const { data: currentUser, isError: userError, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/user', { credentials: 'include' });
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    },
    retry: 1,
  });

  // Buscar dados REAIS do match
  const { data: matchData } = useQuery({
    queryKey: [`/api/match/${matchId}`],
    queryFn: async () => {
      const res = await fetch(`/api/match/${matchId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch match');
      return res.json();
    },
    enabled: !!matchId,
  });

  const currentProfile = matchData?.profile || null;
  const currentUserId = currentUser?.id;

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: [`/api/messages/${matchId}`],
    enabled: !!matchId,
    refetchInterval: 3000,
  });

  // WebSocket para mensagens em tempo real
  useEffect(() => {
    if (!matchId || !currentUserId) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('✅ WebSocket conectado');
      websocket.send(JSON.stringify({ type: 'subscribe', matchId }));
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_message' && data.matchId === matchId) {
          queryClient.invalidateQueries({ queryKey: [`/api/messages/${matchId}`] });
          
          if (data.message.senderId !== currentUserId) {
            toast({
              title: "Nova mensagem! 💬",
              description: data.message.content.substring(0, 50) + (data.message.content.length > 50 ? '...' : ''),
              duration: 3000,
            });
            
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`${currentProfile?.name || 'Match'}`, {
                body: data.message.content,
                icon: currentProfile?.photos?.[0],
              });
            }
          }
        }
      } catch (error) {
        console.error('Erro ao processar mensagem WebSocket:', error);
      }
    };

    websocket.onerror = (error) => {
      console.error('❌ Erro no WebSocket:', error);
    };

    websocket.onclose = () => {
      console.log('🔴 WebSocket desconectado');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [matchId, currentUserId, currentProfile, queryClient, toast]);

  // Pedir permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          matchId,
          senderId: currentUserId,
          content,
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro ao enviar mensagem' }));
        throw new Error(errorData.error || 'Erro ao enviar mensagem');
      }
      
      return await response.json();
    },
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${matchId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      setMessageText("");
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'send_message',
          matchId,
          message: newMessage
        }));
      }
    },
    onError: (error: Error) => {
      console.error('❌ Erro ao enviar mensagem:', error);
      toast({
        title: "Erro ao enviar",
        description: error.message || "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(messageText.trim());
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Converter para base64 e enviar
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      
      try {
        const response = await fetch("/api/messages/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            matchId,
            senderId: currentUserId,
            imageData: base64String,
          })
        });
        
        if (!response.ok) {
          throw new Error('Erro ao enviar imagem');
        }
        
        const newMessage = await response.json();
        
        // Atualizar lista de mensagens
        queryClient.invalidateQueries({ queryKey: [`/api/messages/${matchId}`] });
        queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
        
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'send_message',
            matchId,
            message: newMessage
          }));
        }
        
        toast({
          title: "Imagem enviada! 📸",
          description: "Sua foto foi enviada com sucesso.",
          duration: 2000,
        });
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
        toast({
          title: "Erro ao enviar",
          description: "Não foi possível enviar a imagem. Tente novamente.",
          variant: "destructive",
          duration: 3000,
        });
      }
    };
    
    reader.readAsDataURL(file);

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const goBack = () => {
    setLocation("/messages");
  };

  // Verificação de autenticação
  if (userError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-white text-xl mb-4">Você precisa fazer login para acessar o chat</p>
          <button 
            onClick={() => setLocation('/login')}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !currentProfile || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando conversa...</p>
        </div>
      </div>
    );
  }

  const profilePhoto = currentProfile.photos?.[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfile.name || 'Match')}&background=ec4899&color=fff&size=400`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col pb-20">
      {/* Chat Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center px-4 py-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={goBack}
            className="mr-3 text-white hover:bg-white/20 rounded-full transition-all"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center space-x-3 flex-1 cursor-pointer" onClick={() => setLocation(`/match-profile/${currentProfile.userId}`)}>
            <div className="relative">
              <img
                src={profilePhoto}
                alt={currentProfile.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-pink-500 shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfile.name || 'Match')}&background=ec4899&color=fff&size=100`;
                }}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-blue-900 rounded-full"></div>
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">{currentProfile.name}</h2>
              <p className="text-sm text-green-400 font-medium">Online agora</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full transition-all"
              data-testid="button-phone"
            >
              <Phone className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full transition-all"
              data-testid="button-video"
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 rounded-full transition-all"
              data-testid="button-more"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                É um Match! 🎉
              </h3>
              <p className="text-white/80 text-lg mb-2">
                Vocês se curtiram mutuamente!
              </p>
              <p className="text-white/60 max-w-sm">
                Comece uma conversa e descubra o que vocês têm em comum.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isOwnMessage = message.senderId === currentUserId;
                const showAvatar = !isOwnMessage && (index === 0 || messages[index - 1].senderId !== message.senderId);
                
                return (
                  <div
                    key={message.id}
                    className={`flex items-end gap-2 ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    data-testid={`message-${message.id}`}
                  >
                    {!isOwnMessage && (
                      <div className="w-8 h-8 flex-shrink-0">
                        {showAvatar && (
                          <img
                            src={profilePhoto}
                            alt={currentProfile.name}
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                          />
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-lg ${
                        isOwnMessage
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-sm"
                          : "bg-white/15 backdrop-blur-sm text-white rounded-bl-sm border border-white/10"
                      }`}
                    >
                      {(message as any).imageUrl ? (
                        <div className="space-y-2">
                          <img 
                            src={(message as any).imageUrl} 
                            alt="Imagem enviada" 
                            className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                          />
                          {message.content !== "📷 Imagem" && (
                            <p className="text-sm leading-relaxed break-words">{message.content}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      )}
                      <p
                        className={`text-xs mt-1.5 ${
                          isOwnMessage ? "text-white/80" : "text-white/60"
                        }`}
                      >
                        {formatTimeAgo(new Date(message.createdAt))}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mx-4 mb-2 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20 relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(false)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full hover:bg-gray-200"
            >
              <X className="w-4 h-4 text-gray-600" />
            </Button>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Escolha um emoji</h3>
            <div className="grid grid-cols-8 gap-2">
              {POPULAR_EMOJIS.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-2xl hover:bg-gray-200 rounded-lg p-2 transition-colors"
                  data-testid={`emoji-${index}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-white/20 bg-white/5 backdrop-blur-xl p-4 shadow-2xl flex-shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`text-white hover:bg-white/10 rounded-full flex-shrink-0 transition-all ${showEmojiPicker ? 'bg-white/20' : ''}`}
              data-testid="button-emoji"
            >
              <Smile className="w-6 h-6" />
            </Button>
            
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-white/10 border-white/30 text-white placeholder-white/60 rounded-full px-5 py-3 focus:bg-white/15 focus:border-pink-500 transition-all"
              disabled={sendMessageMutation.isPending}
              data-testid="input-message"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="text-white hover:bg-white/10 rounded-full flex-shrink-0 transition-all"
              data-testid="button-image"
            >
              <ImageIcon className="w-6 h-6" />
            </Button>
            
            <Button
              type="submit"
              disabled={!messageText.trim() || sendMessageMutation.isPending}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full w-12 h-12 p-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              data-testid="button-send"
            >
              {sendMessageMutation.isPending ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation />
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Heart } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import type { Message } from "@shared/schema";

export default function Chat() {
  const isMobile = useMobile();
  const params = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const matchId = parseInt(params.matchId || "0");
  const [currentUserId] = useState(1); // Demo user ID
  const [messageText, setMessageText] = useState("");

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: [`/api/messages/${matchId}`],
    enabled: !!matchId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/messages", {
        matchId,
        senderId: currentUserId,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${matchId}`] });
      setMessageText("");
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

  const goBack = () => {
    setLocation("/messages");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--mix-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {!isMobile && <DesktopSidebar currentSection="messages" />}
      
      {/* Chat Header */}
      <header className={`bg-white/10 backdrop-blur-md border-b border-white/20 ${!isMobile ? 'lg:ml-80' : ''} sticky top-0 z-40`}>
        <div className="flex items-center px-4 py-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={goBack}
            className="mr-3 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center border-2 border-white/30">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-semibold text-white">Sofia</h2>
              <p className="text-sm text-white/70">Online agora</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className={`flex-1 ${!isMobile ? 'lg:ml-80' : ''} flex flex-col`}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                É um Match!
              </h3>
              <p className="text-gray-600 mb-4">
                Vocês se curtiram mutuamente. Comece uma conversa!
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  <Card
                    className={`max-w-xs lg:max-w-md px-4 py-2 ${
                      message.senderId === currentUserId
                        ? "gradient-bg text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === currentUserId
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTimeAgo(new Date(message.createdAt))}
                    </p>
                  </Card>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              type="submit"
              className="gradient-bg text-white"
              disabled={!messageText.trim() || sendMessageMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </main>

      {isMobile && <MobileNav currentSection="messages" />}
    </div>
  );
}

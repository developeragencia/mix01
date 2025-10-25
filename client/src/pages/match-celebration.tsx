import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";

export default function MatchCelebration() {
  const { matchId } = useParams();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const { data: match, isLoading } = useQuery({
    queryKey: [`/api/match/${matchId}`],
    queryFn: async () => {
      const res = await fetch(`/api/match/${matchId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch match');
      return res.json();
    },
    enabled: !!matchId,
  });

  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/user', { credentials: 'include' });
      if (!res.ok) throw new Error('Not authenticated');
      return res.json();
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest(`/api/matches/${matchId}/messages`, {
        method: 'POST',
        body: { content },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/matches/${matchId}/messages`] });
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({
        title: "Mensagem enviada!",
        description: "Comece a conversa agora",
      });
      setLocation(`/chat/${matchId}`);
    },
    onError: () => {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  const handleClose = () => {
    setLocation("/matches");
  };

  if (isLoading || !match || !currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  const otherProfile = match.profile as Profile;
  
  const currentUserPhoto = currentUser.photos?.[0] || currentUser.profileImage || `https://ui-avatars.com/api/?name=${currentUser.firstName}&background=ec4899&color=fff&size=200`;
  const otherUserPhoto = otherProfile.photos?.[0] || `https://ui-avatars.com/api/?name=${otherProfile.name}&background=ec4899&color=fff&size=200`;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* Botão Fechar */}
      <button
        onClick={handleClose}
        className="absolute top-6 left-6 z-50 w-12 h-12 bg-transparent text-white hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
        data-testid="button-close"
      >
        <X className="w-7 h-7 stroke-[3]" />
      </button>

      {/* Estrelinhas decorativas */}
      <div className="absolute top-32 right-24 text-white text-4xl animate-pulse z-10">✨</div>
      <div className="absolute top-48 right-16 text-white text-2xl animate-pulse z-10" style={{ animationDelay: '0.5s' }}>✨</div>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-20">
        {/* Container dos Corações e Fotos */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Corações grandes em camadas - 3 corações sobrepostos */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Coração mais externo */}
            <svg width="420" height="380" viewBox="0 0 420 380" className="absolute">
              <path
                d="M210 350 C 80 250, 40 150, 100 90 C 140 50, 180 60, 210 100 C 240 60, 280 50, 320 90 C 380 150, 340 250, 210 350 Z"
                fill="rgba(96, 165, 250, 0.3)"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="3"
              />
            </svg>
            
            {/* Coração do meio */}
            <svg width="360" height="320" viewBox="0 0 360 320" className="absolute">
              <path
                d="M180 300 C 70 210, 35 120, 85 70 C 120 35, 155 45, 180 80 C 205 45, 240 35, 275 70 C 325 120, 290 210, 180 300 Z"
                fill="rgba(96, 165, 250, 0.4)"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="3"
              />
            </svg>
            
            {/* Coração mais interno */}
            <svg width="300" height="260" viewBox="0 0 300 260" className="absolute">
              <path
                d="M150 250 C 60 170, 30 90, 75 50 C 105 20, 135 30, 150 60 C 165 30, 195 20, 225 50 C 270 90, 240 170, 150 250 Z"
                fill="rgba(96, 165, 250, 0.5)"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="3"
              />
            </svg>
          </div>

          {/* Fotos circulares sobrepostas */}
          <div className="relative z-30 flex items-center justify-center">
            {/* Foto esquerda (usuário atual) */}
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl -mr-8 z-10">
              <img
                src={currentUserPhoto}
                alt="Você"
                className="w-full h-full object-cover"
                data-testid="img-current-user"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://ui-avatars.com/api/?name=${currentUser.firstName}&background=ec4899&color=fff&size=200`;
                }}
              />
            </div>
            
            {/* Foto direita (match) */}
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl z-20">
              <img
                src={otherUserPhoto}
                alt={otherProfile.name}
                className="w-full h-full object-cover"
                data-testid="img-match-user"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = `https://ui-avatars.com/api/?name=${otherProfile.name}&background=ec4899&color=fff&size=200`;
                }}
              />
            </div>
          </div>
        </div>

        {/* Texto "IT'S A Match" */}
        <div className="text-center mb-3 relative z-30">
          <h1 
            className="text-white text-7xl font-black italic tracking-tight"
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)'
            }}
          >
            IT'S A
          </h1>
          <h1 
            className="text-white text-8xl font-black italic -mt-3"
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '4px 4px 8px rgba(0, 0, 0, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)',
              WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)'
            }}
          >
            Match
          </h1>
        </div>

        {/* Nome do match - "Você deu Mix com" */}
        <p className="text-white text-lg font-medium mb-8 drop-shadow-lg relative z-30">
          Você deu Mix com {otherProfile.name}
        </p>

        {/* Campo de mensagem */}
        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-sm rounded-full px-6 py-4 shadow-2xl flex items-center gap-3 relative z-30">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Diga algo legal"
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-base"
            data-testid="input-message"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="text-gray-400 hover:text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed px-2 transition-colors"
            data-testid="button-send"
          >
            Enviar
          </button>
        </div>

        {/* Emojis */}
        <div className="flex gap-4 mt-8 relative z-30">
          {['👋', '😊', '❤️', '😍'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="w-16 h-16 bg-transparent border-2 border-white/30 hover:border-white/60 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl transition-all hover:scale-110"
              data-testid={`emoji-${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

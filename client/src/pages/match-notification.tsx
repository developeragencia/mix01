import { useState } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface MatchNotificationProps {
  currentUserPhoto?: string;
  matchedUserPhoto?: string;
  matchedUserName?: string;
  matchId?: number;
  onClose: () => void;
}

export default function MatchNotification({
  currentUserPhoto = "",
  matchedUserPhoto = "",
  matchedUserName = "Usuário",
  matchId,
  onClose
}: MatchNotificationProps) {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const quickMessages = ["👋", "😊", "❤️", "😍"];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !matchId) return;
    
    setIsSending(true);
    try {
      const response = await fetch(`/api/matches/${matchId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: text }),
      });

      if (response.ok) {
        toast({
          title: "Mensagem enviada!",
          description: "Comece a conversa agora",
        });
        setMessage("");
        // Redirecionar para a conversa
        setTimeout(() => {
          setLocation(`/messages/${matchId}`);
        }, 500);
      } else {
        throw new Error("Erro ao enviar mensagem");
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickMessage = (emoji: string) => {
    handleSendMessage(emoji);
  };

  const handleKeepSwiping = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-green-400 via-green-500 to-green-600 flex flex-col items-center justify-between p-6 py-8 animate-in fade-in duration-500">
      {/* Botão Fechar */}
      <button
        onClick={handleKeepSwiping}
        className="self-start text-white hover:text-white/80 transition-colors"
        data-testid="button-close-match"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Conteúdo Central */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md">
        {/* Corações decorativos no fundo */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Coração grande externo */}
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              className="opacity-30"
            >
              <path
                d="M200,350 C200,350 50,250 50,150 C50,100 75,75 100,75 C125,75 150,90 175,120 C175,120 175,120 200,150 C225,120 225,120 225,120 C250,90 275,75 300,75 C325,75 350,100 350,150 C350,250 200,350 200,350 Z"
                fill="rgba(255,255,255,0.2)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
              />
            </svg>
            {/* Coração médio */}
            <svg
              width="320"
              height="320"
              viewBox="0 0 400 400"
              className="absolute top-10 left-10 opacity-25"
            >
              <path
                d="M200,350 C200,350 50,250 50,150 C50,100 75,75 100,75 C125,75 150,90 175,120 C175,120 175,120 200,150 C225,120 225,120 225,120 C250,90 275,75 300,75 C325,75 350,100 350,150 C350,250 200,350 200,350 Z"
                fill="rgba(255,255,255,0.15)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="3"
              />
            </svg>
            {/* Coração pequeno interno */}
            <svg
              width="240"
              height="240"
              viewBox="0 0 400 400"
              className="absolute top-20 left-20 opacity-20"
            >
              <path
                d="M200,350 C200,350 50,250 50,150 C50,100 75,75 100,75 C125,75 150,90 175,120 C175,120 175,120 200,150 C225,120 225,120 225,120 C250,90 275,75 300,75 C325,75 350,100 350,150 C350,250 200,350 200,350 Z"
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
            </svg>
            {/* Estrelinhas */}
            <div className="absolute top-16 right-20 text-white text-4xl opacity-60 animate-pulse">✨</div>
            <div className="absolute top-32 right-12 text-white text-2xl opacity-40 animate-pulse delay-150">✨</div>
          </div>
        </div>

        {/* Fotos dos usuários */}
        <div className="relative z-10 mb-8 flex items-center justify-center">
          {/* Foto usuário atual */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-200">
              {currentUserPhoto ? (
                <img
                  src={currentUserPhoto}
                  alt="Você"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-4xl font-bold">
                  V
                </div>
              )}
            </div>
          </div>

          {/* Foto usuário que deu match */}
          <div className="relative -ml-8">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gray-200">
              {matchedUserPhoto ? (
                <img
                  src={matchedUserPhoto}
                  alt={matchedUserName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-400 to-rose-500 text-white text-4xl font-bold">
                  {matchedUserName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Texto "IT'S A Match" */}
        <div className="relative z-10 text-center mb-4">
          <h1 
            className="text-7xl font-black text-white mb-2"
            style={{
              textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
              fontFamily: 'Impact, sans-serif',
              letterSpacing: '0.05em',
              WebkitTextStroke: '2px rgba(0,0,0,0.1)'
            }}
            data-testid="text-match-title"
          >
            IT'S A
          </h1>
          <h1 
            className="text-8xl font-black text-white italic"
            style={{
              textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
              fontFamily: 'Impact, sans-serif',
              letterSpacing: '0.05em',
              WebkitTextStroke: '2px rgba(0,0,0,0.1)'
            }}
            data-testid="text-match"
          >
            Match
          </h1>
          <p className="text-white text-xl font-semibold mt-4" data-testid="text-matched-with">
            Você deu Match com {matchedUserName}
          </p>
        </div>

        {/* Campo de mensagem */}
        <div className="relative z-10 w-full max-w-sm mt-8">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-full p-2 flex items-center">
            <Input
              type="text"
              placeholder="Diga algo legal"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isSending) {
                  handleSendMessage(message);
                }
              }}
              className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
              disabled={isSending}
              data-testid="input-first-message"
            />
            <button
              onClick={() => handleSendMessage(message)}
              disabled={!message.trim() || isSending}
              className="text-gray-400 hover:text-white px-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-send-message"
            >
              Enviar
            </button>
          </div>
        </div>

        {/* Emojis rápidos */}
        <div className="relative z-10 flex items-center justify-center gap-4 mt-6">
          {quickMessages.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleQuickMessage(emoji)}
              disabled={isSending}
              className="w-14 h-14 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm flex items-center justify-center text-3xl hover:bg-white/20 hover:scale-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid={`button-emoji-${index}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Botão inferior */}
      <Button
        onClick={handleKeepSwiping}
        variant="outline"
        className="w-full max-w-sm bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20 hover:text-white rounded-full h-12 font-semibold"
        data-testid="button-keep-swiping"
      >
        Continuar deslizando
      </Button>
    </div>
  );
}

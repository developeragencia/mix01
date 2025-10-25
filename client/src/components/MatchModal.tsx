import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchProfile: {
    id: number;
    name: string;
    age?: number;
    photos?: string[];
    bio?: string;
  };
  matchId?: number;
}

export function MatchModal({ isOpen, onClose, matchProfile, matchId }: MatchModalProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (matchId) {
      setLocation(`/chat/${matchId}`);
    }
    onClose();
  };

  const handleKeepSwiping = () => {
    onClose();
  };

  // Foto do usuário logado (pegar do perfil se disponível)
  const userPhoto = user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop&face';
  const matchPhoto = matchProfile.photos?.[0] || 'https://images.unsplash.com/photo-1494790108755-2616b9e85c2c?w=400&h=600&fit=crop&face';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-600/30 via-purple-600/30 to-blue-600/30 backdrop-blur-md animate-in fade-in duration-500">
      {/* Confetti/Stars Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-pink-300 animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-lg w-full mx-4 animate-in zoom-in-95 duration-600">
        {/* DEU MATCH! Header - Estilo Mix */}
        <div className="text-center mb-8 animate-in slide-in-from-top duration-700">
          <h1 
            className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 drop-shadow-2xl mb-3 animate-pulse"
            style={{
              textShadow: '0 0 40px rgba(236, 72, 153, 0.5)',
              WebkitTextStroke: '2px rgba(255, 255, 255, 0.3)',
            }}
            data-testid="text-deu-match"
          >
            DEU MATCH!
          </h1>
          <p className="text-white text-xl font-medium drop-shadow-lg">
            Você e {matchProfile.name} curtiram um ao outro
          </p>
        </div>

        {/* Fotos lado a lado - Estilo Mix */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-in slide-in-from-bottom duration-700">
          {/* Foto do Usuário */}
          <div className="relative group animate-in slide-in-from-left duration-800 delay-200">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-transform group-hover:scale-105">
              <img
                src={userPhoto}
                alt="Você"
                className="w-full h-full object-cover"
                data-testid="img-user-photo"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Você
            </div>
          </div>

          {/* Coração Central - Pulsante */}
          <div className="relative z-10 animate-in zoom-in-95 duration-1000 delay-400">
            <div className="relative">
              <Heart 
                className="w-16 h-16 md:w-20 md:h-20 text-pink-500 animate-pulse drop-shadow-2xl" 
                fill="currentColor"
                style={{
                  filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.8))',
                }}
              />
              <div className="absolute inset-0 bg-pink-500/30 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>

          {/* Foto do Match */}
          <div className="relative group animate-in slide-in-from-right duration-800 delay-200">
            <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl transform transition-transform group-hover:scale-105">
              <img
                src={matchPhoto}
                alt={matchProfile.name}
                className="w-full h-full object-cover"
                data-testid="img-match-photo"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              {matchProfile.name}
            </div>
          </div>
        </div>

        {/* Botões de Ação - Estilo Mix */}
        <div className="space-y-3 px-4 animate-in slide-in-from-bottom duration-800 delay-600">
          <Button
            onClick={handleSendMessage}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-6 rounded-full text-lg shadow-2xl transform transition-all hover:scale-105 hover:shadow-pink-500/50"
            data-testid="button-send-message"
          >
            <MessageCircle className="w-6 h-6 mr-2" />
            Enviar Mensagem
          </Button>
          
          <Button
            onClick={handleKeepSwiping}
            variant="ghost"
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-4 rounded-full border-2 border-white/30 transition-all hover:scale-105"
            data-testid="button-keep-swiping"
          >
            Continuar Explorando
          </Button>
        </div>
      </div>
    </div>
  );
}

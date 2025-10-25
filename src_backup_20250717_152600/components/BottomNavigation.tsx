import { MapPin, Heart, MessageCircle, User } from "lucide-react";
import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-blue-900/60 backdrop-blur-md border-t border-blue-300/30 z-50">
      <div className="flex justify-around py-2">
        <button 
          className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
          onClick={() => setLocation('/location')}
        >
          <MapPin className="w-6 h-6" />
          <span className="text-[10px] font-medium">Descobrir</span>
        </button>
        <button 
          className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
          onClick={() => setLocation('/discover')}
        >
          <Heart className="w-6 h-6" />
          <span className="text-[10px] font-medium">Matches</span>
        </button>
        <button 
          className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
          onClick={() => setLocation('/messages')}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">Mensagens</span>
        </button>
        <button 
          className="flex flex-col items-center space-y-1 text-white p-2 hover:text-pink-500 transition-colors duration-200"
          onClick={() => setLocation('/profile')}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </div>
    </nav>
  );
}
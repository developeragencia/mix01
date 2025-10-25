import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Heart, Star, Flame, Users, MessageCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Likes() {
  const [, setLocation] = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const likesData = [
    {
      id: 1,
      name: "Maria Silva",
      age: 25,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b412?w=300&h=300&fit=crop&crop=center",
      location: "São Paulo - SP",
      time: "há 2 horas"
    },
    {
      id: 2,
      name: "Ana Costa",
      age: 28,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=center",
      location: "Rio de Janeiro - RJ",
      time: "há 5 horas"
    },
    {
      id: 3,
      name: "Julia Santos",
      age: 24,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=center",
      location: "Belo Horizonte - MG",
      time: "há 1 dia"
    },
    {
      id: 4,
      name: "Carla Mendes",
      age: 30,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=center",
      location: "Porto Alegre - RS",
      time: "há 2 dias"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-blue-900/60 backdrop-blur-md border-b border-blue-300/30 px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/10 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-lg font-bold flex-1">Seus Likes</h1>
          <div className="text-white/80 text-sm">
            {likesData.length} likes
          </div>
        </div>
      </div>

      <main className="px-4 py-6 pb-20">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <h3 className="text-white font-bold text-lg">{likesData.length}</h3>
            <p className="text-white/70 text-sm">Likes Recebidos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-white font-bold text-lg">12</h3>
            <p className="text-white/70 text-sm">Super Likes</p>
          </div>
        </div>

        {/* Lista de Likes */}
        <div className="space-y-4">
          <h2 className="text-white text-lg font-bold mb-4">Quem curtiu você</h2>
          {likesData.map((person) => (
            <div key={person.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 flex-shrink-0">
                  <img 
                    src={person.image}
                    alt={person.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base">{person.name}, {person.age}</h3>
                  <p className="text-white/80 text-sm">📍 {person.location}</p>
                  <p className="text-white/60 text-xs">{person.time}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-4 py-2">
                    <Heart className="w-4 h-4 mr-1" />
                    Curtir
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2">
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upgrade CTA */}
        <div className="mt-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl p-4 border border-pink-500/30">
          <div className="text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="text-white font-bold text-lg mb-2">Quer ver mais likes?</h3>
            <p className="text-white/90 text-sm mb-4">
              Upgrade para Premium e veja quem mais curtiu você
            </p>
            <Button 
              onClick={() => setLocation('/plans')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full"
            >
              VER PLANOS PREMIUM
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-blue-900/60 backdrop-blur-md border-t border-blue-300/30">
        <div className="flex justify-around py-2">
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/discover')}
          >
            <Flame className="w-6 h-6" />
            <span className="text-[10px] font-medium">Descobrir</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/matches')}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">Partidas</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/messages')}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px] font-medium">Mensagens</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/profile')}
          >
            <UserCircle className="w-6 h-6" />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
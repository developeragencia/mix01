import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Eye, TrendingUp, Flame, Users, MessageCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Views() {
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

  const viewsData = [
    {
      id: 1,
      name: "Pedro Oliveira",
      age: 29,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=center",
      location: "São Paulo - SP",
      time: "há 1 hora",
      views: 3
    },
    {
      id: 2,
      name: "Lucas Ferreira",
      age: 26,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center",
      location: "Rio de Janeiro - RJ",
      time: "há 3 horas",
      views: 2
    },
    {
      id: 3,
      name: "Rafael Santos",
      age: 31,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=center",
      location: "Brasília - DF",
      time: "há 8 horas",
      views: 1
    },
    {
      id: 4,
      name: "Bruno Costa",
      age: 27,
      image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=center",
      location: "Salvador - BA",
      time: "há 1 dia",
      views: 5
    }
  ];

  const totalViews = viewsData.reduce((sum, person) => sum + person.views, 0);

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
          <h1 className="text-white text-lg font-bold flex-1">Visualizações</h1>
          <div className="text-white/80 text-sm">
            {totalViews} visualizações
          </div>
        </div>
      </div>

      <main className="px-4 py-6 pb-20">
        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h3 className="text-white font-bold text-lg">{totalViews}</h3>
            <p className="text-white/70 text-sm">Total de Visualizações</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-white font-bold text-lg">+23%</h3>
            <p className="text-white/70 text-sm">Esta Semana</p>
          </div>
        </div>

        {/* Gráfico de Visualizações por Dia */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
          <h3 className="text-white font-bold text-base mb-4">Visualizações nos Últimos 7 Dias</h3>
          <div className="flex items-end justify-between h-24 space-x-2">
            {[12, 8, 15, 20, 18, 25, 30].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t w-full"
                  style={{ height: `${(height / 30) * 100}%` }}
                ></div>
                <span className="text-white/60 text-xs mt-1">
                  {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Quem Visualizou */}
        <div className="space-y-4">
          <h2 className="text-white text-lg font-bold mb-4">Quem visualizou seu perfil</h2>
          {viewsData.map((person) => (
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
                <div className="text-center">
                  <div className="bg-blue-600 rounded-full px-2 py-1 mb-2">
                    <span className="text-white text-xs font-bold">{person.views}x</span>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2">
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 border border-blue-500/30">
          <div className="text-center">
            <Eye className="w-8 h-8 text-white mx-auto mb-2" />
            <h3 className="text-white font-bold text-lg mb-2">Veja mais detalhes</h3>
            <p className="text-white/90 text-sm mb-4">
              Upgrade para Premium e veja quando e quantas vezes visualizaram seu perfil
            </p>
            <Button 
              onClick={() => setLocation('/plans')}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold w-full"
            >
              UPGRADE PARA PREMIUM
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
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Crown, Heart, Lock, Clock } from "lucide-react";
import { formatTimeAgo } from "@/lib/utils";
import type { Match, Profile } from "@shared/schema";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591379272.png";

export default function Matches() {
  const isMobile = useMobile();
  const [, setLocation] = useLocation();
  const [currentUserId] = useState(1);
  const [countdown, setCountdown] = useState({ minutes: 15, seconds: 34 });

  // Timer para o countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 15, seconds: 34 }; // Reset
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const { data: matches = [], isLoading } = useQuery<(Match & { profile: Profile })[]>({
    queryKey: [`/api/matches/${currentUserId}`],
  });

  const openChat = (matchId: number) => {
    setLocation(`/chat/${matchId}`);
  };

  // Dados dos perfis em destaque - Alex e Diego como na imagem
  const featuredProfiles = [
    {
      id: 1,
      name: "Alex",
      age: 29,
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
      isOnline: true,
      badge: "AD"
    },
    {
      id: 2,
      name: "Diego",
      age: 27,
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      isOnline: true,
      badge: "D"
    }
  ];

  // Grid de outros perfis (blur/desfocados) - 6 perfis como na imagem
  const gridProfiles = [
    { id: 3, photo: "https://randomuser.me/api/portraits/men/12.jpg" },
    { id: 4, photo: "https://randomuser.me/api/portraits/men/23.jpg" },
    { id: 5, photo: "https://randomuser.me/api/portraits/men/34.jpg" },
    { id: 6, photo: "https://randomuser.me/api/portraits/men/56.jpg" },
    { id: 7, photo: "https://randomuser.me/api/portraits/men/67.jpg" },
    { id: 8, photo: "https://randomuser.me/api/portraits/men/78.jpg" }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E3A8A]">
        <div className="text-center text-white">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {!isMobile && <DesktopSidebar currentSection="matches" />}
      
      <main className={`${!isMobile ? 'lg:ml-80' : ''} min-h-screen`}>
        <div className="px-4 py-4">
          {/* Header com logo e cadeado amarelo */}
          <div className="flex items-center justify-between mb-4">
            <img src={mixLogoHorizontal} alt="Mix Logo" className="h-6 object-contain" />
            <div className="bg-transparent p-2">
              {/* Cadeado formato coração SVG */}
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Forma do coração */}
                <path 
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  fill="#FBBF24"
                />
                {/* Cadeado no centro */}
                <rect x="10" y="10" width="4" height="5" rx="0.5" fill="#1F2937" />
                <rect x="10.5" y="8.5" width="3" height="2" rx="1.5" fill="none" stroke="#1F2937" strokeWidth="1" />
                <circle cx="12" cy="12" r="0.5" fill="#FBBF24" />
              </svg>
            </div>
          </div>

          {/* Primeira caixa - SEU MIX DO MOMENTO (só os dois perfis) */}
          <div className="bg-[#1E40AF] rounded-2xl p-4 text-white mb-4">
            {/* Header com coroa */}
            <div className="flex items-center justify-center mb-4">
              <Crown className="w-5 h-5 text-yellow-400 mr-2" />
              <h2 className="text-lg font-bold">SEU MIX DO MOMENTO</h2>
            </div>

            {/* Quadro com gradiente azul */}
            <div className="bg-gradient-to-br from-blue-800/30 via-blue-700/30 to-blue-900/30 rounded-xl p-4 mb-4 backdrop-blur-sm border border-blue-400/30">
              <div className="flex items-center justify-center space-x-4">
                {/* Primeiro perfil - Alex */}
                <div className="relative">
                  <div className="w-44 h-56 rounded-xl overflow-hidden shadow-lg relative">
                    <img 
                      src={featuredProfiles[0].photo} 
                      alt={featuredProfiles[0].name}
                      className="w-full h-full object-cover"
                    />
                    {/* Status online */}
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                    
                    {/* Informações sobrepostas */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-bold mb-1">Alex, 26</p>
                      <p className="text-white text-xs">A mais de 5 minutos e procura mais que...</p>
                    </div>
                  </div>
                </div>

                {/* Segundo perfil - Diego */}
                <div className="relative">
                  <div className="w-44 h-56 rounded-xl overflow-hidden shadow-lg relative">
                    <img 
                      src={featuredProfiles[1].photo} 
                      alt={featuredProfiles[1].name}
                      className="w-full h-full object-cover"
                    />
                    {/* Status online */}
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                    
                    {/* Informações sobrepostas */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-sm font-bold mb-1">DIEGO, 25</p>
                      <p className="text-white text-xs">Quer construir uma família e busca...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Segunda caixa - Grid de perfis bloqueados e botão desbloquear */}
          <div className="bg-[#1E40AF] rounded-2xl p-4 text-white mt-6">
            {/* Timer de liberação - no topo */}
            <div className="text-center mb-6">
              <div className="text-white/80 text-sm">
                <p>Libera mais em: <span className="text-yellow-400 font-semibold">14 min e 41 seg...</span></p>
              </div>
            </div>

            {/* Grid de perfis desfocados - 2 linhas x 3 colunas */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {gridProfiles.map((profile) => (
                <div key={profile.id} className="relative">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img 
                      src={profile.photo} 
                      alt="Profile"
                      className="w-full h-full object-cover blur-md opacity-50"
                    />
                    {/* Overlay de bloqueio */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botão Desbloquear mais pessoas - amarelo */}
            <div className="text-center">
              <Button 
                className="bg-yellow-400 text-black hover:bg-yellow-500 px-6 py-2 rounded-full font-semibold text-sm"
                onClick={() => setLocation('/premium')}
              >
                Desbloquear mais pessoas
              </Button>
            </div>
          </div>


        </div>
      </main>

      {isMobile && <MobileNav currentSection="matches" />}
    </div>
  );
}

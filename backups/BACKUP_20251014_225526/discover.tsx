import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { NeonHeart } from "@/components/NeonHeart";
import { NeonX } from "@/components/NeonX";
import BottomNavigation from "@/components/BottomNavigation";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";
import mixFavicon from "@assets/FAVICON_1752848384518.png";

import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: number;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location: string;
  distance: number;
  verified: boolean;
  isOnline: boolean;
}

export default function Discover() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionCounts, setActionCounts] = useState(() => {
    const saved = localStorage.getItem('mixActionCounts');
    return saved ? JSON.parse(saved) : {
      likes: 0,
      passes: 0,
    };
  });
  const [swipeCount, setSwipeCount] = useState(() => {
    const saved = localStorage.getItem('mixSwipeCount');
    return saved ? parseInt(saved) : 0;
  });
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showFullBio, setShowFullBio] = useState(false);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["/api/discover"],
    retry: false,
    refetchOnWindowFocus: false,
  }) as { data: Profile[], isLoading: boolean };

  // Função para resetar contadores (debug)
  const resetCounters = () => {
    setActionCounts({ likes: 0, passes: 0 });
    setSwipeCount(0);
    localStorage.removeItem('mixActionCounts');
    localStorage.removeItem('mixSwipeCount');
    toast({
      title: "Contadores resetados",
      description: "Todos os contadores foram limpos",
      duration: 2000,
    });
  };

  const handleSwipe = async (direction: "left" | "right") => {
    const swipeType = direction === "right" ? "like" : "dislike";
    
    // Salvar nome do perfil atual ANTES de qualquer mudança
    const profileName = currentProfile.name;
    
    // Para likes (direita), verificar limite de 10 matches gratuitos
    if (direction === "right") {
      if (actionCounts.likes >= 10) {
        toast({
          title: "🚫 Limite de matches atingido",
          description: "Você atingiu o limite de 10 matches gratuitos! Aguarde ou assine Premium.",
          duration: 4000,
        });
        setLocation("/swipe-limit");
        return;
      }
      
      // Atualizar contador de likes
      setActionCounts((prev: any) => {
        const newCounts = { ...prev, likes: prev.likes + 1 };
        localStorage.setItem('mixActionCounts', JSON.stringify(newCounts));
        return newCounts;
      });
      
      // Verificar se atingiu o limite após este like
      if (actionCounts.likes + 1 >= 10) {
        // Este é o 10º like, após processar, mostrar limite
        setTimeout(() => {
          setLocation("/swipe-limit");
        }, 2000); // Dar tempo para mostrar o toast
      }
    } else {
      // Para passes (esquerda), apenas atualizar contador
      setActionCounts((prev: any) => {
        const newCounts = { ...prev, passes: prev.passes + 1 };
        localStorage.setItem('mixActionCounts', JSON.stringify(newCounts));
        return newCounts;
      });
    }
    
    // Show toast feedback ANTES de mover para próximo perfil
    if (direction === "right") {
      toast({
        title: "❤️ Match enviado!",
        description: `Você curtiu ${profileName}`,
        duration: 2000,
      });
    } else {
      toast({
        title: "✋ Passou",
        description: `Você passou ${profileName}`,
        duration: 2000,
      });
    }
    
    try {
      // Register the swipe in the backend
      const response = await fetch("/api/swipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          swipedId: currentProfile.id,
          type: swipeType
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`${swipeType} registered for ${profileName}`, result);
      } else {
        const error = await response.json();
        console.log(`${swipeType} registered for ${profileName}`, { error: error.error || "Network error" });
      }
      
    } catch (error) {
      console.error("Error registering swipe:", error);
      
      // Check if it's a limit error
      if (error instanceof Error && error.message.includes("limite")) {
        setLocation("/seu-mix");
        return;
      }
    }
    
    // Move to next profile
    setCurrentIndex((prev: any) => prev + 1);
    
    // Atualizar contador total de swipes
    setSwipeCount((prev: any) => {
      const newCount = prev + 1;
      localStorage.setItem('mixSwipeCount', newCount.toString());
      return newCount;
    });
    
    // Reset bio state when moving to next profile
    setShowFullBio(false);
  };

  const currentProfile = profiles[currentIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-200 mx-auto mb-4"></div>
          <p className="text-blue-100">Carregando perfis...</p>
        </div>
      </div>
    );
  }

  // Se não há perfis ou acabaram os perfis
  if (!currentProfile || profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 z-20 flex-shrink-0">
          <img 
            src={mixLogo} 
            alt="MIX Logo" 
            className="h-8 object-contain"
          />
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-2">Você viu todos os perfis!</h2>
            <p className="text-blue-200 mb-6">Volte mais tarde para ver novos matches ou expanda sua área de busca.</p>
            <Button
              onClick={() => {
                setCurrentIndex(0);
                window.location.reload();
              }}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full"
              data-testid="button-reload-profiles"
            >
              Recarregar perfis
            </Button>
          </div>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Profile Image as Full Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentProfile.photos?.[0] || "https://images.unsplash.com/photo-1494790108755-2616b9e85c2c?w=400&h=600&fit=crop&face"}
          alt={currentProfile.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            const fallbackImages = [
              "https://images.unsplash.com/photo-1494790108755-2616b9e85c2c?w=400&h=600&fit=crop&face",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&face",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&face",
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&face"
            ];
            const randomIndex = Math.floor(Math.random() * fallbackImages.length);
            img.src = fallbackImages[randomIndex];
          }}
        />
        {/* Dark overlay for content readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"></div>
      </div>

      {/* Header com Logo MIX e Contador de Matches */}
      <div className="flex items-center justify-between px-4 py-4 z-20 flex-shrink-0 relative">
        <img 
          src={mixLogo} 
          alt="MIX Logo" 
          className="h-8 object-contain"
        />
        
        <div className="flex items-center gap-3">
          {/* Contador de matches restantes */}
          <div className="bg-black/30 backdrop-blur-md rounded-full px-3 py-1 border border-pink-400/30">
            <span className="text-xs font-bold text-pink-300">
              {Math.max(0, 10 - actionCounts.likes)} matches restantes
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/messages")}
            className="text-white hover:bg-white/10 p-2 bg-transparent rounded-full border border-transparent shadow-lg backdrop-blur-sm"
            data-testid="button-messages"
          >
            <NeonHeart className="w-7 h-7" />
          </Button>
        </div>
      </div>

      {/* Neon Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Animated Neon Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"></div>
        
        {/* Neon Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-pink-500/10 to-transparent animate-pulse"></div>
        </div>
      </div>



      {/* Main Profile Section */}
      <div className="flex-1 flex flex-col relative z-10 pb-20">
        {/* Content Area - taking up the remaining space */}
        <div className="flex-1 relative min-h-0">
          {/* Bar Imaginário Button - positioned over the image bottom aligned with city */}
          <div className="absolute bottom-4 right-4 z-10">
            <Button
              onClick={() => setLocation("/location")}
              className="px-4 py-2 bg-transparent hover:bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 rounded-full shadow-lg transition-all duration-200 hover:scale-105 text-white font-bold text-xs"
              data-testid="button-location"
            >
              🍺 Bar Imaginário
            </Button>
          </div>

          {/* Name, Age, Location and Online Status - positioned over the background image */}
          <div className="absolute bottom-4 left-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-bold tracking-wide drop-shadow-lg" data-testid="text-profile-name">
                {currentProfile.name}
              </h2>
              {/* Online Status Indicator */}
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${(currentProfile as any).isOnline ? 'bg-green-500' : 'bg-gray-500'} border-2 border-white shadow-lg ${(currentProfile as any).isOnline ? 'animate-pulse' : ''}`} data-testid="status-online"></div>
              </div>
            </div>
            <p className="text-lg font-normal drop-shadow-md text-slate-200 mb-1" data-testid="text-profile-age">
              {currentProfile.age} anos
            </p>
            <p className="text-base font-normal drop-shadow-md text-slate-300" data-testid="text-profile-location">
              {currentProfile.location || 'Brasil'}
            </p>
          </div>
        </div>

        {/* About Section - Fixed at bottom with reduced height */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 px-4 py-3 relative">
          <div className="flex justify-between items-start relative z-10">
            <div className="flex-1 pr-4">
              <h3 className="text-blue-400 text-base font-semibold mb-2">
                Sobre mim:
              </h3>
              <div className="text-white text-sm leading-relaxed font-normal">
                {currentProfile.bio && currentProfile.bio.length > 80 ? (
                  <div>
                    <p className={`${showFullBio ? '' : 'line-clamp-3'}`}>
                      {currentProfile.bio}
                    </p>
                    <button 
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="text-blue-400 text-xs mt-1 underline hover:text-blue-300 transition-colors"
                      data-testid="button-toggle-bio"
                    >
                      {showFullBio ? 'Ver menos' : 'Ver mais'}
                    </button>
                  </div>
                ) : (
                  <p>{currentProfile.bio}</p>
                )}
              </div>
            </div>
            
            {/* Action Buttons with Enhanced Neon Effects */}
            <div className="flex flex-col space-y-4 ml-4">
              <Button
                onClick={() => handleSwipe("right")}
                className="w-24 h-24 rounded-full bg-black/20 hover:bg-black/40 border-2 border-pink-500/50 hover:border-pink-400 flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-md p-0 shadow-[0_0_20px_rgba(255,20,147,0.5)] hover:shadow-[0_0_30px_rgba(255,20,147,0.8)]"
                data-testid="button-like"
              >
                <NeonHeart 
                  style={{width: '48px', height: '48px'}} 
                  className="drop-shadow-[0_0_20px_rgba(255,20,147,1)]" 
                />
              </Button>
              
              <Button
                onClick={() => handleSwipe("left")}
                className="w-24 h-24 rounded-full bg-black/20 hover:bg-black/40 border-2 border-red-500/50 hover:border-red-400 flex items-center justify-center transition-all duration-300 transform hover:scale-110 backdrop-blur-md p-0 shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)]"
                data-testid="button-dislike"
              >
                <NeonX 
                  style={{width: '48px', height: '48px'}} 
                  className="drop-shadow-[0_0_20px_rgba(239,68,68,1)]" 
                />
              </Button>
            </div>
          </div>
          
          {/* Animated Neon Lines */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
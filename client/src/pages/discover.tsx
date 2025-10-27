import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Heart, X, Zap, Settings } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import mixLogoIcon from "@assets/Logo_MIX_horizontal_1752607947932.png";

interface Profile {
  id: number;
  userId: number;
  name: string;
  age: number;
  bio?: string;
  photos: string[];
  location?: string;
  distance?: number;
  verified?: boolean;
  isVerified?: boolean;
  isOnline?: boolean;
  interests?: string[];
  job?: string;
  company?: string;
}

export default function Discover() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [actionCounts, setActionCounts] = useState(() => {
    const saved = localStorage.getItem('mixActionCounts');
    return saved ? JSON.parse(saved) : { likes: 0, passes: 0 };
  });

  const { data: allProfiles = [], isLoading, isFetching } = useQuery({
    queryKey: ["/api/discover"],
    retry: 1, // ⚡ Retry apenas 1 vez
    retryDelay: 1000, // ⚡ Delay de 1s entre retries
    refetchOnWindowFocus: false,
    refetchOnMount: false, // ⚡ Não refetch no mount
    staleTime: 10 * 60 * 1000, // ⚡ 10 minutos - perfis não mudam tão rápido
    gcTime: 30 * 60 * 1000, // ⚡ 30 minutos em cache
    queryFn: async () => {
      console.time('⏱️ Fetch /api/discover');
      const response = await fetch("/api/discover", {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      console.timeEnd('⏱️ Fetch /api/discover');
      if (!response.ok) throw new Error('Failed to fetch profiles');
      const data = await response.json();
      console.log(`✅ Discover recebeu ${data.length} perfis`);
      return data;
    }
  }) as { data: Profile[], isLoading: boolean, isFetching: boolean };

  const profiles = allProfiles.filter(profile => profile.userId !== user?.id);
  const currentProfile = profiles[currentIndex];

  // ⚡ CORREÇÃO: Só redirecionar se NÃO está loading E NÃO está autenticado
  // Isso evita redirecionamentos durante o carregamento inicial ao atualizar a página
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("⚠️ Discover: Usuário não autenticado - redirecionando para /login");
      setLocation("/login");
    } else if (!authLoading && isAuthenticated) {
      console.log("✅ Discover: Usuário autenticado - permanecendo na página");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  const handleSwipe = async (direction: "left" | "right") => {
    console.log('🔴 handleSwipe chamada!', { direction, currentProfile });
    if (!currentProfile) {
      console.log('🔴 SEM PROFILE - ABORTANDO');
      return;
    }
    
    const swipeType = direction === "right" ? "like" : "dislike";
    const profileName = currentProfile.name;
    console.log('🔴 Swipe data:', { swipeType, profileName, profileId: currentProfile.id });
    
    if (direction === "right") {
      if (actionCounts.likes >= 15) {
        toast({
          title: "🚫 Limite de matches atingido",
          description: "Você atingiu o limite de 15 matches gratuitos!",
          duration: 4000,
        });
        setLocation("/swipe-limit");
        return;
      }
      
      setActionCounts((prev: any) => {
        const newCounts = { ...prev, likes: prev.likes + 1 };
        localStorage.setItem('mixActionCounts', JSON.stringify(newCounts));
        return newCounts;
      });
    } else {
      setActionCounts((prev: any) => {
        const newCounts = { ...prev, passes: prev.passes + 1 };
        localStorage.setItem('mixActionCounts', JSON.stringify(newCounts));
        return newCounts;
      });
    }

    try {
      console.log('🔴 FAZENDO REQUISIÇÃO para /api/swipes');
      console.log('🔴 Profile dados:', { profileId: currentProfile.id, userId: currentProfile.userId });
      const response = await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          swipedId: currentProfile.userId, // ✅ CORRIGIDO: usar userId ao invés de profileId
          type: swipeType
        })
      });
      
      console.log('🔴 RESPOSTA recebida:', response);
      const res = await response.json();
      console.log('🔴 DADOS da resposta:', res);
      console.log('🔴 Verificando match:', {
        hasMatch: !!res.match,
        hasMatchId: !!res.matchId,
        matchId: res.matchId,
        matchProfile: res.matchProfile
      });

      if (res.match && res.matchId) {
        console.log('🎉🎉🎉 É MATCH! Redirecionando para match-celebration...');
        console.log('🎉 Match ID:', res.matchId);
        console.log('🎉 Match Profile:', res.matchProfile);
        window.location.href = `/match-celebration/${res.matchId}`;
        return;
      } else if (swipeType === "like") {
        console.log('🔴 Like registrado, mas sem match ainda');
        toast({
          title: `❤️ Você curtiu ${profileName}!`,
          description: "Vamos torcer para que seja recíproco!",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('🔴 ERRO ao registrar swipe:', error);
    }

    setCurrentIndex(prev => prev + 1);
    setCurrentPhotoIndex(0);
  };

  const handlePhotoNavigation = (direction: 'prev' | 'next') => {
    const photos = currentProfile?.photos || [];
    if (photos.length <= 1) return;

    setCurrentPhotoIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % photos.length;
      } else {
        return (prev - 1 + photos.length) % photos.length;
      }
    });
  };

  if (isLoading) {
    return (
      <LoadingSpinner message="Procurando pessoas incríveis para você..." />
    );
  }

  if (!currentProfile || currentIndex >= profiles.length) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-8">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">Nenhum perfil disponível</h2>
            <p className="text-blue-200 mb-6">Não há pessoas por perto no momento.</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-black">
      {/* FOTO GRANDE - Ocupa toda a tela */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentProfile.photos?.[currentPhotoIndex] || currentProfile.photos?.[0] || `https://ui-avatars.com/api/?name=${currentProfile.name}&background=ec4899&color=fff&size=800`}
          alt={currentProfile.name}
          className="w-full h-full object-cover object-center"
          data-testid="img-profile-photo"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://ui-avatars.com/api/?name=${currentProfile.name}&background=ec4899&color=fff&size=800`;
          }}
        />
        {/* Gradiente escuro na parte inferior para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
      </div>

      {/* Áreas clicáveis para navegação de fotos */}
      {Array.isArray(currentProfile.photos) && currentProfile.photos.length > 1 && (
        <>
          <div 
            className="fixed left-0 top-0 bottom-0 w-1/2 cursor-pointer z-[100]"
            onClick={(e) => {
              e.stopPropagation();
              handlePhotoNavigation('prev');
            }}
            data-testid="area-prev-photo"
          />
          <div 
            className="fixed right-0 top-0 bottom-0 w-1/2 cursor-pointer z-[100]"
            onClick={(e) => {
              e.stopPropagation();
              handlePhotoNavigation('next');
            }}
            data-testid="area-next-photo"
          />
        </>
      )}

      {/* Barra de progresso de fotos */}
      {Array.isArray(currentProfile.photos) && currentProfile.photos.length > 1 && (
        <div className="absolute top-4 left-4 right-4 z-[120] flex gap-2">
          {currentProfile.photos.map((_, index) => (
            <div 
              key={index} 
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              data-testid={`photo-indicator-${index}`}
            >
              <div 
                className={`h-full bg-white transition-all duration-300 ${
                  index === currentPhotoIndex ? 'w-full' : index < currentPhotoIndex ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Header - Ícones abaixo da barra de progresso */}
      <div className="absolute top-8 left-4 right-4 z-[110] flex items-center justify-between">
        <button
          onClick={() => setLocation("/profile")}
          className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
          data-testid="button-profile-top"
        >
          <Zap className="w-5 h-5" />
        </button>

        {/* Botão Coração - "Deu MIX" */}
        <button
          onClick={() => setLocation("/matches")}
          className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
          data-testid="button-matches-top"
        >
          <Heart className="w-5 h-5" fill="currentColor" />
        </button>
        
        <button
          onClick={() => setLocation("/settings")}
          className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
          data-testid="button-settings-top"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* INFORMAÇÕES DO PERFIL - Parte inferior SEM fundo */}
      <div className="absolute bottom-32 left-6 right-24 z-20">
        {/* NOME - BRANCO E GRANDE */}
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-white text-4xl font-bold" data-testid="text-profile-name">
            {currentProfile.name}
          </h1>
          {currentProfile.verified && (
            <span className="text-blue-400">✓</span>
          )}
        </div>
        
        {/* IDADE */}
        <p className="text-white text-lg mb-2" data-testid="text-profile-info">
          {currentProfile.age} anos
        </p>
        
        {/* LOCALIZAÇÃO */}
        {currentProfile.location && (
          <p className="text-white/90 text-sm mb-3" data-testid="text-profile-location">
            📍 {currentProfile.location}
          </p>
        )}

        {/* BOTÃO BAR IMAGINÁRIO - ACIMA DA BIO */}
        <button
          onClick={() => setLocation("/location")}
          className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-md flex items-center justify-center gap-2 hover:bg-white/20 transition-all mb-3"
          data-testid="button-bar-imaginario"
        >
          <span className="text-white font-semibold text-sm">🍹 Bar Imaginário</span>
        </button>

        {/* BIO/SOBRE MIM */}
        {currentProfile.bio && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-md">
            <p className="text-white text-sm leading-relaxed" data-testid="text-profile-bio">
              {currentProfile.bio}
            </p>
          </div>
        )}
      </div>

      {/* BOTÕES - CORAÇÃO E X COM EFEITO NEON - À DIREITA */}
      <div className="absolute bottom-32 right-6 z-[150] flex flex-col gap-5">
        {/* BOTÃO CORAÇÃO - FUNDO BRANCO COM CORAÇÃO ROSA E EFEITO NEON ROSA */}
        <button
          onClick={() => handleSwipe("right")}
          className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-slow"
          style={{
            boxShadow: '0 0 25px rgba(236, 72, 153, 0.8), 0 0 50px rgba(236, 72, 153, 0.5), 0 0 75px rgba(236, 72, 153, 0.3)'
          }}
          data-testid="button-like"
        >
          <Heart className="w-11 h-11 text-pink-500 drop-shadow-lg" fill="rgb(236, 72, 153)" />
        </button>

        {/* BOTÃO X - FUNDO BRANCO COM X VERMELHO E EFEITO NEON VERMELHO */}
        <button
          onClick={() => handleSwipe("left")}
          className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.8), 0 0 50px rgba(239, 68, 68, 0.5), 0 0 75px rgba(239, 68, 68, 0.3)'
          }}
          data-testid="button-dislike"
        >
          <X className="w-11 h-11 text-red-500 drop-shadow-lg" strokeWidth={4} />
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

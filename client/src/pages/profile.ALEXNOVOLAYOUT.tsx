import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Settings, ChevronRight, Star, Zap, Crown, Check, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";
import useEmblaCarousel from 'embla-carousel-react';

interface Profile {
  id: number;
  userId: number;
  name: string;
  age: number;
  location?: string;
  bio?: string;
  profession?: string;
  interests?: string[];
  photos?: string[];
  isVerified?: boolean;
  job?: string;
  company?: string;
  school?: string;
  height?: number;
  relationshipGoals?: string;
  languages?: string[];
  starSign?: string;
  educationLevel?: string;
  familyPlans?: string;
  personalityType?: string;
  communicationStyle?: string;
  loveStyle?: string;
  instagram?: string;
  spotify?: string;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const { data: profile, isLoading: profileLoading, error } = useQuery<Profile>({
    queryKey: ['/api/profiles', user?.id],
    enabled: !!user?.id,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`/api/profiles/${user?.id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        if (res.status === 404) {
          // Don't auto-redirect - let onboarding flow handle new users
          throw new Error('Profile not found');
        }
        throw new Error('Profile not found');
      }
      return res.json();
    }
  });

  // Fetch Super Likes count
  const { data: superLikes } = useQuery<{ count: number; dailyLimit: number; remaining: number }>({
    queryKey: ['/api/super-likes'],
    enabled: !!user?.id,
    retry: false,
  });

  // Fetch Boost stats  
  const { data: boostStats } = useQuery<{ views: number; likes: number; matches: number; available?: number }>({
    queryKey: ['/api/boost'],
    enabled: !!user?.id,
    retry: false,
  });

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        toast({ title: "Desconectado!", description: "Até logo!" });
        window.location.href = '/';
      }
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível sair", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/login');
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecionando...</div>
      </div>
    );
  }

  // Combine photos from profile and user (user photos from onboarding)
  const userData = user as any;
  
  console.log("🔵 DEBUG PROFILE - Carregando fotos:");
  console.log("🔵 profile.photos:", profile.photos?.length || 0, "fotos");
  console.log("🔵 user.photos:", userData?.photos?.length || 0, "fotos");
  console.log("🔵 user.profileImage:", userData?.profileImage ? "Definida" : "Não definida");
  
  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : (userData?.photos || []);
  
  const profilePhoto = photos[0] 
    || userData?.profileImage 
    || `https://ui-avatars.com/api/?name=${profile.name}&background=ec4899&color=fff&size=200`;
  
  console.log("🔵 Foto de perfil escolhida:", profilePhoto ? profilePhoto.substring(0, 50) + "..." : "placeholder");
  console.log("🔵 Total de fotos disponíveis:", photos.length);

  // Calcular porcentagem de completude do perfil
  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 10;

    if (photos.length >= 2) completed++;
    if (profile.bio) completed++;
    if (profile.job) completed++;
    if (profile.school) completed++;
    if (profile.interests && profile.interests.length > 0) completed++;
    if (profile.relationshipGoals) completed++;
    if (profile.languages && profile.languages.length > 0) completed++;
    if (profile.height) completed++;
    if (profile.instagram || profile.spotify) completed++;
    if (profile.isVerified) completed++;

    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <img src={mixLogo} alt="MIX" className="h-8 w-auto" />
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/settings')}
              className="text-white hover:bg-white/20 w-10 h-10 p-0 rounded-full"
              data-testid="button-settings"
            >
              <Shield className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/settings')}
              className="text-white hover:bg-white/20 w-10 h-10 p-0 rounded-full"
              data-testid="button-config"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-4 pt-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500">
              <img
                src={profilePhoto}
                alt={profile.name}
                className="w-full h-full object-cover"
                data-testid="img-profile-photo"
                onError={(e) => {
                  console.error("🔴 Erro ao carregar foto de perfil");
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // ✅ Evitar loop infinito
                  target.src = `https://ui-avatars.com/api/?name=${profile.name}&background=ec4899&color=fff&size=200`;
                }}
                onLoad={() => {
                  console.log("✅ Foto de perfil carregada com sucesso");
                }}
              />
            </div>
            {/* Badge de completude */}
            <div 
              className="absolute -bottom-1 -right-1 bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 border-blue-900"
              data-testid="badge-profile-completion"
            >
              {profileCompletion}%
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-white text-2xl font-bold" data-testid="text-profile-name">
                {profile.name}, {profile.age}
              </h2>
              {profile.isVerified && (
                <div className="text-blue-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botão Editar Perfil */}
        <Button
          onClick={() => setLocation('/edit-profile-new')}
          className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-full text-lg shadow-lg"
          data-testid="button-edit-profile"
        >
          ✏️ Editar perfil
        </Button>

        {/* Card Double Date (exemplo) */}
        <div 
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-white/10 cursor-pointer hover:bg-gray-900/70 transition-colors"
          onClick={() => setLocation('/discover')}
          data-testid="card-discover-profiles"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold" data-testid="text-discover-title">Descubra novos perfis</h3>
              <p className="text-gray-400 text-sm" data-testid="text-discover-subtitle">Comece a dar match agora</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>

        {/* Cards de Recursos */}
        <div className="grid grid-cols-3 gap-3">
          {/* Super Like */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center" data-testid="card-super-like">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center">
              <Star className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <p className="text-xs text-blue-400 font-semibold mb-1" data-testid="text-super-like-count">
              {superLikes?.remaining || 0} Super Like{(superLikes?.remaining || 0) !== 1 ? 's' : ''}
            </p>
            <p className="text-[10px] text-purple-400 font-medium" data-testid="text-super-like-more">RECEBA MAIS</p>
          </div>

          {/* Boosts */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center" data-testid="card-boosts">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-500 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <p className="text-xs text-white font-semibold mb-1" data-testid="text-boosts-title">
              {boostStats?.available || 0} Boost{(boostStats?.available || 0) !== 1 ? 's' : ''}
            </p>
            <p className="text-[10px] text-purple-400 font-medium" data-testid="text-boosts-more">RECEBA MAIS</p>
          </div>

          {/* Assinaturas */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center" data-testid="card-subscriptions">
            <div className="w-12 h-12 mx-auto mb-2 bg-pink-500 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <p className="text-xs text-pink-400 font-semibold" data-testid="text-subscriptions">Assinaturas</p>
          </div>
        </div>

        {/* Carrossel de Planos */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 touch-pan-y">
            {/* Card MIX Platinum */}
            <div className="flex-[0_0_95%] min-w-0 shrink-0">
              <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-600" data-testid="card-platinum-plan">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src={mixLogo} alt="mix" className="h-8 w-auto" />
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full font-bold" data-testid="badge-platinum">PLATINUM</span>
                  </div>
                  <Button
                    onClick={() => setLocation('/subscription')}
                    className="bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-full px-6"
                    data-testid="button-platinum-upgrade"
                  >
                    Atualizar
                  </Button>
                </div>

                <h4 className="text-white font-bold mb-3" data-testid="text-platinum-features-title">O que está incluído</h4>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between" data-testid="feature-platinum-priority-likes">
                    <div className="text-white text-sm">Curtidas prioritárias</div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-white/60" />
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between" data-testid="feature-platinum-message-before-match">
                    <div className="text-white text-sm">Mande mensagem antes do match</div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-white/60" />
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between" data-testid="feature-platinum-see-likes">
                    <div className="text-white text-sm">Veja quem curtiu você</div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-white/60" />
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <button 
                    onClick={() => setLocation('/subscription')}
                    className="text-white underline text-sm font-medium"
                    data-testid="button-platinum-all-features"
                  >
                    Veja todos os recursos
                  </button>
                </div>
              </div>
            </div>

            {/* Card MIX Gold */}
            <div className="flex-[0_0_95%] min-w-0 shrink-0">
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-3xl p-6 shadow-2xl" data-testid="card-gold-plan">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src={mixLogo} alt="mix" className="h-8 w-auto" />
                    <span className="bg-yellow-800 text-white text-xs px-2 py-0.5 rounded-full font-bold" data-testid="badge-gold">GOLD</span>
                  </div>
                  <Button
                    onClick={() => setLocation('/subscription')}
                    className="bg-white hover:bg-gray-100 text-yellow-700 font-bold rounded-full px-6"
                    data-testid="button-gold-upgrade"
                  >
                    Atualizar
                  </Button>
                </div>

                <h4 className="text-white font-bold mb-3" data-testid="text-gold-features-title">O que está incluído</h4>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between" data-testid="feature-gold-see-likes">
                    <div className="text-white text-sm">Veja quem curtiu você</div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-white/60" />
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between" data-testid="feature-gold-highlights">
                    <div className="text-white text-sm">Destaques</div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-white/60" />
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between" data-testid="feature-gold-super-likes">
                    <div className="text-white text-sm">Super Likes grátis</div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-white/60" />
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-yellow-800/30">
                  <button 
                    onClick={() => setLocation('/subscription')}
                    className="text-white underline text-sm font-medium"
                    data-testid="button-gold-all-features"
                  >
                    Veja todos os recursos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores de paginação */}
        <div className="flex justify-center gap-2 py-2">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                selectedIndex === index ? 'bg-white' : 'bg-white/30'
              }`}
              data-testid={`pagination-dot-${index}`}
            />
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

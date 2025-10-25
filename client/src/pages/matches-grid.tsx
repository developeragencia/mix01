import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

interface Profile {
  id: number;
  userId: number;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  location: string;
  isVerified: boolean;
}

export default function MatchesGrid() {
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState(15 * 60 + 34); // 15min 34seg
  
  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/discover"],
  });

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando perfis...</p>
        </div>
      </div>
    );
  }

  // Separar perfis: 2 em destaque + resto ofuscado
  const featuredProfiles = profiles.slice(0, 2);
  const blurredProfiles = profiles.slice(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/discover")}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-2 bg-green-500/90 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-bold">Loja funcional</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Título */}
        <h1 className="text-white text-2xl font-bold text-center mb-6">
          SEU MIX DO MOMENTO
        </h1>

        {/* Perfis em Destaque (2 grandes no topo) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {featuredProfiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => setLocation(`/match-profile/${profile.userId}`)}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
            >
              {/* Foto */}
              <img
                src={profile.photos?.[0] || `https://ui-avatars.com/api/?name=${profile.name}&background=ec4899&color=fff&size=400`}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              
              {/* Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Badge Verificado */}
              {profile.isVerified && (
                <div className="absolute top-2 right-2">
                  <VerifiedBadge className="w-5 h-5" />
                </div>
              )}
              
              {/* Info do Perfil */}
              <div className="absolute bottom-3 left-3 text-white">
                <div className="flex items-center gap-1.5 mb-1">
                  <h3 className="font-bold text-base">{profile.name}</h3>
                  <span className="text-sm">{profile.age}</span>
                </div>
                {profile.location && (
                  <p className="text-xs opacity-90">{profile.location}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Contador de Tempo */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-pink-400/50">
            <p className="text-white text-sm mb-2">Libere mais em:</p>
            <div className="text-white text-2xl font-bold font-mono">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Outros Perfis Ofuscados */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {blurredProfiles.slice(0, 12).map((profile) => (
            <div
              key={profile.id}
              onClick={() => setLocation("/premium")}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Foto Ofuscada */}
              <img
                src={profile.photos?.[0] || `https://ui-avatars.com/api/?name=${profile.name}&background=ec4899&color=fff&size=200`}
                alt="Perfil ofuscado"
                className="w-full h-full object-cover blur-md"
              />
              
              {/* Overlay escuro */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
        </div>

        {/* Botão Desbloquear */}
        <Button
          onClick={() => setLocation("/premium")}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-6 rounded-full text-lg shadow-lg mb-3"
        >
          Desbloquear mais pessoas
        </Button>

        {/* Info Extra */}
        <p className="text-center text-white/70 text-sm">
          {blurredProfiles.length > 12 
            ? `+${blurredProfiles.length - 12} pessoas perto de você`
            : `${blurredProfiles.length} pessoas perto de você`}
        </p>
      </div>

      <BottomNavigation />
    </div>
  );
}

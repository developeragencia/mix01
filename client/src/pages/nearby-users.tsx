import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ArrowLeft, Heart, X, Navigation, Crown, Zap, Filter, Sliders } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import mixLogoIcon from "@assets/Logo_MIX_horizontal_1752607947932.png";

interface NearbyUser {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  distance: number; // in km
  lastActive: string;
  isPremium?: boolean;
  isVip?: boolean;
  profession?: string;
  commonInterests: string[];
}

export default function NearbyUsers() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<string>("São Paulo, SP");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxDistance, setMaxDistance] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    // Simulated geolocation and nearby users - in production would use real GPS
    const mockNearbyUsers: NearbyUser[] = [
      {
        id: "nearby1",
        name: "Juliana Costa",
        age: 26,
        photo: "https://images.unsplash.com/photo-1494790108755-2616b48ec4db?w=400&h=400&fit=crop",
        bio: "Engenheira de software apaixonada por tecnologia e viagens. Nas horas vagas gosto de cozinhar pratos novos e explorar a cidade!",
        distance: 0.8,
        lastActive: "Ativa agora",
        isPremium: true,
        profession: "Engenheira de Software",
        commonInterests: ["tecnologia", "viagens", "culinária"]
      },
      {
        id: "nearby2", 
        name: "Diego Oliveira",
        age: 29,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        bio: "Professor de educação física que adora esportes radicais. Sempre em busca de novas aventuras e experiências!",
        distance: 1.2,
        lastActive: "5 min atrás",
        profession: "Professor",
        commonInterests: ["esportes", "aventura", "natureza"]
      },
      {
        id: "nearby3",
        name: "Camila Santos",
        age: 24,
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop", 
        bio: "Artista e designer gráfica. Amo arte, música e tudo que envolve criatividade. Vamos criar memórias juntos?",
        distance: 2.1,
        lastActive: "1 hora atrás",
        isVip: true,
        profession: "Designer",
        commonInterests: ["arte", "música", "design"]
      },
      {
        id: "nearby4",
        name: "Fernando Lima",
        age: 31,
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        bio: "Médico veterinário que ama animais e natureza. Nos finais de semana gosto de fazer trilhas e relaxar ao ar livre.",
        distance: 3.5,
        lastActive: "2 horas atrás",
        profession: "Veterinário", 
        commonInterests: ["animais", "natureza", "trilhas"]
      }
    ];

    setTimeout(() => {
      setNearbyUsers(mockNearbyUsers);
      setLoading(false);
    }, 1500);
  }, []);

  const handleLike = async () => {
    // Verificar limite de 12 matches gratuitos
    if (likeCount >= 12 && !user?.isPremium) {
      toast({
        title: "🚫 Limite de matches atingido",
        description: "Você atingiu o limite de 12 matches gratuitos!",
        duration: 4000,
      });
      setLocation("/swipe-limit");
      return;
    }

    const currentUser = nearbyUsers[currentIndex];
    
    try {
      // Enviar like para a API
      const response = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: currentUser.id,
          source: "nearby"
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        setLikeCount(prev => prev + 1);
        
        if (data.isMatch) {
          toast({
            title: "🎉 É UM MATCH!",
            description: `Você e ${currentUser.name} deram match!`,
            duration: 5000,
          });
        } else {
          toast({
            title: "💕 Curtida enviada!",
            description: `Você curtiu ${currentUser.name}`,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
      toast({
        title: "💕 Curtida enviada!",
        description: `Você curtiu ${currentUser.name}`,
      });
    }
    
    nextUser();
  };

  const handlePass = () => {
    nextUser();
  };

  const nextUser = () => {
    if (currentIndex < nearbyUsers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast({
        title: "Fim da lista!",
        description: "Não há mais pessoas por perto. Tente aumentar a distância ou volte mais tarde.",
      });
      setLocation("/discover");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center px-6 text-white">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-pink-500/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={mixLogoIcon} alt="MIX" className="w-12 h-12 object-contain" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Procurando pessoas por perto</h3>
          <p className="text-blue-200 text-sm">Cadê a galera? Buscando em {maxDistance}km...</p>
        </div>
      </div>
    );
  }

  if (nearbyUsers.length === 0 || currentIndex >= nearbyUsers.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-md mx-auto h-full flex flex-col justify-center items-center text-center text-white">
          <MapPin className="w-16 h-16 text-blue-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhuma pessoa por perto</h2>
          <p className="text-white/70 mb-6">
            Não encontramos ninguém na sua região. Tente aumentar a distância de busca.
          </p>
          <Button
            onClick={() => setLocation("/discover")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Voltar à Descoberta
          </Button>
        </div>
      </div>
    );
  }

  const currentUser = nearbyUsers[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/discover")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  Cadê a galera?
                </h1>
                <p className="text-white/60 text-sm flex items-center gap-1">
                  <Navigation className="w-3 h-3" />
                  {userLocation}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/10 text-white">
                {currentIndex + 1}/{nearbyUsers.length}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-white hover:bg-white/10"
              >
                <Sliders className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Painel de Filtros */}
          {showFilters && (
            <Card className="bg-white/10 border-white/20 mb-3">
              <CardContent className="p-4">
                <div className="text-white">
                  <label className="text-sm font-medium mb-2 block">
                    Distância máxima: {maxDistance}km
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>1km</span>
                    <span>50km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Profile Card */}
        <Card className="bg-white/10 border-white/20 flex-1 mb-6 overflow-hidden">
          <div className="relative h-96">
            <img
              src={currentUser.photo}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Distance Badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-blue-500/80 text-white flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentUser.distance} km
              </Badge>
            </div>

            {/* Premium/VIP Badge */}
            {(currentUser.isPremium || currentUser.isVip) && (
              <div className="absolute top-4 right-4">
                <Badge className={`${
                  currentUser.isVip 
                    ? 'bg-yellow-500/80 text-white' 
                    : 'bg-purple-500/80 text-white'
                } flex items-center gap-1`}>
                  {currentUser.isVip ? (
                    <><Crown className="w-3 h-3" /> VIP</>
                  ) : (
                    <><Zap className="w-3 h-3" /> PREMIUM</>
                  )}
                </Badge>
              </div>
            )}
            
            {/* Profile Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold">
                    {currentUser.name}, {currentUser.age}
                  </h2>
                  {currentUser.profession && (
                    <p className="text-white/90 text-sm">{currentUser.profession}</p>
                  )}
                </div>
              </div>
              <p className="text-white/80 text-xs">Última vez ativa: {currentUser.lastActive}</p>
            </div>
          </div>

          <CardContent className="p-4 text-white space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Sobre</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {currentUser.bio}
              </p>
            </div>

            {/* Common Interests */}
            {currentUser.commonInterests.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Interesses em comum</h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser.commonInterests.map((interest, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white border-pink-400/30"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Location Details */}
            <div className="bg-white/5 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-1">Localização aproximada</h4>
              <p className="text-white/70 text-xs">
                A {currentUser.distance} km de você • {currentUser.lastActive}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mb-4">
          <Button
            onClick={handlePass}
            size="lg"
            className="bg-white/10 hover:bg-white/20 border-white/20 text-white rounded-full w-16 h-16"
          >
            <X className="w-8 h-8" />
          </Button>
          
          <Button
            onClick={handleLike}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full w-16 h-16"
          >
            <Heart className="w-8 h-8" />
          </Button>
        </div>

        {/* Distance Info */}
        <Card className="bg-white/5 border-white/10 text-white">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-sm">Pessoas por perto</h3>
            </div>
            <p className="text-white/70 text-xs">
              Mostrando pessoas em um raio de {maxDistance}km da sua localização
            </p>
            {likeCount > 0 && !user?.isPremium && (
              <p className="text-pink-400 text-xs mt-2 font-medium">
                {likeCount}/12 matches gratuitos hoje
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Star, MapPin, Info, Camera, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface UserProfile {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  distance: number;
  interests: string[];
  isVerified: boolean;
  isOnline: boolean;
}

const demoProfiles: UserProfile[] = [
  {
    id: "1",
    name: "Maria",
    age: 26,
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop"
    ],
    bio: "Amo viajar, fotografar e descobrir novos lugares. Procuro alguém para compartilhar aventuras! 📸✈️",
    distance: 2.3,
    interests: ["Fotografia", "Viagem", "Arte", "Música"],
    isVerified: true,
    isOnline: true
  },
  {
    id: "2",
    name: "Carlos",
    age: 29,
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop"
    ],
    bio: "Chef apaixonado por culinária. Adoro cozinhar para pessoas especiais e explorar novos sabores 👨‍🍳🍝",
    distance: 1.8,
    interests: ["Culinária", "Vinho", "Esportes", "Cinema"],
    isVerified: true,
    isOnline: false
  },
  {
    id: "3",
    name: "Ana",
    age: 24,
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop"
    ],
    bio: "Estudante de medicina que ama dançar. Procuro alguém que saiba me fazer rir e dançar até o amanhecer 💃🏻",
    distance: 4.1,
    interests: ["Dança", "Medicina", "Fitness", "Livros"],
    isVerified: false,
    isOnline: true
  }
];

export default function Discovery() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const currentProfile = demoProfiles[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSwipeDirection(direction);

    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % demoProfiles.length);
      setCurrentPhotoIndex(0);
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handlePhotoNext = () => {
    if (currentProfile.photos.length > 1) {
      setCurrentPhotoIndex(prev => 
        prev === currentProfile.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sem mais perfis!</h2>
          <p className="text-white/80 mb-6">Volte mais tarde para ver novos perfis na sua área.</p>
          <Button 
            onClick={() => setLocation("/")}
            className="bg-gradient-to-r from-pink-500 to-purple-600"
          >
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProfile.id}
            initial={{ scale: 0.8, opacity: 0, rotateY: swipeDirection === 'left' ? -90 : 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ 
              scale: 0.8, 
              opacity: 0, 
              x: swipeDirection === 'left' ? -300 : swipeDirection === 'right' ? 300 : 0,
              rotateZ: swipeDirection === 'left' ? -30 : swipeDirection === 'right' ? 30 : 0
            }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Card className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Foto Principal */}
              <div 
                className="relative h-96 cursor-pointer"
                onClick={handlePhotoNext}
              >
                <img
                  src={currentProfile.photos[currentPhotoIndex]}
                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Status Online */}
                {currentProfile.isOnline && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 w-3 h-3 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                )}

                {/* Verificação */}
                {currentProfile.isVerified && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Verificado
                    </Badge>
                  </div>
                )}

                {/* Indicadores de Foto */}
                {currentProfile.photos.length > 1 && (
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {currentProfile.photos.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 w-8 rounded-full ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Info Principal */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                    <span className="text-xl font-light">{currentProfile.age}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <MapPin className="h-4 w-4" />
                    <span>{currentProfile.distance} km de distância</span>
                  </div>
                </div>
              </div>

              {/* Informações Detalhadas */}
              <div className="p-6">
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {currentProfile.bio}
                </p>

                {/* Interesses */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentProfile.interests.map((interest, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>

                {/* Botões de Ação */}
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-16 h-16 border-2 border-red-200 hover:border-red-400 hover:bg-red-50"
                    onClick={() => handleSwipe('left')}
                    disabled={isAnimating}
                  >
                    <X className="h-8 w-8 text-red-500" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-12 h-12 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50"
                    onClick={() => setLocation(`/profile/${currentProfile.id}`)}
                  >
                    <Info className="h-5 w-5 text-blue-500" />
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full w-12 h-12 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                    onClick={() => setLocation(`/messages/new/${currentProfile.id}`)}
                  >
                    <MessageCircle className="h-5 w-5 text-purple-500" />
                  </Button>

                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 border-none"
                    onClick={() => handleSwipe('right')}
                    disabled={isAnimating}
                  >
                    <Heart className="h-8 w-8 text-white" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navegação Inferior */}
        <div className="flex justify-center mt-6 gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setLocation("/filters")}
          >
            Filtros
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => setLocation("/")}
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
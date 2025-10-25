import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Crown, ArrowLeft, Sparkles, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LikeReceived {
  id: string;
  name: string;
  age: number;
  photos: string[];
  bio: string;
  location: string;
  timestamp: string;
  isPremium?: boolean;
  isVip?: boolean;
}

export default function LikesReceived() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [likes, setLikes] = useState<LikeReceived[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Simulated data - in production would come from API
  useEffect(() => {
    const simulatedLikes: LikeReceived[] = [
      {
        id: "like1",
        name: "Isabella Santos",
        age: 24,
        photos: [
          "https://images.unsplash.com/photo-1494790108755-2616b48ec4db?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop"
        ],
        bio: "Fotógrafa apaixonada por viagens e aventuras. Sempre em busca de novos horizontes!",
        location: "São Paulo, SP",
        timestamp: "2 horas atrás",
        isPremium: true
      },
      {
        id: "like2",
        name: "Gabriel Costa",
        age: 29,
        photos: [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
        ],
        bio: "Engenheiro de software que ama música e esportes. Vamos conhecer lugares novos juntos?",
        location: "Rio de Janeiro, RJ",
        timestamp: "5 horas atrás",
        isVip: true
      },
      {
        id: "like3",
        name: "Amanda Silva",
        age: 26,
        photos: [
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
        ],
        bio: "Designer gráfica amante de arte e café. Sempre criando algo novo!",
        location: "Belo Horizonte, MG",
        timestamp: "1 dia atrás"
      }
    ];

    setTimeout(() => {
      setLikes(simulatedLikes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleLike = () => {
    if (currentIndex < likes.length) {
      toast({
        title: "É um Match! 💕",
        description: `Você e ${likes[currentIndex].name} se curtiram!`,
      });
      
      setTimeout(() => {
        if (currentIndex < likes.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setLocation("/matches");
        }
      }, 1500);
    }
  };

  const handlePass = () => {
    if (currentIndex < likes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setLocation("/discover");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando seus likes...</p>
        </div>
      </div>
    );
  }

  if (likes.length === 0 || currentIndex >= likes.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-md mx-auto h-full flex flex-col justify-center items-center text-center text-white">
          <Heart className="w-16 h-16 text-pink-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Nenhum like novo</h2>
          <p className="text-white/70 mb-6">
            Continue descobrindo perfis para receber mais likes!
          </p>
          <Button
            onClick={() => setLocation("/discover")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Descobrir Perfis
          </Button>
        </div>
      </div>
    );
  }

  const currentLike = likes[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/likes")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Quem te curtiu
              </h1>
              <p className="text-white/60 text-sm">{likes.length} pessoas</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/10 text-white">
            {currentIndex + 1}/{likes.length}
          </Badge>
        </div>

        {/* Profile Card */}
        <Card className="bg-white/10 border-white/20 flex-1 mb-6 overflow-hidden">
          <div className="relative h-96">
            <img
              src={currentLike.photos[0]}
              alt={currentLike.name}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Profile Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">
                  {currentLike.name}, {currentLike.age}
                </h2>
                {currentLike.isVip && (
                  <Crown className="w-5 h-5 text-yellow-400" />
                )}
                {currentLike.isPremium && (
                  <Sparkles className="w-5 h-5 text-purple-400" />
                )}
              </div>
              <p className="text-white/90 text-sm mb-2">{currentLike.location}</p>
              <p className="text-white/80 text-xs">Te curtiu {currentLike.timestamp}</p>
            </div>

            {/* Like Indicator */}
            <div className="absolute top-4 right-4">
              <div className="bg-pink-500 text-white rounded-full p-2">
                <Heart className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>

          <CardContent className="p-4 text-white">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Sobre</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {currentLike.bio}
                </p>
              </div>

              {currentLike.photos.length > 1 && (
                <div>
                  <h3 className="font-semibold mb-2">Mais fotos</h3>
                  <div className="flex gap-2">
                    {currentLike.photos.slice(1, 4).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Foto ${index + 2}`}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
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

        {/* Premium CTA */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/30 text-white">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold">Mix Premium</h3>
            </div>
            <p className="text-white/80 text-sm mb-3">
              Veja todos os seus likes de uma vez e nunca perca um match!
            </p>
            <Button
              onClick={() => setLocation("/premium")}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full"
            >
              <Star className="w-4 h-4 mr-2" />
              Assinar Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Crown, ArrowLeft, Zap, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuperLikeCard {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string;
  superLikedAt: string;
  isRead: boolean;
}

export default function SuperLikes() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [superLikes, setSuperLikes] = useState<SuperLikeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [superLikesCount, setSuperLikesCount] = useState(3);

  useEffect(() => {
    // Simulated data - in production would come from API
    const mockSuperLikes: SuperLikeCard[] = [
      {
        id: "sl1",
        name: "Sofia Martins",
        age: 27,
        photo: "https://images.unsplash.com/photo-1494790108755-2616b48ec4db?w=400&h=400&fit=crop",
        bio: "Médica apaixonada por viagens e fotografia. Sempre em busca de novas aventuras!",
        location: "São Paulo, SP",
        superLikedAt: "1 hora atrás",
        isRead: false
      },
      {
        id: "sl2",
        name: "Lucas Ferreira",
        age: 32,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        bio: "Arquiteto que adora arte, música e bons vinhos. Vamos descobrir a cidade juntos?",
        location: "Rio de Janeiro, RJ",
        superLikedAt: "3 horas atrás",
        isRead: true
      }
    ];

    setTimeout(() => {
      setSuperLikes(mockSuperLikes);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSuperLike = (profileId: string) => {
    if (superLikesCount <= 0) {
      toast({
        title: "Sem Super Likes",
        description: "Você não tem Super Likes disponíveis hoje. Assine Premium para mais!",
        variant: "destructive",
      });
      return;
    }

    setSuperLikesCount(prev => prev - 1);
    toast({
      title: "Super Like enviado! ⭐",
      description: "Seu perfil foi destacado para essa pessoa!",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando Super Likes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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
                <Star className="w-5 h-5 text-yellow-400" />
                Super Likes
              </h1>
              <p className="text-white/60 text-sm">Destaque-se para alguém especial</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
            {superLikesCount} restantes
          </Badge>
        </div>

        {/* Super Likes Counter */}
        <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 text-white mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-yellow-400" />
              Seus Super Likes
            </CardTitle>
            <CardDescription className="text-white/70">
              Você tem {superLikesCount} Super Likes para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-white/80">
                Super Likes fazem você aparecer em destaque!
              </div>
              <Button
                onClick={() => setLocation("/premium")}
                variant="outline"
                className="border-yellow-400/50 text-yellow-200 hover:bg-yellow-400/10"
              >
                <Crown className="w-4 h-4 mr-2" />
                Mais
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Received Super Likes */}
        {superLikes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Quem te deu Super Like
            </h2>
            <div className="space-y-3">
              {superLikes.map((superLike) => (
                <Card key={superLike.id} className="bg-white/10 border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={superLike.photo}
                          alt={superLike.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-1">
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                        {!superLike.isRead && (
                          <div className="absolute -top-1 -left-1 bg-pink-500 w-3 h-3 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{superLike.name}, {superLike.age}</h3>
                          {!superLike.isRead && (
                            <Badge className="bg-pink-500 text-white text-xs px-1.5 py-0.5">
                              Novo
                            </Badge>
                          )}
                        </div>
                        <p className="text-white/70 text-sm mb-1">{superLike.location}</p>
                        <p className="text-white/60 text-xs">{superLike.superLikedAt}</p>
                      </div>
                      
                      <Button
                        onClick={() => handleSuperLike(superLike.id)}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Super Like
                      </Button>
                    </div>
                    
                    <p className="text-white/80 text-sm mt-3 line-clamp-2">
                      {superLike.bio}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* How Super Likes Work */}
        <Card className="bg-white/5 border-white/10 text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Como funcionam os Super Likes?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div className="text-sm">
                <div className="font-medium">Destaque seu perfil</div>
                <div className="text-white/70">Seu perfil aparece em destaque dourado</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div className="text-sm">
                <div className="font-medium">Prioridade na descoberta</div>
                <div className="text-white/70">Aparece primeiro na lista de perfis</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div className="text-sm">
                <div className="font-medium">Notificação especial</div>
                <div className="text-white/70">A pessoa recebe uma notificação exclusiva</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA for Premium */}
        {superLikesCount <= 1 && (
          <Card className="mt-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-400/30 text-white">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Ficando sem Super Likes?</h3>
              <p className="text-white/80 text-sm mb-3">
                Com Mix Premium você tem 5 Super Likes por dia!
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
        )}
      </div>
    </div>
  );
}
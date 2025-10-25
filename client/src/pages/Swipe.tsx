import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, MessageCircle, Star, MapPin, Shield, Sparkles } from "lucide-react";
import SwipeCard from "@/components/swipe-card";
import BottomNavigation from "@/components/BottomNavigation";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

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
  interests: string[];
  profession: string;
  education: string;
  height: string;
  relationshipGoals: string;
  socialMediaVerified: boolean;
  lastActiveAt: string;
}

export default function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionCounts, setActionCounts] = useState({
    likes: 0,
    passes: 0,
    superLikes: 0,
  });

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/discover"],
  });

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (direction === "left") {
      setActionCounts(prev => ({ ...prev, passes: prev.passes + 1 }));
    } else if (direction === "right") {
      setActionCounts(prev => ({ ...prev, likes: prev.likes + 1 }));
    } else if (direction === "up") {
      setActionCounts(prev => ({ ...prev, superLikes: prev.superLikes + 1 }));
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const currentProfile = profiles[currentIndex];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando perfis...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-2xl font-bold mb-2">Não há mais perfis!</h2>
            <p className="text-lg opacity-90">
              Você visualizou todos os perfis disponíveis na sua região.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-6 bg-white text-purple-600 hover:bg-gray-100"
            >
              Recarregar Perfis
            </Button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <img 
          src={mixLogoHorizontal} 
          alt="MIX Logo" 
          className="h-10 w-auto"
        />
        <div className="flex items-center space-x-4 text-white">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-300" />
            <span className="text-sm font-medium">{actionCounts.likes}</span>
          </div>
          <div className="flex items-center space-x-2">
            <X className="h-5 w-5 text-red-300" />
            <span className="text-sm font-medium">{actionCounts.passes}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-300" />
            <span className="text-sm font-medium">{actionCounts.superLikes}</span>
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <SwipeCard 
          profile={currentProfile} 
          index={0}
          onSwipe={(profileId, isLike) => handleSwipe(isLike ? "right" : "left")}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-6 p-6 bg-black/20 backdrop-blur-sm">
        <Button
          onClick={() => handleSwipe("left")}
          size="lg"
          className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/30 text-white"
        >
          <X className="h-8 w-8" />
        </Button>
        
        <Button
          onClick={() => handleSwipe("up")}
          size="lg"
          className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 border-2 border-blue-400 text-white"
        >
          <Star className="h-8 w-8" />
        </Button>
        
        <Button
          onClick={() => handleSwipe("right")}
          size="lg"
          className="w-16 h-16 rounded-full bg-pink-500 hover:bg-pink-600 border-2 border-pink-400 text-white"
        >
          <Heart className="h-8 w-8" />
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
}
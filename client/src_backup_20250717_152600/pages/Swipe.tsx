import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, X, Info } from "lucide-react";
import SwipeCard from "@/components/swipe-card";
import type { Profile } from "@shared/schema";

export function Swipe() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/discover"],
  });

  const currentProfile = profiles[currentIndex];

  const handleSwipe = (profileId: number, isLike: boolean) => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 flex items-center justify-center">
        <div className="loading"></div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Não há mais perfis</h2>
          <p className="text-lg opacity-90">Volte mais tarde para ver novos matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pt-4">
        <div className="text-white font-bold text-2xl">MIX</div>
        <div className="text-white text-sm">
          {currentIndex + 1} de {profiles.length}
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative h-[600px] max-w-sm mx-auto">
        <SwipeCard
          profile={currentProfile}
          index={0}
          onSwipe={handleSwipe}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-6 mt-6">
        <button
          onClick={() => handleSwipe(currentProfile.userId, false)}
          className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30 transition-all"
        >
          <X className="w-8 h-8 text-white" />
        </button>
        
        <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 hover:bg-opacity-30 transition-all">
          <Info className="w-6 h-6 text-white" />
        </button>
        
        <button
          onClick={() => handleSwipe(currentProfile.userId, true)}
          className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
        >
          <Heart className="w-8 h-8 text-white fill-current" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-6 bg-white bg-opacity-20 rounded-full h-2 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / profiles.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
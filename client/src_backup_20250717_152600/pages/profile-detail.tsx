import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, X, Star, MapPin, Calendar, Briefcase, GraduationCap, MessageCircle } from "lucide-react";
import type { Profile } from "@shared/schema";

export default function ProfileDetail() {
  const { profileId } = useParams<{ profileId: string }>();
  const [, setLocation] = useLocation();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: [`/api/profile/${profileId}`],
    enabled: !!profileId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white">Perfil não encontrado</p>
          <Button onClick={() => setLocation('/discover')} className="mt-4 bg-white text-blue-900">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const photos = profile.photos || ['/placeholder-avatar.png'];

  const handleSwipe = async (isLike: boolean, isSuperLike = false) => {
    try {
      await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swiperId: 1, // current user
          swipedId: profile.userId,
          isLike,
          isSuperLike,
        }),
      });
      setLocation('/discover');
    } catch (error) {
      console.error('Error creating swipe:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-transparent sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setLocation('/discover')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MIX</span>
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="text-white">
            <div className="w-6 h-6 rounded-full bg-white/20"></div>
          </Button>
        </div>
      </header>

      {/* Photo Gallery */}
      <div className="relative h-96 mx-4 mb-6 rounded-2xl overflow-hidden">
        <img 
          src={photos[currentPhotoIndex]} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Photo indicators */}
        {photos.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex space-x-2">
            {photos.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index === currentPhotoIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Basic info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-white text-3xl font-bold mb-1">{profile.name}</h1>
              <div className="flex items-center space-x-4 text-white/80">
                <span className="text-lg">{profile.age} anos</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>2 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="px-4 pb-32">
        {/* Bio */}
        {profile.bio && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-6 mb-6">
            <p className="text-white text-lg leading-relaxed">{profile.bio}</p>
          </Card>
        )}

        {/* Details */}
        <div className="space-y-4 mb-6">
          {profile.profession && (
            <div className="flex items-center space-x-3 text-white">
              <Briefcase className="w-5 h-5 text-white/60" />
              <span>{profile.profession}</span>
            </div>
          )}

          <div className="flex items-center space-x-3 text-white">
            <Calendar className="w-5 h-5 text-white/60" />
            <span>Ativo recentemente</span>
          </div>
        </div>

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-lg font-semibold mb-3">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge 
                  key={index}
                  className="bg-white/20 text-white border-white/30 px-3 py-1 rounded-full"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20 p-6">
        <div className="flex items-center justify-center space-x-6">
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 border-2 border-white/40"
            onClick={() => handleSwipe(false)}
          >
            <X className="w-8 h-8 text-white" />
          </Button>
          
          <Button
            size="lg"
            className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg"
            onClick={() => handleSwipe(true, true)}
          >
            <Star className="w-10 h-10 text-white" />
          </Button>
          
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 shadow-lg"
            onClick={() => handleSwipe(true)}
          >
            <Heart className="w-8 h-8 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
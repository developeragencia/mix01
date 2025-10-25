import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, Briefcase, GraduationCap, Globe, Baby, Users } from "lucide-react";
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

  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : ['/placeholder-avatar.png'];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const relationshipGoalsMap: Record<string, string> = {
    'long-term': '💕 Relacionamento Sério',
    'short-term': '😊 Algo Casual',
    'figuring-out': '🤔 Descobrindo',
    'friends': '🤝 Amizades'
  };

  const familyPlansMap: Record<string, string> = {
    'want-children': '👶 Quero ter filhos',
    'dont-want': '🚫 Não quero filhos',
    'open-to': '🤷 Aberto à possibilidade',
    'have-children': '👨‍👧‍👦 Tenho filhos'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={() => setLocation('/discover')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-xl font-bold">Perfil</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-4 pt-4">
        {/* Photo Carousel */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
          <div className="relative h-96">
            <img
              src={photos[currentPhotoIndex]}
              alt={`Foto ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover"
              data-testid={`img-photo-${currentPhotoIndex}`}
            />
            
            {/* Photo Navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                  data-testid="button-prev-photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
                  data-testid="button-next-photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === currentPhotoIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Verified Badge */}
            {profile.isVerified && (
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold">Verificado</span>
              </div>
            )}
          </div>

          {/* Profile Name & Age */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h2 className="text-white text-3xl font-bold" data-testid="text-profile-name">
              {profile.name}, {profile.age}
            </h2>
            {profile.location && (
              <p className="text-white/90 flex items-center gap-1 mt-1" data-testid="text-profile-location">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {profile.bio && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-lg mb-3">Sobre mim</h3>
            <p className="text-white/90 leading-relaxed" data-testid="text-bio">
              {profile.bio}
            </p>
          </div>
        )}

        {/* Essentials Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-4">Informações</h3>
          <div className="space-y-3">
            {profile.job && (
              <div className="flex items-center gap-3 text-white/90">
                <Briefcase className="w-5 h-5 text-blue-300" />
                <span data-testid="text-job">{profile.job}{profile.company && ` em ${profile.company}`}</span>
              </div>
            )}
            {profile.school && (
              <div className="flex items-center gap-3 text-white/90">
                <GraduationCap className="w-5 h-5 text-blue-300" />
                <span data-testid="text-school">{profile.school}</span>
              </div>
            )}
            {profile.educationLevel && (
              <div className="flex items-center gap-3 text-white/90">
                <GraduationCap className="w-5 h-5 text-blue-300" />
                <span data-testid="text-education">{profile.educationLevel}</span>
              </div>
            )}
            {profile.height && (
              <div className="flex items-center gap-3 text-white/90">
                <Users className="w-5 h-5 text-blue-300" />
                <span data-testid="text-height">{profile.height} cm</span>
              </div>
            )}
            {profile.languages && profile.languages.length > 0 && (
              <div className="flex items-center gap-3 text-white/90">
                <Globe className="w-5 h-5 text-blue-300" />
                <span data-testid="text-languages">{profile.languages.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Lifestyle Section */}
        {(profile.relationshipGoals || profile.familyPlans || profile.starSign || profile.personalityType || profile.communicationStyle || profile.loveStyle) && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-lg mb-4">Estilo de Vida</h3>
            <div className="space-y-3">
              {profile.relationshipGoals && (
                <div className="flex items-center gap-3 text-white/90">
                  <Heart className="w-5 h-5 text-pink-300" />
                  <span data-testid="text-relationship-goals">
                    {relationshipGoalsMap[profile.relationshipGoals] || profile.relationshipGoals}
                  </span>
                </div>
              )}
              {profile.familyPlans && (
                <div className="flex items-center gap-3 text-white/90">
                  <Baby className="w-5 h-5 text-blue-300" />
                  <span data-testid="text-family-plans">
                    {familyPlansMap[profile.familyPlans] || profile.familyPlans}
                  </span>
                </div>
              )}
              {profile.starSign && (
                <div className="flex items-center gap-3 text-white/90">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span data-testid="text-star-sign">{profile.starSign}</span>
                </div>
              )}
              {profile.personalityType && (
                <div className="flex items-center gap-3 text-white/90">
                  <Users className="w-5 h-5 text-purple-300" />
                  <span data-testid="text-personality">{profile.personalityType}</span>
                </div>
              )}
              {profile.communicationStyle && (
                <div className="flex items-center gap-3 text-white/90">
                  <Users className="w-5 h-5 text-indigo-300" />
                  <span data-testid="text-communication-style">{profile.communicationStyle}</span>
                </div>
              )}
              {profile.loveStyle && (
                <div className="flex items-center gap-3 text-white/90">
                  <Heart className="w-5 h-5 text-red-300" />
                  <span data-testid="text-love-style">{profile.loveStyle}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interests Section */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-lg mb-4">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-blue-500/30 text-white px-4 py-2 rounded-full text-sm border border-blue-400/30"
                  data-testid={`tag-interest-${index}`}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Social Media Section */}
        {(profile.instagram || profile.spotify) && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold text-lg mb-4">Redes Sociais</h3>
            <div className="space-y-3">
              {profile.instagram && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-xs">Instagram</p>
                    <p className="text-white font-medium" data-testid="text-instagram">@{profile.instagram}</p>
                  </div>
                </div>
              )}
              {profile.spotify && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-xs">Spotify</p>
                    <p className="text-white font-medium" data-testid="text-spotify">{profile.spotify}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

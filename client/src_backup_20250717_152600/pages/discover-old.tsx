import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useMobile } from "@/hooks/use-mobile";
import SwipeCard from "@/components/swipe-card";
import MatchModal from "@/components/match-modal";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Heart, X, Star, MessageCircle, User, Settings, MapPin, Flame, Users, Mail, Navigation, UserCircle, Crown, LogOut } from "lucide-react";
import type { Profile } from "@shared/schema";
// Logo removed - using direct path instead

export default function Discover() {
  const isMobile = useMobile();
  const [, setLocation] = useLocation();
  const [currentUserId] = useState(2); // Demo user ID - changed to see Alex Developer
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [actionCounts, setActionCounts] = useState({
    likes: 0,
    dislikes: 0,
    superLikes: 0,
    totalInteractions: 0
  });

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: [`/api/discover/${currentUserId}?limit=10`],
  });

  // Reset bio state when profile changes
  useEffect(() => {
    setShowFullBio(false);
  }, [profiles[0]?.id]);

  const handleSwipe = async (profileId: number, isLike: boolean, isSuperLike = false) => {
    try {
      const response = await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swiperId: currentUserId,
          swipedId: profileId,
          isLike,
          isSuperLike,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if a match was created
        if (data.match && isLike) {
          const profile = profiles.find(p => p.userId === profileId);
          if (profile) {
            setMatchedProfile(profile);
            setShowMatchModal(true);
          }
        }
        
        // Refetch profiles to get the next one
        queryClient.invalidateQueries({ 
          queryKey: [`/api/discover/${currentUserId}?limit=10`] 
        });
      }
    } catch (error) {
      // Silent error handling for swipe actions
    }
  };

  const handleAction = (action: 'like' | 'dislike' | 'superlike') => {
    if (profiles.length === 0) return;
    
    const currentProfile = profiles[0];
    const isLike = action === 'like' || action === 'superlike';
    const isSuperLike = action === 'superlike';
    
    // Update action counters
    setActionCounts(prev => ({
      ...prev,
      likes: action === 'like' ? prev.likes + 1 : prev.likes,
      dislikes: action === 'dislike' ? prev.dislikes + 1 : prev.dislikes,
      superLikes: action === 'superlike' ? prev.superLikes + 1 : prev.superLikes,
      totalInteractions: prev.totalInteractions + 1
    }));
    
    handleSwipe(currentProfile.userId, isLike, isSuperLike);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[var(--mix-blue)] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando perfis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {!isMobile && <DesktopSidebar currentSection="discover" />}
      
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-transparent sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-6">
            <img 
              src="/mix-logo-horizontal.png" 
              alt="Mix Logo" 
              className="h-8"
            />
            {/* Contador de interações após 2 interações */}
            {actionCounts.totalInteractions >= 2 && (
              <div className="flex items-center space-x-2 text-white text-xs">
                <span className="bg-green-500/20 px-2 py-1 rounded-full">
                  ❤️ {actionCounts.likes}
                </span>
                <span className="bg-red-500/20 px-2 py-1 rounded-full">
                  ❌ {actionCounts.dislikes}
                </span>
                <span className="bg-blue-500/20 px-2 py-1 rounded-full">
                  ⭐ {actionCounts.superLikes}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => setLocation('/plans')}
              >
                <Crown className="w-6 h-6 text-yellow-400" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/10"
                onClick={() => {
                  // Clear any stored auth data and redirect to home
                  localStorage.removeItem('authToken');
                  setLocation('/');
                }}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`${!isMobile ? 'lg:ml-80' : ''} pb-20`}>
        {/* Profile Card - Full lateral coverage */}
        <div className="p-0">
          {profiles.length > 0 ? (
            <div className="relative w-full min-h-screen">
              <div className="bg-black overflow-hidden min-h-screen relative">
                {/* Profile Image filling entire screen */}
                <div className="relative w-full h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
                  <img 
                    src={profiles[0]?.photos?.[0] || '/placeholder-avatar.png'} 
                    alt={profiles[0]?.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                    style={{ 
                      imageRendering: 'crisp-edges'
                    }}
                  />
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                  
                  {/* Profile name and age - repositioned higher */}
                  <div className="absolute left-4 bottom-[220px] text-white">
                    <h1 className="text-[34px] font-bold leading-none mb-1">{profiles[0]?.name || "Alex Developer"}</h1>
                    <p className="text-[20px] font-normal">{profiles[0]?.age || 40} anos</p>
                    <p className="text-[16px] font-normal text-white/80">{profiles[0]?.location || "Petrolina, PE"}</p>
                  </div>

                  {/* MIX Action Buttons - EXACT REPLICA */}
                  <div className="absolute bottom-[140px] left-0 right-0 flex h-[60px]">
                    {/* m Button - Dark Blue section - MATCHES/LIKE */}
                    <button 
                      onClick={() => handleAction('like')}
                      className="flex-1 bg-[#1E3A8A] flex items-center justify-center"
                    >
                      <span className="text-white text-[64px] font-bold" style={{ fontFamily: 'Arial, sans-serif', fontWeight: '900' }}>m</span>
                    </button>
                    
                    {/* X Button - Red section - REJEITAR */}
                    <button 
                      onClick={() => {
                        console.log('BOTÃO X CLICADO - REJEITANDO PERFIL');
                        handleAction('dislike');
                      }}
                      className="flex-1 bg-[#DC2626] flex items-center justify-center hover:bg-[#B91C1C] transition-colors"
                    >
                      <span className="text-white text-[64px] font-bold" style={{ fontFamily: 'Arial, sans-serif', fontWeight: '900' }}>x</span>
                    </button>
                    
                    {/* I Button - Centered on the border - SEU MIX DO MOMENTO */}
                    <button 
                      onClick={() => {
                        console.log('Botão I clicado - navegando para /seu-mix');
                        setLocation('/seu-mix');
                      }}
                      className="absolute left-1/2 top-0 w-[40px] h-[60px] transform -translate-x-1/2 flex items-center justify-center z-10"
                    >
                      <span className="text-white text-[58px] font-bold" style={{ fontFamily: 'Arial, sans-serif', fontWeight: '900' }}>ı</span>
                    </button>
                  </div>

                  {/* BIO Section - expanded laterally and vertically */}
                  <div className="absolute bottom-0 left-0 right-0 bg-blue-950/70 text-white rounded-none h-[140px] z-10">
                    <div className="px-6 py-1 h-full flex flex-col justify-start">
                      <div className="flex items-center justify-between mb-1 mt-1">
                        <span className="text-[14px] font-bold tracking-wider uppercase">BIO</span>
                        <button 
                          className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-full text-[12px] font-medium hover:bg-white/10 transition-colors"
                          onClick={() => setLocation('/location')}
                        >
                          Bar Imaginario
                        </button>
                      </div>
                      <div className="flex-1">
                        {(() => {
                          const bio = profiles[0]?.bio || "Desenvolvedor de site, sistemas e aplicativos 💻";
                          const maxLength = 70; // Limitado a 70 caracteres conforme solicitado
                          const shouldTruncate = bio.length > maxLength && !showFullBio;
                          const displayText = shouldTruncate ? bio.substring(0, maxLength) + "..." : bio;
                          
                          return (
                            <div>
                              <p className="text-[14px] text-gray-200 leading-relaxed">
                                {displayText}
                              </p>
                              {bio.length > maxLength && (
                                <button
                                  onClick={() => setShowFullBio(!showFullBio)}
                                  className="text-blue-300 text-[12px] mt-1 hover:text-blue-200 transition-colors"
                                >
                                  {showFullBio ? "Ver menos" : "Ver mais"}
                                </button>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Heart className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Não há mais perfis
              </h3>
              <p className="text-white/60">
                Volte mais tarde para ver novos perfis!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* BottomNavigation removido - só aparece após check-in conforme solicitado */}

      {showMatchModal && matchedProfile && (
        <MatchModal
          profile={matchedProfile}
          onClose={() => setShowMatchModal(false)}
          onSendMessage={() => {
            setShowMatchModal(false);
            // Navigate to messages
          }}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, RotateCcw, Ban, Flag, Users } from "lucide-react";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MatchProfile() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { toast } = useToast();
  const [showUndoDialog, setShowUndoDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: [`/api/profiles/${id}`],
  });

  const handlePhotoNavigation = (direction: 'prev' | 'next') => {
    if (!profile?.photos || profile.photos.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
    } else {
      setCurrentPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
    }
  };

  // Mutation para desfazer match
  const undoMatchMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/matches/${profile?.userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      toast({
        title: "Match desfeito",
        description: "O match foi desfeito com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setLocation("/matches");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível desfazer o match.",
        variant: "destructive",
      });
    },
  });

  // Mutation para bloquear
  const blockMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/block/${profile?.userId}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Usuário bloqueado",
        description: `${profile?.name} foi bloqueado com sucesso.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      setLocation("/matches");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível bloquear este usuário.",
        variant: "destructive",
      });
    },
  });

  // Mutation para denunciar
  const reportMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/report/${profile?.userId}`, {
        method: "POST",
        body: {
          reason: "Comportamento inapropriado",
        },
      });
    },
    onSuccess: () => {
      toast({
        title: "Denúncia enviada",
        description: "Obrigado pela sua denúncia. Vamos analisá-la.",
      });
      setLocation("/matches");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a denúncia.",
        variant: "destructive",
      });
    },
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${profile?.name}`,
          text: `Confira o perfil de ${profile?.name} no MIX!`,
          url: window.location.href,
        });
        toast({
          title: "Compartilhado!",
          description: "Perfil compartilhado com sucesso.",
        });
      } catch (error) {
        // Usuário cancelou o compartilhamento
      }
    } else {
      // Copiar link para clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "Link do perfil copiado para a área de transferência.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="text-center">
          <p className="text-white">Perfil não encontrado</p>
          <Button
            onClick={() => setLocation("/matches")}
            className="mt-4 bg-white text-blue-900 hover:bg-gray-100"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const photos = profile.photos && profile.photos.length > 0 
    ? profile.photos 
    : [`https://ui-avatars.com/api/?name=${profile.name}&background=ec4899&color=fff&size=800`];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-auto">
      {/* Header - Botão voltar */}
      <div className="sticky top-0 z-50 p-4">
        <Button
          onClick={() => setLocation("/matches")}
          variant="ghost"
          size="icon"
          className="bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Foto do perfil */}
      <div className="px-6 mb-6">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <img
            src={photos[currentPhotoIndex]}
            alt={profile.name}
            className="w-full aspect-[3/4] object-cover"
            data-testid="img-profile-photo"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://ui-avatars.com/api/?name=${profile.name}&background=ec4899&color=fff&size=800`;
            }}
          />
          
          {/* Áreas clicáveis para navegação de fotos */}
          {photos.length > 1 && (
            <>
              <div 
                className="absolute left-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePhotoNavigation('prev');
                }}
                data-testid="area-prev-photo"
              />
              <div 
                className="absolute right-0 top-0 bottom-0 w-1/2 cursor-pointer z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePhotoNavigation('next');
                }}
                data-testid="area-next-photo"
              />
            </>
          )}

          {/* Barra de progresso de fotos */}
          {photos.length > 1 && (
            <div className="absolute top-2 left-2 right-2 z-20 flex gap-1.5">
              {photos.map((_, index) => (
                <div 
                  key={index} 
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  data-testid={`photo-indicator-${index}`}
                >
                  <div 
                    className={`h-full bg-white transition-all duration-300 ${
                      index === currentPhotoIndex ? 'w-full' : index < currentPhotoIndex ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Informações sobrepostas na foto */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-white text-3xl font-bold drop-shadow-lg" data-testid="text-profile-name">
                {profile.name}
              </h1>
              <span className="text-white text-2xl drop-shadow-lg">
                {profile.age}
              </span>
              {profile.isVerified && (
                <VerifiedBadge className="w-6 h-6 drop-shadow-lg" />
              )}
            </div>

            {profile.location && (
              <p className="text-white/90 text-sm drop-shadow-lg">
                📍 {profile.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="px-6 mb-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-semibold mb-3">Sobre mim</h3>
            <p className="text-white text-base leading-relaxed" data-testid="text-bio">
              {profile.bio}
            </p>
          </div>
        </div>
      )}

      {/* Interesses */}
      {profile.interests && profile.interests.length > 0 && (
        <div className="px-6 mb-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-white/70 text-sm font-semibold mb-3">Interesses</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => {
                const colors = [
                  'bg-gradient-to-r from-pink-500 to-rose-500',
                  'bg-gradient-to-r from-purple-500 to-indigo-500',
                  'bg-gradient-to-r from-blue-500 to-cyan-500',
                  'bg-gradient-to-r from-green-500 to-emerald-500',
                  'bg-gradient-to-r from-orange-500 to-amber-500',
                  'bg-gradient-to-r from-violet-500 to-purple-500',
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <span 
                    key={index}
                    className={`px-4 py-2 ${colorClass} text-white rounded-full text-sm font-medium shadow-lg`}
                    data-testid={`interest-${index}`}
                  >
                    {interest}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Seção Amigos em Comum */}
      <div className="px-6 mb-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-white/70" />
            <h3 className="text-white/70 text-sm font-semibold">Amigos em comum</h3>
          </div>
          <p className="text-white text-base">Usando o Amigos em comum</p>
        </div>
      </div>

      {/* Botão: Compartilhar perfil */}
      <div className="px-6 mb-3">
        <button
          onClick={handleShare}
          className="w-full bg-white/5 backdrop-blur-sm rounded-2xl py-5 text-center text-white text-lg font-medium hover:bg-white/10 transition-all"
          data-testid="button-share"
        >
          Compartilhar perfil de {profile.name}
        </button>
      </div>

      {/* Botão: Desfazer match */}
      <div className="px-6 mb-3">
        <button
          onClick={() => setShowUndoDialog(true)}
          className="w-full bg-white/5 backdrop-blur-sm rounded-2xl py-5 text-center text-white text-lg font-medium hover:bg-white/10 transition-all"
          data-testid="button-undo-match"
        >
          Desfazer match
        </button>
      </div>

      {/* Botão: Bloquear */}
      <div className="px-6 mb-3">
        <button
          onClick={() => setShowBlockDialog(true)}
          className="w-full bg-white/5 backdrop-blur-sm rounded-2xl py-5 text-center text-white text-lg font-medium hover:bg-white/10 transition-all"
          data-testid="button-block"
        >
          Bloquear {profile.name}
        </button>
      </div>

      {/* Botão: Denunciar */}
      <div className="px-6 mb-8">
        <button
          onClick={() => setShowReportDialog(true)}
          className="w-full bg-white/5 backdrop-blur-sm rounded-2xl py-5 text-center text-red-400 text-lg font-medium hover:bg-white/10 transition-all"
          data-testid="button-report"
        >
          Denunciar {profile.name}
        </button>
      </div>

      {/* Dialog: Desfazer Match */}
      <AlertDialog open={showUndoDialog} onOpenChange={setShowUndoDialog}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Desfazer match?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Você tem certeza que deseja desfazer o match com {profile.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 border-0">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                undoMatchMutation.mutate();
                setShowUndoDialog(false);
              }}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={undoMatchMutation.isPending}
            >
              {undoMatchMutation.isPending ? "Desfazendo..." : "Desfazer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Bloquear */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Bloquear {profile.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Você não verá mais o perfil desta pessoa e ela não poderá ver o seu. Esta ação pode ser desfeita nas configurações.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 border-0">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                blockMutation.mutate();
                setShowBlockDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={blockMutation.isPending}
            >
              {blockMutation.isPending ? "Bloqueando..." : "Bloquear"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Denunciar */}
      <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <AlertDialogContent className="bg-gray-900 text-white border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Denunciar {profile.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Sua denúncia é anônima. Analisaremos o perfil e tomaremos as medidas necessárias.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 border-0">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                reportMutation.mutate();
                setShowReportDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={reportMutation.isPending}
            >
              {reportMutation.isPending ? "Denunciando..." : "Denunciar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

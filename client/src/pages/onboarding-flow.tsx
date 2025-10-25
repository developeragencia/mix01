import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import mixLogo from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function OnboardingFlow() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-preencher nome se já existir
  useEffect(() => {
    if (user?.firstName) {
      setName(user.firstName);
    } else if (user?.username) {
      setName(user.username);
    }
  }, [user]);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/';
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) return null;

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, digite seu nome",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Salvar apenas o nome
      const response = await apiRequest(`/api/profiles/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: name.trim(),
          name: name.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar nome');
      }

      // Invalidar cache
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Ir para próxima etapa
      setStep(2);
      setIsSubmitting(false);

    } catch (error: any) {
      console.error('Erro ao salvar nome:', error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Por favor, tente novamente.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const handleGoToEditProfile = () => {
    window.location.href = '/edit-profile';
  };

  // ETAPA 1: Nome
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
        {/* Header com Logo */}
        <div className="p-6 flex justify-center">
          <img src={mixLogo} alt="MIX" className="h-12" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Qual é o seu nome?
              </h1>
              <p className="text-white/80 text-lg">
                Este nome aparecerá no seu perfil
              </p>
            </div>

            <div className="space-y-6">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome"
                className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50"
                maxLength={50}
                data-testid="input-name"
              />

              <Button
                onClick={handleSaveName}
                disabled={!name.trim() || isSubmitting}
                className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full"
                data-testid="button-save-name"
              >
                {isSubmitting ? "Salvando..." : "Continuar"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ETAPA 2: Boas-vindas
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
        {/* Header com Logo */}
        <div className="p-6 flex justify-center">
          <img src={mixLogo} alt="MIX" className="h-12" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-white">
                Que bom te ver por aqui,
              </h1>
              <h2 className="text-4xl font-bold text-white">
                {name}!
              </h2>
              <p className="text-xl text-white/90 mt-6">
                Tem muita gente pra você conhecer.
              </p>
              <p className="text-xl text-white/90">
                Mas vamos configurar seu perfil primeiro
              </p>
            </div>

            <Button
              onClick={handleGoToEditProfile}
              className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full mt-12"
              data-testid="button-bora-la"
            >
              Bora lá
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

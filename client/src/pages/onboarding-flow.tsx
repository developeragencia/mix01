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
  const [birthDate, setBirthDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-preencher dados se já existirem
  useEffect(() => {
    if (user?.firstName) {
      setName(user.firstName);
    } else if (user?.username) {
      setName(user.username);
    }
    
    // Pré-preencher data de nascimento se já existir
    if (user?.birthDate) {
      // Converter YYYY-MM-DD para DD/MM/YYYY
      const [year, month, day] = user.birthDate.split('-');
      setBirthDate(`${day}/${month}/${year}`);
    }
  }, [user]);

  // ✅ CORREÇÃO: Redirecionar se não autenticado OU se perfil já completo
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        console.log("❌ Usuário não autenticado - redirecionando para /");
        window.location.href = '/';
      } else if (user.isProfileComplete === true) {
        console.log("✅ Perfil já completo - redirecionando para /discover");
        window.location.href = '/discover';
      }
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
      // Salvar o nome no usuário e perfil
      const response = await apiRequest(`/api/profiles/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: name.trim(),
          name: name.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar nome');
      }

      console.log("✅ Nome salvo com sucesso!");

      // Invalidar cache e aguardar atualização
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Aguardar um pouco para garantir que o cache foi atualizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

  const handleSaveBirthDate = async () => {
    // Validar formato DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = birthDate.match(dateRegex);
    
    if (!match) {
      toast({
        title: "Data inválida",
        description: "Por favor, use o formato DD/MM/AAAA",
        variant: "destructive"
      });
      return;
    }

    const [, day, month, year] = match;
    const birthDateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    // Validar se é uma data válida
    if (isNaN(birthDateObj.getTime())) {
      toast({
        title: "Data inválida",
        description: "Por favor, insira uma data válida",
        variant: "destructive"
      });
      return;
    }

    // Validar idade mínima (18 anos)
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    if (age < 18) {
      toast({
        title: "Idade mínima não atingida",
        description: "Você precisa ter pelo menos 18 anos para usar o app",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Converter DD/MM/YYYY para YYYY-MM-DD
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      
      const response = await apiRequest(`/api/profiles/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          birthDate: formattedDate
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar data de nascimento');
      }

      console.log("✅ Data de nascimento salva com sucesso!");

      // Invalidar cache e aguardar atualização
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Aguardar um pouco para garantir que o cache foi atualizado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Ir para próxima etapa
      setStep(3);
      setIsSubmitting(false);

    } catch (error: any) {
      console.error('Erro ao salvar data de nascimento:', error);
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

  // ETAPA 2: Data de Nascimento
  if (step === 2) {
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
                Qual é a sua data de nascimento?
              </h1>
              <p className="text-white/80 text-lg">
                Sua idade será calculada automaticamente
              </p>
            </div>

            <div className="space-y-6">
              <Input
                type="text"
                value={birthDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                  }
                  if (value.length >= 5) {
                    value = value.slice(0, 5) + '/' + value.slice(5, 9);
                  }
                  setBirthDate(value);
                }}
                placeholder="DD/MM/AAAA"
                className="h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 text-center"
                maxLength={10}
                data-testid="input-birthdate"
              />

              <Button
                onClick={handleSaveBirthDate}
                disabled={birthDate.length !== 10 || isSubmitting}
                className="w-full h-14 text-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-full"
                data-testid="button-save-birthdate"
              >
                {isSubmitting ? "Salvando..." : "Continuar"}
              </Button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-white/60 hover:text-white transition-colors text-sm"
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ETAPA 3: Boas-vindas
  if (step === 3) {
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

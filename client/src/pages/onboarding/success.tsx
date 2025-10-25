import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function OnboardingSuccess() {
  const { user, isLoading } = useAuth();
  
  // Proteção: redirecionar se não autenticado
  if (!isLoading && !user) {
    console.log("🔴 Usuário não autenticado, redirecionando para login...");
    window.location.href = '/';
    return null;
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }
  
  const handleStart = () => {
    console.log("✅ Botão 'Começar a explorar' clicado!");
    
    // Limpar localStorage
    const keysToRemove = [
      'onboarding_name', 'onboarding_birthday', 'onboarding_gender',
      'onboarding_orientation', 'onboarding_show_me', 'onboarding_looking_for',
      'onboarding_distance', 'onboarding_personality', 'onboarding_interests',
      'onboarding_photos'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Navegar para discover com reload forçado
    console.log("✅ Navegando para /discover...");
    window.location.href = "/discover";
  };

  const handleLater = () => {
    console.log("✅ Botão 'Talvez mais tarde' clicado!");
    
    // Limpar localStorage
    const keysToRemove = [
      'onboarding_name', 'onboarding_birthday', 'onboarding_gender',
      'onboarding_orientation', 'onboarding_show_me', 'onboarding_looking_for',
      'onboarding_distance', 'onboarding_personality', 'onboarding_interests',
      'onboarding_photos'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Navegar para discover com reload forçado
    console.log("✅ Navegando para /discover...");
    window.location.href = "/discover";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-6 text-center">
      {/* Ícone de festa */}
      <div className="mb-12">
        <PartyPopper className="w-48 h-48 text-white/80 mx-auto" />
      </div>

      {/* Título e Descrição */}
      <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
        Você conseguiu.<br />
        Check in e encontre perfis próximos!
      </h1>
      
      <p className="text-white/90 text-lg md:text-xl mb-12 max-w-2xl">
        Descubra pessoas incríveis perto de você e comece a fazer conexões reais!
      </p>

      {/* Indicadores de progresso */}
      <div className="flex justify-center gap-2 mb-12">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
      </div>

      {/* Botões */}
      <div className="w-full max-w-md space-y-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleStart();
          }}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-7 rounded-full text-lg shadow-2xl transition-all hover:scale-105 cursor-pointer"
          data-testid="button-start"
        >
          Começar a explorar
        </button>
        
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLater();
          }}
          className="w-full text-white font-semibold text-lg hover:text-white/80 transition-colors py-3 cursor-pointer"
          data-testid="button-skip"
        >
          Talvez mais tarde
        </button>
      </div>
    </div>
  );
}

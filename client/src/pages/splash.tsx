import { useEffect } from "react";
import { useLocation } from "wouter";
import mixLogo from "@assets/FAVICON_1752848384518_1760915867705.png";

export default function Splash() {
  const [currentPath, setLocation] = useLocation();

  useEffect(() => {
    // ⚡ IMPORTANTE: Só fazer redirect se estivermos EXATAMENTE na rota "/"
    // Se o usuário está em outra página e atualiza, não interferir
    if (currentPath !== "/") {
      console.log("🔵 Splash: Usuário não está em '/', mantendo na página atual:", currentPath);
      return;
    }

    // ✅ Verificar auth APENAS quando estamos na rota raiz "/"
    const checkAuthAndRedirect = async () => {
      try {
        console.log("🔵 Splash: Iniciando verificação de autenticação...");
        
        const response = await fetch("/api/auth/user", {
          credentials: 'include'
        });
        
        console.log("🔵 Splash: Response status:", response.status);
        
        if (response.ok) {
          const user = await response.json();
          
          console.log("✅ Splash: Usuário encontrado", {
            id: user.id,
            email: user.email,
            isProfileComplete: user.isProfileComplete,
            birthDate: !!user.birthDate,
            gender: !!user.gender,
            photos: user.photos?.length,
            interestedIn: user.interestedIn?.length
          });
          
          // ✅ CORREÇÃO CRÍTICA: Se perfil completo, ir direto para discover
          if (user && user.isProfileComplete === true) {
            console.log("✅ Perfil completo - redirecionando para /discover");
            setLocation("/discover");
          } else if (user && user.isProfileComplete === false) {
            console.log("⚠️ Perfil incompleto - redirecionando para /onboarding-flow");
            setLocation("/onboarding-flow");
          } else if (user && user.isProfileComplete === undefined) {
            console.log("⚠️ isProfileComplete undefined - redirecionando para /onboarding-flow");
            setLocation("/onboarding-flow");
          } else {
            // Sem usuário - mostrar welcome-1 após 2 segundos
            console.log("❌ Sem usuário - redirecionando para /welcome-1");
            setTimeout(() => setLocation("/welcome-1"), 2000);
          }
        } else {
          // Não autenticado - mostrar welcome-1 após 2 segundos
          console.log("❌ Não autenticado (status", response.status, ") - redirecionando para /welcome-1");
          setTimeout(() => setLocation("/welcome-1"), 2000);
        }
      } catch (error) {
        console.error("❌ Erro ao verificar auth na splash:", error);
        setTimeout(() => setLocation("/welcome-1"), 2000);
      }
    };

    checkAuthAndRedirect();
  }, [currentPath, setLocation]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
      <img 
        src={mixLogo} 
        alt="MIX" 
        className="w-48 h-auto"
        data-testid="img-splash-logo"
      />
    </div>
  );
}

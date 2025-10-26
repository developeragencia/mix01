import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  subscriptionType?: 'free' | 'premium' | 'vip';
  isProfileComplete?: boolean;
  // Campos do perfil para onboarding
  birthDate?: string;
  gender?: string;
  sexualOrientation?: string[];
  interestedIn?: string[];
  relationshipGoals?: string;
  communicationStyle?: string;
  educationLevel?: string;
  starSign?: string;
  loveStyle?: string;
  interests?: string[];
  photos?: string[];
}

export function useAuth() {
  const queryClient = useQueryClient();

  // Verificar se usuário está autenticado
  const { data: user, isLoading, error, isFetching } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: 0, // ✅ Sem retry - falha rápido se não autenticado
    refetchOnWindowFocus: false, // ⚡ Desabilitar refetch ao focar - melhora performance
    refetchOnMount: false, // ⚡ Não refetch ao montar se já tem dados em cache
    staleTime: 15 * 60 * 1000, // ⚡ 15 minutos - dados mais duráveis
    gcTime: 30 * 60 * 1000, // ⚡ 30 minutos - mantém mais tempo em cache
    queryFn: async () => {
      console.log("🔐 useAuth: Verificando autenticação...");
      const response = await fetch("/api/auth/user", {
        credentials: 'include'
      });
      if (response.status === 401) {
        console.log("❌ useAuth: Não autenticado (401)");
        return null; // ✅ Retorna null ao invés de lançar erro
      }
      if (!response.ok) {
        console.log("❌ useAuth: Erro na requisição:", response.status);
        throw new Error('Request failed');
      }
      const userData = await response.json();
      console.log("✅ useAuth: Usuário autenticado:", {
        id: userData.id,
        email: userData.email,
        isProfileComplete: userData.isProfileComplete
      });
      return userData;
    }
  });

  // ⚡ IMPORTANTE: Considerar "loading" se está fetching OU se não tem dados E não tem erro
  // Isso evita que páginas redirecionem durante o carregamento inicial
  const isActuallyLoading = isLoading || isFetching || (!user && !error);

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        return await apiRequest("/api/auth/logout", { method: "POST" });
      } catch (error) {
        // Silent error handling - always return success
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }
    },
    onSuccess: () => {
      try {
        // Limpar todos os dados em cache
        queryClient.clear();
        // Recarregar a página para reset completo
        window.location.href = "/";
      } catch (error) {
        // Silent error handling
        window.location.href = "/";
      }
    },
    onError: () => {
      // Silent error handling - still redirect on error
      try {
        queryClient.clear();
        window.location.href = "/";
      } catch (error) {
        window.location.href = "/";
      }
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user: user as User | null,
    isAuthenticated: !!user && !error,
    isLoading: isActuallyLoading, // ⚡ Usar loading aprimorado
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}
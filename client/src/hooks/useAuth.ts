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
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: 0, // ✅ Sem retry - falha rápido se não autenticado
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    queryFn: async () => {
      const response = await fetch("/api/auth/user", {
        credentials: 'include'
      });
      if (response.status === 401) {
        return null; // ✅ Retorna null ao invés de lançar erro
      }
      if (!response.ok) {
        throw new Error('Request failed');
      }
      return await response.json();
    }
  });

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
    isLoading,
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
}
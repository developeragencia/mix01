import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function AuthStatus() {
  const { data, isLoading, refetch } = useQuery<any>({
    queryKey: ['/api/auth/me'],
  });

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleEmailRegister = () => {
    window.location.href = '/register';
  };

  const handleCreateProfile = () => {
    window.location.href = '/create-profile';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Verificando autenticação...</div>
      </div>
    );
  }

  const isAuthenticated = data?.authenticated || false;
  const hasProfile = data?.profile !== null && data?.profile !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">Status de Autenticação</h1>
          <p className="text-lg opacity-90">Diagnóstico completo do sistema</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Estado Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {isAuthenticated ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">✅ Autenticado</p>
                    <p className="text-sm text-gray-600">
                      Email: {data?.user?.email || 'N/A'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">❌ Não Autenticado</p>
                    <p className="text-sm text-gray-600">Faça login para continuar</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {hasProfile ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">✅ Perfil Criado</p>
                    <p className="text-sm text-gray-600">
                      Nome: {data?.profile?.name || 'N/A'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-900">⚠️ Sem Perfil</p>
                    <p className="text-sm text-gray-600">Complete seu perfil para continuar</p>
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                onClick={() => refetch()} 
                className="w-full"
                variant="outline"
                data-testid="button-refresh"
              >
                🔄 Atualizar Status
              </Button>

              {!isAuthenticated && (
                <>
                  <Button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-red-600 hover:bg-red-700"
                    data-testid="button-google"
                  >
                    Login com Google
                  </Button>
                  <Button 
                    onClick={handleEmailRegister}
                    className="w-full"
                    data-testid="button-email"
                  >
                    Cadastrar com Email
                  </Button>
                </>
              )}

              {isAuthenticated && !hasProfile && (
                <Button 
                  onClick={handleCreateProfile}
                  className="w-full bg-green-600 hover:bg-green-700"
                  data-testid="button-create-profile"
                >
                  Criar Perfil
                </Button>
              )}

              {isAuthenticated && hasProfile && (
                <Button 
                  onClick={() => window.location.href = '/discover'}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  data-testid="button-discover"
                >
                  Ir para Descobrir
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Dados Completos (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto p-4 bg-black text-green-400 rounded">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

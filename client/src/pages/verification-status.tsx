import { useEffect } from "react";
import { useLocation } from "wouter";
import { Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";

interface Verification {
  id?: number;
  isVerified: boolean;
  status?: 'pending' | 'approved' | 'rejected' | 'none';
  rejectionReason?: string;
  submittedAt?: string;
  verifiedAt?: string;
}

export default function VerificationStatus() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  // ✅ Polling a cada 5 segundos para verificar mudanças de status
  const { data: verification, isLoading, error } = useQuery<Verification>({
    queryKey: ['/api/verification/status'],
    enabled: !!user?.id && !authLoading, // ✅ Só habilitar se auth estiver pronto
    refetchInterval: 5000,
    retry: 1,
    retryDelay: 1000,
  });

  // ✅ Log para debug
  useEffect(() => {
    if (verification) {
      console.log("📋 Status de verificação:", {
        isVerified: verification.isVerified,
        status: verification.status,
        submittedAt: verification.submittedAt,
        verifiedAt: verification.verifiedAt
      });
    }
  }, [verification]);

  // ✅ Redirect se não autenticado (CORRIGIDO: usar authLoading)
  useEffect(() => {
    if (!authLoading && !user) {
      console.log("❌ Usuário não autenticado, redirecionando...");
      setLocation('/login');
    }
  }, [authLoading, user, setLocation]);

  // ✅ Mostrar loading se auth ou verificação estão carregando
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-sm">
            {authLoading ? 'Verificando autenticação...' : 'Carregando status...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
        <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/profile')}
              className="text-white hover:bg-white/20 w-10 h-10 p-0 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-white text-lg font-bold flex-1 text-center">Status da Verificação</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-red-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-500/30 text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold mb-4">Erro ao Carregar</h2>
            <p className="text-red-200 mb-6">
              Não foi possível carregar o status da verificação.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/20 w-10 h-10 p-0 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-lg font-bold flex-1 text-center">Status da Verificação</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        {/* ✅ Status: Pendente */}
        {verification?.status === 'pending' && (
          <div className="bg-yellow-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-yellow-500/30 text-center animate-fade-in">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
              <div className="relative bg-yellow-900/50 rounded-full w-24 h-24 flex items-center justify-center">
                <Clock className="w-12 h-12 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">⏳ Em Análise</h2>
            <p className="text-yellow-200 text-lg mb-6">
              Sua documentação está sendo verificada pela nossa equipe
            </p>
            <div className="bg-yellow-900/30 rounded-2xl p-4 mb-6">
              <p className="text-yellow-100 text-sm mb-2">
                ⏰ <strong>Tempo estimado:</strong> até 24 horas
              </p>
              {verification.submittedAt && (
                <p className="text-yellow-300 text-sm">
                  📅 Enviado em: {new Date(verification.submittedAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
            <div className="space-y-2 mb-6">
              <p className="text-yellow-200 text-sm">📧 Você será notificado por email</p>
              <p className="text-yellow-200 text-sm">🔔 Acompanhe aqui o status</p>
            </div>
            <Button
              onClick={() => setLocation('/profile')}
              variant="outline"
              className="w-full h-12 border-yellow-500 text-yellow-400 hover:bg-yellow-900/20 rounded-full"
            >
              Voltar ao Perfil
            </Button>
          </div>
        )}

        {/* ✅ Status: Aprovado / Verificado */}
        {(verification?.isVerified || verification?.status === 'approved') && (
          <div className="bg-green-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-green-500/30 text-center animate-fade-in">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
              <div className="relative bg-green-900/50 rounded-full w-24 h-24 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">✅ Verificado!</h2>
            <p className="text-green-200 text-lg mb-6">
              Parabéns! Seu perfil foi verificado com sucesso
            </p>
            <div className="bg-green-900/30 rounded-2xl p-4 mb-6 space-y-2">
              <p className="text-green-100 text-sm">🎉 Você agora tem o selo azul</p>
              <p className="text-green-100 text-sm">🔥 Mais visibilidade no app</p>
              <p className="text-green-100 text-sm">💫 Maior confiança dos usuários</p>
            </div>
            {verification.verifiedAt && (
              <p className="text-green-300 text-sm mb-6">
                📅 Verificado em: {new Date(verification.verifiedAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
            <Button
              onClick={() => setLocation('/profile')}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full text-lg shadow-lg"
            >
              Ver Meu Perfil Verificado
            </Button>
          </div>
        )}

        {/* ✅ Status: Rejeitado */}
        {verification?.status === 'rejected' && (
          <div className="bg-red-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-500/30 text-center animate-fade-in">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="relative bg-red-900/50 rounded-full w-24 h-24 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">❌ Verificação Negada</h2>
            <p className="text-red-200 text-lg mb-6">
              Não foi possível verificar sua identidade
            </p>
            {verification.rejectionReason && (
              <div className="bg-red-900/30 rounded-2xl p-4 mb-6">
                <p className="text-red-100 text-sm font-semibold mb-2">📋 Motivo:</p>
                <p className="text-red-200 text-sm">{verification.rejectionReason}</p>
              </div>
            )}
            <div className="bg-red-900/20 rounded-2xl p-4 mb-6">
              <p className="text-red-100 text-sm mb-2">💡 Dicas para nova tentativa:</p>
              <ul className="text-red-200 text-sm text-left space-y-1 pl-4">
                <li>• Documento legível e sem reflexos</li>
                <li>• Selfie bem iluminada</li>
                <li>• Rosto claramente visível</li>
                <li>• Sem óculos escuros ou acessórios</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => setLocation('/verification')}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
              >
                Tentar Novamente
              </Button>
              <Button
                onClick={() => setLocation('/profile')}
                variant="outline"
                className="w-full h-12 border-red-500 text-red-400 hover:bg-red-900/20 rounded-full"
              >
                Voltar ao Perfil
              </Button>
            </div>
          </div>
        )}

        {/* ✅ Status: Nenhum / None */}
        {(!verification?.status || verification?.status === 'none') && !verification?.isVerified && (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center animate-fade-in">
            <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-4">Nenhuma Verificação Pendente</h2>
            <p className="text-gray-300 mb-6">
              Você ainda não iniciou o processo de verificação
            </p>
            <div className="bg-blue-900/20 rounded-2xl p-4 mb-6">
              <p className="text-blue-200 text-sm mb-2">🎯 Benefícios da verificação:</p>
              <ul className="text-blue-300 text-sm text-left space-y-1 pl-4">
                <li>• Selo azul no perfil</li>
                <li>• Mais matches e curtidas</li>
                <li>• Maior confiança dos usuários</li>
                <li>• Destaque no app</li>
              </ul>
            </div>
            <Button
              onClick={() => setLocation('/verification')}
              className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
            >
              Iniciar Verificação
            </Button>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}


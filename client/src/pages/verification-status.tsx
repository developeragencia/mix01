import { useLocation } from "wouter";
import { Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import BottomNavigation from "@/components/BottomNavigation";

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

  const { data: verification, isLoading } = useQuery<Verification>({
    queryKey: ['/api/verification/status'],
    refetchInterval: 5000, // Poll a cada 5 segundos
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

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
        {/* Pendente */}
        {verification?.status === 'pending' && (
          <div className="bg-yellow-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-yellow-500/30 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full animate-ping"></div>
              <div className="relative bg-yellow-900/50 rounded-full w-24 h-24 flex items-center justify-center">
                <Clock className="w-12 h-12 text-yellow-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">Analisando...</h2>
            <p className="text-yellow-200 text-lg mb-6">
              Sua documentação está sendo verificada pela nossa equipe
            </p>
            <div className="bg-yellow-900/30 rounded-2xl p-4 mb-6">
              <p className="text-yellow-100 text-sm">
                ⏰ Tempo estimado: até 24 horas
              </p>
            </div>
            {verification.submittedAt && (
              <p className="text-yellow-300 text-sm">
                Enviado em: {new Date(verification.submittedAt).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        )}

        {/* Aprovado */}
        {(verification?.isVerified || verification?.status === 'approved') && (
          <div className="bg-green-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-green-500/30 text-center">
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
                Verificado em: {new Date(verification.verifiedAt).toLocaleString('pt-BR')}
              </p>
            )}
            <Button
              onClick={() => setLocation('/profile')}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full text-lg shadow-lg"
            >
              Ver Meu Perfil
            </Button>
          </div>
        )}

        {/* Rejeitado */}
        {verification?.status === 'rejected' && (
          <div className="bg-red-900/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-500/30 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="relative bg-red-900/50 rounded-full w-24 h-24 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-400" />
              </div>
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">Verificação Negada</h2>
            <p className="text-red-200 text-lg mb-6">
              Não foi possível verificar sua identidade
            </p>
            {verification.rejectionReason && (
              <div className="bg-red-900/30 rounded-2xl p-4 mb-6">
                <p className="text-red-100 text-sm font-semibold mb-2">Motivo:</p>
                <p className="text-red-200 text-sm">{verification.rejectionReason}</p>
              </div>
            )}
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
                className="w-full h-14 border-red-500 text-red-400 hover:bg-red-900/20 rounded-full text-lg"
              >
                Voltar ao Perfil
              </Button>
            </div>
          </div>
        )}

        {/* Nenhum status */}
        {!verification?.status || verification?.status === 'none' && (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-white/10 text-center">
            <h2 className="text-white text-2xl font-bold mb-4">Nenhuma Verificação Pendente</h2>
            <p className="text-gray-300 mb-6">
              Você ainda não iniciou o processo de verificação
            </p>
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


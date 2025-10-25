import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, CheckCircle, Upload, Shield, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BottomNavigation from "@/components/BottomNavigation";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

interface Verification {
  isVerified: boolean;
  verificationMethod?: string;
  verifiedAt?: string;
}

export default function Verification() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: verification, isLoading, error } = useQuery<Verification>({
    queryKey: ['/api/verification/status'],
    enabled: !!user?.id,
    retry: false,
  });

  const requestVerificationMutation = useMutation({
    mutationFn: async (data: { method: string; images: string[] }) => {
      const res = await fetch('/api/verification/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Falha ao enviar verificação');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profiles', user?.id] });
      toast({
        title: "Verificação enviada!",
        description: "Sua selfie foi enviada e será analisada em breve.",
      });
      setSelectedImage(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a verificação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast({
        title: "Nenhuma foto selecionada",
        description: "Por favor, tire uma selfie primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await requestVerificationMutation.mutateAsync({
        method: 'selfie',
        images: [selectedImage],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-lg font-bold flex-1 text-center">Verificação de Perfil</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-6 pt-6">
        {verification?.isVerified ? (
          <div className="bg-green-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 text-center" data-testid="card-verified">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold mb-2">Perfil Verificado!</h2>
            <p className="text-green-200 mb-4">
              Seu perfil foi verificado com sucesso.
            </p>
            {verification.verifiedAt && (
              <p className="text-green-300 text-sm">
                Verificado em: {new Date(verification.verifiedAt).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="bg-blue-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10" data-testid="card-info">
              <div className="flex items-start gap-4 mb-4">
                <Shield className="w-12 h-12 text-blue-400 flex-shrink-0" />
                <div>
                  <h2 className="text-white text-xl font-bold mb-2">Por que verificar?</h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    O selo de verificação azul ajuda outros usuários a confiar que você é uma pessoa real.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white text-sm">Mais matches e likes</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white text-sm">Maior confiança dos usuários</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white text-sm">Selo azul no seu perfil</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10" data-testid="card-instructions">
              <h3 className="text-white font-bold text-lg mb-4">Como funciona:</h3>
              <ol className="space-y-3 text-gray-300 text-sm">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
                  <span>Tire uma selfie clara do seu rosto</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                  <span>Certifique-se de estar bem iluminado</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
                  <span>Envie a foto para análise</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">4</span>
                  <span>Receba o selo azul em até 24 horas</span>
                </li>
              </ol>
            </div>

            {selectedImage ? (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10" data-testid="card-preview">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Sua selfie:</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    data-testid="button-remove-photo"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden mb-4">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    data-testid="img-preview"
                  />
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Enviando..." : "Enviar para Verificação"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleImageSelect}
                  className="hidden"
                  data-testid="input-file"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
                  data-testid="button-take-selfie"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Tirar Selfie
                </Button>

                <Button
                  onClick={() => {
                    const input = fileInputRef.current;
                    if (input) {
                      input.removeAttribute('capture');
                      input.click();
                    }
                  }}
                  variant="outline"
                  className="w-full h-14 bg-gray-900/50 border-white/20 text-white hover:bg-gray-900/70 font-bold rounded-full text-lg"
                  data-testid="button-upload-photo"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Escolher da Galeria
                </Button>
              </div>
            )}

            <div className="bg-yellow-900/30 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/30" data-testid="card-warning">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-yellow-200 font-semibold text-sm mb-1">Importante:</h4>
                  <p className="text-yellow-100 text-xs leading-relaxed">
                    Sua foto será comparada com as fotos do seu perfil para confirmar sua identidade. 
                    Certifique-se de que seu rosto está claramente visível.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <button
            onClick={() => setLocation('/profile')}
            className="text-gray-400 hover:text-white text-sm underline"
            data-testid="link-back-to-profile"
          >
            Voltar ao perfil
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, CheckCircle, Upload, Shield, AlertCircle, X, Clock, FileText, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BottomNavigation from "@/components/BottomNavigation";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

interface Verification {
  id?: number;
  isVerified: boolean;
  verificationMethod?: string;
  verifiedAt?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'none'; // ✅ Novo campo
  rejectionReason?: string; // ✅ Novo campo
  submittedAt?: string; // ✅ Novo campo
  documentImage?: string; // ✅ Novo campo
  selfieImage?: string; // ✅ Novo campo
}

export default function Verification() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<'document' | 'selfie' | 'review'>('document');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);

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

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setSelectedDocument(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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

  // ✅ Abrir câmera
  const openCamera = async () => {
    try {
      setIsCameraLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 720 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      toast({
        title: "Erro ao acessar câmera",
        description: "Permita o acesso à câmera para tirar a selfie.",
        variant: "destructive",
      });
    } finally {
      setIsCameraLoading(false);
    }
  };

  // ✅ Fechar câmera
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  // ✅ Cleanup: Fechar câmera ao desmontar componente ou mudar de step
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentStep]);

  // ✅ Tirar foto
  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setSelectedImage(imageData);
        closeCamera();
        
        toast({
          title: "Foto capturada!",
          description: "Selfie tirada com sucesso.",
        });
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 'document' && selectedDocument) {
      setCurrentStep('selfie');
    } else if (currentStep === 'selfie' && selectedImage) {
      setCurrentStep('review');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage || !selectedDocument) {
      toast({
        title: "Documentos incompletos",
        description: "Por favor, envie o documento e a selfie.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await requestVerificationMutation.mutateAsync({
        method: 'document_selfie',
        images: [selectedDocument, selectedImage],
      });
      // Redirecionar para página de status
      setLocation('/verification-status');
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
        {/* ✅ Status: Pendente */}
        {verification?.status === 'pending' && (
          <div className="bg-yellow-900/50 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 text-center" data-testid="card-pending">
            <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h2 className="text-white text-2xl font-bold mb-2">Verificação em Análise</h2>
            <p className="text-yellow-200 mb-4">
              Sua solicitação está sendo analisada. Isso pode levar até 24 horas.
            </p>
            {verification.submittedAt && (
              <p className="text-yellow-300 text-sm">
                Enviado em: {new Date(verification.submittedAt).toLocaleDateString('pt-BR')}
              </p>
            )}
            <Button
              onClick={() => setLocation('/profile')}
              variant="outline"
              className="mt-4 border-yellow-500 text-yellow-400 hover:bg-yellow-900/20"
            >
              Voltar ao Perfil
            </Button>
          </div>
        )}

        {/* ✅ Status: Rejeitado */}
        {verification?.status === 'rejected' && (
          <div className="bg-red-900/50 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 text-center" data-testid="card-rejected">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-white text-2xl font-bold mb-2">Verificação Rejeitada</h2>
            <p className="text-red-200 mb-4">
              Infelizmente, não foi possível verificar sua identidade.
            </p>
            {verification.rejectionReason && (
              <div className="bg-red-900/30 rounded-xl p-4 mb-4">
                <p className="text-red-100 text-sm font-semibold mb-1">Motivo:</p>
                <p className="text-red-200 text-sm">{verification.rejectionReason}</p>
              </div>
            )}
            <Button
              onClick={() => {
                setSelectedDocument(null);
                setSelectedImage(null);
                setCurrentStep('document');
                queryClient.invalidateQueries({ queryKey: ['/api/verification/status'] });
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Tentar Novamente
            </Button>
          </div>
        )}

        {/* ✅ Status: Verificado */}
        {verification?.isVerified || verification?.status === 'approved' ? (
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

            {/* ✅ Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === 'document' || currentStep === 'selfie' || currentStep === 'review' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className={`h-1 w-12 ${currentStep === 'selfie' || currentStep === 'review' ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === 'selfie' || currentStep === 'review' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div className={`h-1 w-12 ${currentStep === 'review' ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep === 'review' ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10" data-testid="card-instructions">
              <h3 className="text-white font-bold text-lg mb-4">
                {currentStep === 'document' && '📄 Passo 1: Documento'}
                {currentStep === 'selfie' && '🤳 Passo 2: Selfie'}
                {currentStep === 'review' && '✅ Passo 3: Revisão'}
              </h3>
              <ol className="space-y-3 text-gray-300 text-sm">
                {currentStep === 'document' && (
                  <>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
                      <span>Tire foto do seu documento (RG, CNH ou Passaporte)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</span>
                      <span>Certifique-se de que os dados estejam legíveis</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</span>
                      <span>Evite reflexos e sombras</span>
                    </li>
                  </>
                )}
                {currentStep === 'selfie' && (
                  <>
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
                      <span>Seu rosto deve estar claramente visível</span>
                    </li>
                  </>
                )}
                {currentStep === 'review' && (
                  <>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
                      <span>Revise suas fotos antes de enviar</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✓</span>
                      <span>A análise pode levar até 24 horas</span>
                    </li>
                  </>
                )}
              </ol>
            </div>

            {/* ✅ Step: Document */}
            {currentStep === 'document' && !selectedDocument && (
              <div className="space-y-4">
                <input
                  ref={documentInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleDocumentSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => documentInputRef.current?.click()}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Enviar Foto do Documento
                </Button>
              </div>
            )}

            {currentStep === 'document' && selectedDocument && (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Seu documento:</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDocument(null)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden mb-4">
                  <img src={selectedDocument} alt="Documento" className="w-full h-full object-contain" />
                </div>
                <Button
                  onClick={handleNextStep}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
                >
                  Continuar para Selfie
                </Button>
              </div>
            )}

            {/* ✅ Step: Selfie */}
            {currentStep === 'selfie' && !selectedImage && !isCameraOpen && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <Button
                  onClick={openCamera}
                  disabled={isCameraLoading}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {isCameraLoading ? 'Abrindo Câmera...' : 'Abrir Câmera'}
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
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Escolher da Galeria
                </Button>
                <Button
                  onClick={() => setCurrentStep('document')}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                >
                  Voltar ao Documento
                </Button>
              </div>
            )}

            {/* ✅ Câmera Aberta */}
            {currentStep === 'selfie' && isCameraOpen && !selectedImage && (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">📸 Posicione seu rosto</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeCamera}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                
                {/* Video Preview */}
                <div className="relative aspect-square bg-black rounded-xl overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Canvas oculto para captura */}
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Overlay de guia */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-4 border-white/30 rounded-full w-64 h-64"></div>
                  </div>
                </div>

                {/* Instruções */}
                <div className="bg-blue-900/30 rounded-xl p-3 mb-4">
                  <p className="text-white text-sm text-center">
                    ✅ Posicione seu rosto dentro do círculo<br />
                    ✅ Remova óculos escuros e acessórios<br />
                    ✅ Mantenha o ambiente bem iluminado
                  </p>
                </div>

                {/* Botões */}
                <div className="space-y-3">
                  <Button
                    onClick={takePicture}
                    className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full text-lg shadow-lg"
                  >
                    📸 Capturar Selfie
                  </Button>
                  <Button
                    onClick={closeCamera}
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:bg-red-900/20"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'selfie' && selectedImage && (
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold">Sua selfie:</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(null)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden mb-4">
                  <img src={selectedImage} alt="Selfie" className="w-full h-full object-cover" />
                </div>
                <Button
                  onClick={handleNextStep}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-full text-lg shadow-lg"
                >
                  Revisar e Enviar
                </Button>
              </div>
            )}

            {/* ✅ Step: Review */}
            {currentStep === 'review' && (
              <div className="space-y-4">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <h4 className="text-white font-bold mb-3">Documento:</h4>
                  <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden">
                    <img src={selectedDocument!} alt="Documento" className="w-full h-full object-contain" />
                  </div>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <h4 className="text-white font-bold mb-3">Selfie:</h4>
                  <div className="relative aspect-square bg-gray-800 rounded-xl overflow-hidden">
                    <img src={selectedImage!} alt="Selfie" className="w-full h-full object-cover" />
                  </div>
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full text-lg shadow-lg"
                >
                  {isSubmitting ? "Enviando..." : "✅ Enviar Verificação"}
                </Button>
                <Button
                  onClick={() => setCurrentStep('selfie')}
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white"
                >
                  Voltar e Editar
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

import { useQuery } from "@tanstack/react-query";
import { User, Edit3, HelpCircle, Crown, Eye, Heart, Share2, CheckCircle, Star, Flame, Users, Mail, UserCircle, Home, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import logoPath from "@assets/Logo_MIX_horizontal_1750591494976.png";
import profileImagePath from "@assets/Generated Image March 20, 2025 - 6_14PM_1750613342997.png";
import BottomNavigation from "@/components/BottomNavigation";

export default function Profile() {
  const [showFullBio, setShowFullBio] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'Perfil MIX - Alex Developer',
      text: 'Conheça o perfil do Alex Developer no MIX!',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback para navegadores que não suportam Web Share API
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  const handleVerification = () => {
    setShowVerificationModal(true);
  };
  const { data: profile, isLoading } = useQuery({
    queryKey: ['/api/profile/1'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header com Logo e Botão de Ajuda */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <img 
              src={logoPath} 
              alt="MIX Logo" 
              className="h-8 w-auto"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation('/help')}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Perfil Principal - Foto Quadrada ao Lado */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20">
          {/* Layout horizontal com foto e informações */}
          <div className="flex items-start space-x-4 mb-4">
            {/* Foto do perfil - aumentada para ocupar espaço do botão removido */}
            <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-white/50 flex-shrink-0">
              <img 
                src={profileImagePath}
                alt="Alex Developer"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Informações ao lado da foto */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-white text-base font-bold">Alex Developer, 28</h1>
                <button 
                  onClick={() => setLocation('/edit-profile')}
                  className="w-6 h-6 bg-transparent border border-white/50 rounded flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-white" />
                </button>
              </div>
              <p className="text-white/80 text-xs">🏠 São Paulo - SP</p>
              <p className="text-white/70 text-xs">há 30 minutos</p>
              <div className="mt-1">
                <p className="text-white/80 text-xs">
                  {showFullBio 
                    ? "Desenvolvedor apaixonado por tecnologia e código, sempre em busca de novos desafios para construir soluções inovadoras que impactem positivamente a vida das pessoas."
                    : "Desenvolvedor apaixonado por tecnologia..."
                  }
                </p>
                <button 
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="text-blue-300 text-xs underline mt-1 hover:text-blue-200"
                >
                  {showFullBio ? "VER MENOS" : "VER MAIS"}
                </button>
              </div>
            </div>
          </div>

          {/* Botões Likes, Visualizações e Compartilhar */}
          <div className="flex gap-3 mb-4">
            <Button 
              onClick={() => setLocation('/likes')}
              className="bg-pink-300 hover:bg-pink-400 text-black flex-1"
            >
              Likes
            </Button>
            <Button 
              onClick={() => setLocation('/views')}
              className="bg-white hover:bg-gray-100 text-black flex-1"
            >
              Visualizações
            </Button>
            <Button 
              onClick={() => handleShare()}
              className="bg-transparent border border-white/50 hover:bg-white/20 text-white px-3"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Assinatura Atual - Fundo Branco, Texto Laranja */}
          <div 
            onClick={() => setLocation('/subscription')}
            className="bg-white rounded-xl p-3 mb-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-orange-600 font-bold text-sm">ASSINATURA ATUAL</h3>
            <p className="text-orange-600 text-xs">VER MAIS</p>
          </div>


        </div>

        {/* Seção de Status de Verificação */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 border border-blue-500/30">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-bold text-sm">Status de Verificação</h3>
              <span className="text-white text-xs">75% Completo</span>
            </div>
            
            <div className="space-y-2">
              {/* Telefone */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white text-sm">Telefone</span>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* E-mail */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white text-sm">E-mail</span>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Foto */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-white text-sm">Foto</span>
                </div>
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Identidade */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span className="text-white text-sm">Identidade</span>
                </div>
                <Button 
                  onClick={handleVerification}
                  className="bg-white text-blue-600 text-xs px-3 py-1 hover:bg-gray-100"
                >
                  Verificar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Planos - Grid Uniforme */}
        <div className="mb-8">
          <h2 className="text-white text-lg font-bold mb-6 text-center">PLANOS DE ASSINATURA</h2>
          
          <div className="grid grid-cols-3 gap-4 px-2">
            {/* Plano Básico */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20 w-full h-40 flex flex-col">
              <div className="flex-1 flex flex-col justify-center items-center">
                <h3 className="text-white font-bold text-base mb-2">BÁSICO</h3>
                <p className="text-white/90 text-sm font-semibold">R$ 19,90</p>
                <p className="text-white/70 text-xs mb-3">/mês</p>
              </div>
              <Button 
                onClick={() => setLocation('/plans')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 w-full"
              >
                ASSINAR
              </Button>
            </div>

            {/* Plano Premium */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 backdrop-blur-md rounded-xl p-4 text-center border-2 border-white/50 w-full h-40 flex flex-col">
              <div className="flex-1 flex flex-col justify-center items-center">
                <Crown className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <h3 className="text-white font-bold text-base mb-1">PREMIUM</h3>
                <p className="text-white/90 text-sm font-semibold">R$ 39,90</p>
                <p className="text-white/70 text-xs mb-2">/mês</p>
              </div>
              <Button 
                onClick={() => setLocation('/plans')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black text-sm py-2 w-full font-bold"
              >
                ASSINAR
              </Button>
            </div>

            {/* Plano VIP */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20 w-full h-40 flex flex-col">
              <div className="flex-1 flex flex-col justify-center items-center">
                <h3 className="text-white font-bold text-base mb-2">VIP</h3>
                <p className="text-white/90 text-sm font-semibold">R$ 59,90</p>
                <p className="text-white/70 text-xs mb-3">/mês</p>
              </div>
              <Button 
                onClick={() => setLocation('/plans')}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 w-full"
              >
                ASSINAR
              </Button>
            </div>
          </div>

          {/* Indicadores do carrossel */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full"></div>
          </div>

          <p className="text-white/80 text-sm text-center mt-5">
            Planos mensais • Cancele quando quiser
          </p>
        </div>

        {/* Menu Inferior - 4 ícones */}
        <div className="fixed bottom-0 left-0 right-0 bg-blue-800/80 backdrop-blur-md border-t border-white/20">
          <div className="flex items-center justify-around py-3 max-w-md mx-auto">
            <div className="text-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <Heart className="w-4 h-4 text-white/70" />
              </div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <Star className="w-4 h-4 text-white/70" />
              </div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                <User className="w-4 h-4 text-white/70" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />

      {/* Modal de Verificação de Identidade */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verificação de Identidade</h3>
              <p className="text-gray-600 text-sm">
                Para sua segurança e dos outros usuários, precisamos verificar sua identidade.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <UserCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Envie uma foto do seu documento</p>
                <p className="text-xs text-gray-500">RG, CNH ou Passaporte</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Tire uma selfie</p>
                <p className="text-xs text-gray-500">Para comparação facial</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => setShowVerificationModal(false)}
                variant="outline" 
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  setShowVerificationModal(false);
                  alert('Funcionalidade de verificação será implementada em breve!');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
              >
                Iniciar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
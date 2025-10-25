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

          {/* Linha de Likes, Visualizações e Favoritos */}
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-white text-sm">124</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">1.2k</span>
            </div>
            <button 
              onClick={() => setLocation('/favorites')}
              className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300"
            >
              <Star className="w-4 h-4" />
              <span className="text-sm">Favoritos</span>
            </button>
          </div>

          {/* Linha de Compartilhar e Verificar */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2 text-white hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Compartilhar</span>
            </button>
            <button 
              onClick={handleVerification}
              className="flex items-center space-x-2 bg-purple-600/60 rounded-lg px-3 py-2 text-white hover:bg-purple-600/80 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Verificar</span>
            </button>
          </div>
        </div>

        {/* Configurações da Conta */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20">
          <h2 className="text-white text-lg font-semibold mb-3">Configurações da Conta</h2>
          
          {/* Linha de status de verificação */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-white text-sm">Status de Verificação</span>
            </div>
            <span className="text-yellow-400 text-sm">Pendente</span>
          </div>

          {/* Assinatura vigente */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">Assinatura Vigente</span>
            </div>
            <span className="text-green-400 text-sm">GRÁTIS</span>
          </div>

          {/* Botões de navegação */}
          <div className="space-y-2">
            <button 
              onClick={() => setLocation('/settings')}
              className="w-full flex items-center justify-between bg-white/10 rounded-lg p-3 text-white hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <UserCircle className="w-5 h-5" />
                <span>Configurações</span>
              </div>
              <span className="text-white/50">→</span>
            </button>
            
            <button 
              onClick={() => setLocation('/subscription')}
              className="w-full flex items-center justify-between bg-white/10 rounded-lg p-3 text-white hover:bg-white/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-yellow-400" />
                <span>Planos Premium</span>
              </div>
              <span className="text-white/50">→</span>
            </button>
          </div>
        </div>

        {/* Planos de Assinatura */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20">
          <h2 className="text-white text-lg font-semibold mb-3">Planos de Assinatura</h2>
          
          {/* Plano Gratuito */}
          <div className="mb-3">
            <div 
              className="bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/20 transition-colors"
              onClick={() => setExpandedPlan(expandedPlan === 'free' ? null : 'free')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Gratuito</h3>
                    <p className="text-white/70 text-sm">R$ 0,00/mês</p>
                  </div>
                </div>
                <span className="text-green-400 text-sm">ATIVO</span>
              </div>
              {expandedPlan === 'free' && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• 10 likes por dia</li>
                    <li>• Matches básicos</li>
                    <li>• Chat com limitações</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Plano Premium */}
          <div className="mb-3">
            <div 
              className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-3 cursor-pointer hover:from-purple-600/30 hover:to-pink-600/30 transition-colors"
              onClick={() => setExpandedPlan(expandedPlan === 'premium' ? null : 'premium')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Premium</h3>
                    <p className="text-white/70 text-sm">R$ 19,90/mês</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-700 hover:to-pink-700 transition-colors">
                  Assinar
                </button>
              </div>
              {expandedPlan === 'premium' && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Likes ilimitados</li>
                    <li>• Super likes</li>
                    <li>• Ver quem curtiu você</li>
                    <li>• Chat sem limitações</li>
                    <li>• Boost no perfil</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Plano VIP */}
          <div>
            <div 
              className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-lg p-3 cursor-pointer hover:from-yellow-600/30 hover:to-orange-600/30 transition-colors"
              onClick={() => setExpandedPlan(expandedPlan === 'vip' ? null : 'vip')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">VIP</h3>
                    <p className="text-white/70 text-sm">R$ 39,90/mês</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:from-yellow-700 hover:to-orange-700 transition-colors">
                  Assinar
                </button>
              </div>
              {expandedPlan === 'vip' && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <ul className="text-white/80 text-sm space-y-1">
                    <li>• Todos os recursos Premium</li>
                    <li>• Prioridade no algoritmo</li>
                    <li>• Destaque no perfil</li>
                    <li>• Acesso a eventos exclusivos</li>
                    <li>• Suporte prioritário</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botão Deletar Conta */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-20 border border-white/20">
          <button 
            onClick={() => setLocation('/delete-account')}
            className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg p-3 transition-colors"
          >
            Deletar Conta
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
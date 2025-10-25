import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ChevronDown, ChevronUp, Phone, Mail, MessageCircle, Clock, Shield, Heart, Users, Star, Flame, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoPath from "@assets/Logo_MIX_horizontal_1750591494976.png";

interface FAQItem {
  question: string;
  answer: string;
}

export default function Help() {
  const [, setLocation] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const faqItems: FAQItem[] = [
    {
      question: "Como funciona o sistema de matches?",
      answer: "O sistema de matches funciona quando duas pessoas se curtem mutuamente. Você desliza para a direita (ou clica no coração) para curtir um perfil, e se a outra pessoa também curtir o seu perfil, vocês fazem um match e podem conversar!"
    },
    {
      question: "Como posso verificar meu perfil?",
      answer: "Para verificar seu perfil, acesse a seção 'Status de Verificação' na sua página de perfil. Você pode verificar seu telefone, e-mail, adicionar fotos e enviar documentos de identidade para obter o selo de verificação."
    },
    {
      question: "Quais são os benefícios dos planos premium?",
      answer: "Os planos premium oferecem: Likes ilimitados, Super Likes para se destacar, Boost do perfil para aparecer mais, ver quem curtiu você, e acesso prioritário a novos recursos."
    },
    {
      question: "Como posso cancelar minha assinatura?",
      answer: "Você pode cancelar sua assinatura a qualquer momento através das configurações do seu perfil ou entrando em contato com nosso suporte. O cancelamento é efetivo no final do período já pago."
    },
    {
      question: "Posso bloquear ou denunciar usuários?",
      answer: "Sim! Se você se sentir desconfortável com algum usuário, pode bloqueá-lo ou denunciá-lo. Toque no perfil da pessoa e selecione 'Denunciar' ou 'Bloquear'. Levamos a segurança muito a sério."
    },
    {
      question: "Como alterar minha localização?",
      answer: "Sua localização é detectada automaticamente, mas usuários premium podem alterar sua localização nas configurações para conhecer pessoas de outras cidades."
    },
    {
      question: "Por que não estou recebendo matches?",
      answer: "Certifique-se de que seu perfil está completo com fotos atrativas e uma bio interessante. Seja ativo no app e considere usar o Boost para aumentar sua visibilidade."
    },
    {
      question: "Como funciona o algoritmo de descoberta?",
      answer: "Nosso algoritmo mostra perfis baseados em sua localização, preferências de idade, interesses em comum e atividade no aplicativo. Quanto mais ativo você for, melhores serão as sugestões."
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "E-mail",
      description: "suporte@mixapp.com",
      subtitle: "Resposta em até 24h"
    },
    {
      icon: Phone,
      title: "Telefone",
      description: "(11) 9999-9999",
      subtitle: "Seg-Sex: 9h às 18h"
    },
    {
      icon: MessageCircle,
      title: "Chat ao Vivo",
      description: "Chat direto no app",
      subtitle: "Disponível 24/7"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-blue-900/60 backdrop-blur-md border-b border-blue-300/30 px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/10 mr-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-lg font-bold flex-1">Central de Ajuda</h1>
        </div>
      </div>

      <main className="px-4 py-6 pb-20">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logoPath} 
            alt="MIX Logo" 
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-white text-xl font-bold mb-2">Como podemos te ajudar?</h2>
          <p className="text-white/70 text-sm">
            Encontre respostas para suas dúvidas ou entre em contato conosco
          </p>
        </div>

        {/* Perguntas Frequentes */}
        <div className="mb-8">
          <h3 className="text-white text-lg font-bold mb-4">Perguntas Frequentes</h3>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors rounded-xl"
                >
                  <span className="text-white font-medium text-sm">{item.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-white/70" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/70" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-4 pb-4">
                    <p className="text-white/80 text-sm leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formas de Contato */}
        <div className="mb-8">
          <h3 className="text-white text-lg font-bold mb-4">Entre em Contato</h3>
          <div className="space-y-3">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{method.title}</h4>
                      <p className="text-white/90 text-sm">{method.description}</p>
                      <p className="text-white/60 text-xs">{method.subtitle}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recursos do App */}
        <div className="mb-8">
          <h3 className="text-white text-lg font-bold mb-4">Recursos do Aplicativo</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
              <Heart className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <h4 className="text-white font-medium text-sm mb-1">Likes</h4>
              <p className="text-white/70 text-xs">Demonstre interesse</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
              <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <h4 className="text-white font-medium text-sm mb-1">Super Like</h4>
              <p className="text-white/70 text-xs">Se destaque</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h4 className="text-white font-medium text-sm mb-1">Matches</h4>
              <p className="text-white/70 text-xs">Conexões mútuas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h4 className="text-white font-medium text-sm mb-1">Boost</h4>
              <p className="text-white/70 text-xs">Mais visibilidade</p>
            </div>
          </div>
        </div>

        {/* Dicas de Segurança */}
        <div className="mb-8">
          <h3 className="text-white text-lg font-bold mb-4">Dicas de Segurança</h3>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-start mb-3">
              <Shield className="w-5 h-5 text-green-400 mr-3 mt-0.5" />
              <div>
                <h4 className="text-white font-medium text-sm mb-1">Mantenha-se Seguro</h4>
                <ul className="text-white/80 text-xs space-y-1">
                  <li>• Encontre-se em locais públicos</li>
                  <li>• Não compartilhe informações pessoais</li>
                  <li>• Confie nos seus instintos</li>
                  <li>• Denuncie comportamentos inadequados</li>
                  <li>• Verifique perfis suspeitos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Informações da Versão */}
        <div className="text-center">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-white/60 text-xs mb-1">MIX Dating App</p>
            <p className="text-white/60 text-xs">Versão 2.1.0</p>
            <p className="text-white/60 text-xs">© 2024 MIX. Todos os direitos reservados.</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-blue-900/60 backdrop-blur-md border-t border-blue-300/30">
        <div className="flex justify-around py-2">
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/discover')}
          >
            <Flame className="w-6 h-6" />
            <span className="text-[10px] font-medium">Descobrir</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/matches')}
          >
            <Users className="w-6 h-6" />
            <span className="text-[10px] font-medium">Partidas</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/messages')}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-[10px] font-medium">Mensagens</span>
          </button>
          <button 
            className="flex flex-col items-center space-y-1 text-white/60 p-2 hover:text-pink-500 transition-colors duration-200"
            onClick={() => setLocation('/profile')}
          >
            <UserCircle className="w-6 h-6" />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
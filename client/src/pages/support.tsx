import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Phone, Mail, HelpCircle, ArrowLeft, Clock, User, Heart } from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function Support() {
  const [, setLocation] = useLocation();

  const faqs = [
    {
      question: "Como criar um perfil atrativo?",
      answer: "Use fotos recentes e de qualidade, escreva uma bio interessante e seja autêntico sobre seus interesses e hobbies."
    },
    {
      question: "Por que não estou recebendo matches?",
      answer: "Verifique suas preferências de distância, idade e interesses. Atualize suas fotos e bio regularmente."
    },
    {
      question: "Como denunciar um comportamento inadequado?",
      answer: "Toque no perfil do usuário e selecione 'Denunciar'. Nossa equipe analisará em até 24 horas."
    },
    {
      question: "Posso usar o MIX sem pagar?",
      answer: "Sim! O MIX oferece funcionalidades gratuitas. O plano premium adiciona recursos extras como super likes ilimitados."
    },
    {
      question: "Como cancelar minha assinatura?",
      answer: "Acesse Configurações > Conta > Gerenciar Assinatura ou entre em contato conosco."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim, utilizamos criptografia avançada e seguimos rigorosamente a LGPD para proteger seus dados."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <img 
                src={mixLogoHorizontal} 
                alt="MIX Logo"
                className="h-8 object-contain"
              />
            </div>
            <Button 
              onClick={() => setLocation("/welcome")}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold"
            >
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-20 h-20 mx-auto mb-6 text-pink-400" />
          <h1 className="text-5xl font-bold mb-6">Como Podemos Ajudar?</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Nossa equipe de suporte está aqui para garantir que você tenha a melhor 
            experiência possível no MIX. Encontre respostas rápidas ou entre em contato conosco.
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Entre em Contato</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chat */}
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Chat ao Vivo</h3>
                <p className="text-gray-600 mb-6">
                  Converse com nossa equipe em tempo real para respostas imediatas.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Iniciar Chat
                </Button>
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  24/7 disponível
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Email</h3>
                <p className="text-gray-600 mb-6">
                  Envie sua dúvida detalhada e receba uma resposta completa.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Enviar Email
                </Button>
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Resposta em até 2h
                </div>
              </CardContent>
            </Card>

            {/* Phone */}
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Telefone</h3>
                <p className="text-gray-600 mb-6">
                  Fale diretamente com um especialista para questões complexas.
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Ligar Agora
                </Button>
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  Seg-Sex 8h-18h
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Perguntas Frequentes</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Categorias de Ajuda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <User className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Perfil e Conta</h3>
                <p className="text-gray-600">
                  Ajuda com criação de perfil, configurações de conta e verificação.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <Heart className="w-12 h-12 text-pink-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Matches e Conversas</h3>
                <p className="text-gray-600">
                  Dúvidas sobre matches, mensagens e funcionalidades de interação.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <MessageCircle className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Planos Premium</h3>
                <p className="text-gray-600">
                  Informações sobre assinaturas, pagamentos e recursos premium.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ainda Precisa de Ajuda?</h2>
          <p className="text-xl mb-8 opacity-90">
            Nossa equipe está sempre pronta para ajudar você a aproveitar ao máximo o MIX.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-bold">
              Falar com Suporte
            </Button>
            <Button 
              onClick={() => setLocation("/welcome")}
              className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-full font-bold"
            >
              Começar a Usar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users, MapPin, Shield, Star, ArrowLeft } from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function Product() {
  const [, setLocation] = useLocation();

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
          <h1 className="text-5xl font-bold mb-6">Conheça o MIX</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            O aplicativo de relacionamentos mais completo e seguro do Brasil. 
            Conecte-se com pessoas incríveis próximas a você.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Matches Inteligentes</h3>
              <p className="text-gray-600 leading-relaxed">
                Algoritmo avançado que analisa compatibilidade, interesses comuns e proximidade 
                para encontrar pessoas perfeitas para você.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Chat em Tempo Real</h3>
              <p className="text-gray-600 leading-relaxed">
                Sistema de mensagens instantâneas com notificações, emojis, fotos e 
                recursos de chamada de vídeo integrados.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Localização Inteligente</h3>
              <p className="text-gray-600 leading-relaxed">
                Encontre pessoas próximas com precisão e descubra eventos e 
                estabelecimentos populares na sua região.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Segurança Total</h3>
              <p className="text-gray-600 leading-relaxed">
                Verificação de perfis, sistema de denúncias, bloqueio de usuários 
                e moderação 24/7 para sua proteção.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Comunidade Ativa</h3>
              <p className="text-gray-600 leading-relaxed">
                Milhões de usuários ativos, grupos de interesse, eventos sociais 
                e uma comunidade vibrante esperando por você.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Experiência Premium</h3>
              <p className="text-gray-600 leading-relaxed">
                Interface moderna, funcionalidades exclusivas, suporte prioritário 
                e recursos avançados de personalização.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para encontrar o amor?</h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhões de pessoas que já encontraram relacionamentos incríveis no MIX.
          </p>
          <Button 
            onClick={() => setLocation("/welcome")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-4 rounded-full font-bold text-lg"
          >
            Começar Agora
          </Button>
        </div>
      </section>
    </div>
  );
}
import { useLocation } from "wouter";
import { Heart, MapPin, Shield, MessageCircle, Download, Sparkles, Users, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/mix-logo.png" 
                alt="MIX Logo"
                className="h-12 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-[var(--mix-blue)]">Produto</a>
              <a href="#" className="text-gray-700 hover:text-[var(--mix-blue)]">Segurança</a>
              <a href="#" className="text-gray-700 hover:text-[var(--mix-blue)]">Suporte</a>
              <a href="#" className="text-gray-700 hover:text-[var(--mix-blue)]">Download</a>
            </nav>
            <Button 
              onClick={() => setLocation("/discover")}
              className="gradient-bg text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all animate-glow hover:scale-105"
            >
              Entrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Conecte-se com pessoas incríveis
              </h1>
              <p className="text-xl mb-8 opacity-90">
                O MIX é o app de relacionamentos mais popular. Encontre pessoas próximas, 
                converse e encontre o amor da sua vida.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button 
                  onClick={() => alert('Redirecionando para Google Play...')}
                  className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-xl animate-fade-in delay-500"
                >
                  <Download className="mr-3 w-5 h-5 animate-bounce" />
                  <div className="text-left">
                    <div className="text-xs">Disponível no</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </Button>
                <Button 
                  onClick={() => alert('Redirecionando para App Store...')}
                  className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all hover:scale-105 hover:shadow-xl animate-fade-in delay-700"
                >
                  <Download className="mr-3 w-5 h-5 animate-bounce delay-200" />
                  <div className="text-left">
                    <div className="text-xs">Baixar na</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </Button>
              </div>
            </div>
            
            <div className="relative flex justify-center">
              {/* Phone mockup with realistic design */}
              <div className="relative">
                {/* Phone frame */}
                <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
                    
                    {/* Screen content */}
                    <div className="gradient-bg w-full h-full flex flex-col items-center justify-center text-white relative">
                      {/* Status bar */}
                      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 pt-8 pb-4 text-white text-sm">
                        <span>9:41</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-2 bg-white rounded-sm"></div>
                          <div className="w-4 h-2 bg-white rounded-sm"></div>
                          <div className="w-6 h-3 bg-white rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* Main content */}
                      <div className="flex flex-col items-center justify-center flex-1">
                        <div className="w-28 h-28 mb-6 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm animate-pulse">
                          <img 
                            src="/mix-logo-new.png" 
                            alt="MIX Logo"
                            className="w-20 h-20 object-contain animate-bounce"
                          />
                        </div>
                        

                        
                        <p className="text-center text-sm opacity-90 px-8 mb-8 animate-fade-in delay-300">
                          Seu novo app de relacionamentos favorito
                        </p>
                        
                        {/* App preview cards with animations */}
                        <div className="mt-4 flex space-x-4">
                          <div className="w-16 h-20 bg-white/10 rounded-xl backdrop-blur-sm animate-float delay-0 hover:scale-105 transition-transform cursor-pointer">
                            <div className="w-full h-full flex items-center justify-center">
                              <Heart className="w-6 h-6 text-pink-300 animate-pulse" />
                            </div>
                          </div>
                          <div className="w-16 h-20 bg-white/20 rounded-xl backdrop-blur-sm animate-float delay-300 hover:scale-105 transition-transform cursor-pointer">
                            <div className="w-full h-full flex items-center justify-center">
                              <MessageCircle className="w-6 h-6 text-blue-300 animate-pulse delay-500" />
                            </div>
                          </div>
                          <div className="w-16 h-20 bg-white/15 rounded-xl backdrop-blur-sm animate-float delay-500 hover:scale-105 transition-transform cursor-pointer">
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-purple-300 animate-pulse delay-1000" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Home indicator */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Phone buttons */}
                <div className="absolute right-0 top-24 w-1 h-12 bg-gray-700 rounded-l-lg"></div>
                <div className="absolute right-0 top-40 w-1 h-16 bg-gray-700 rounded-l-lg"></div>
                <div className="absolute right-0 top-60 w-1 h-16 bg-gray-700 rounded-l-lg"></div>
                
                {/* Floating animated elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-pink-400/30 rounded-full blur-sm animate-bounce delay-0">
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                  </div>
                </div>
                <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-purple-400/25 rounded-full blur-sm animate-float delay-1000">
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-500 animate-spin" />
                  </div>
                </div>
                <div className="absolute top-16 -right-10 w-10 h-10 bg-blue-400/30 rounded-full blur-sm animate-ping delay-500">
                  <div className="w-full h-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-blue-500 animate-pulse" />
                  </div>
                </div>
                <div className="absolute top-60 -left-8 w-8 h-8 bg-green-400/25 rounded-full blur-sm animate-bounce delay-700">
                  <div className="w-full h-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-green-500 animate-pulse" />
                  </div>
                </div>
                <div className="absolute bottom-20 -left-6 w-14 h-14 bg-yellow-400/20 rounded-full blur-sm animate-float delay-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que escolher o MIX?</h2>
            <p className="text-xl text-gray-600">Funcionalidades que fazem a diferença</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 hover:transform hover:scale-105 transition-all duration-300 rounded-xl hover:shadow-lg group">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 animate-float group-hover:animate-bounce shadow-lg">
                <Heart className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-pink-600 transition-colors">Matches Inteligentes</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Nosso algoritmo conecta você com pessoas compatíveis baseado nos seus 
                interesses e localização.
              </p>
            </div>
            
            <div className="text-center p-6 hover:transform hover:scale-105 transition-all duration-300 rounded-xl hover:shadow-lg group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-float delay-300 group-hover:animate-bounce shadow-lg">
                <Shield className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-600 transition-colors">Segurança Total</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Verificação de perfis, bloqueio de usuários e denúncias para garantir sua segurança.
              </p>
            </div>
            
            <div className="text-center p-6 hover:transform hover:scale-105 transition-all duration-300 rounded-xl hover:shadow-lg group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-float delay-500 group-hover:animate-bounce shadow-lg">
                <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">Chat Instantâneo</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                Converse em tempo real com seus matches através do nosso chat integrado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

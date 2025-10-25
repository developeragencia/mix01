import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Heart, MapPin, Shield, MessageCircle, Download, Sparkles, Users, Star, Zap, Smartphone, Monitor, CheckCircle, Play, ArrowRight, Eye, ThumbsUp, Coffee, Globe, Award, Rocket, Clock, AlertCircle, Calendar, Code, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import mixLogo from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showDevelopmentStatus, setShowDevelopmentStatus] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Status de desenvolvimento desativado - site normal no ar
  useEffect(() => {
    setShowDevelopmentStatus(false);
  }, []);

  // Testimonials data
  const testimonials = [
    {
      name: "Marina Silva",
      age: 28,
      location: "São Paulo, SP",
      message: "Conheci meu marido no Mix App Digital há 2 anos. Hoje estamos casados e muito felizes!",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b9e85c2c?w=100&h=100&fit=crop&face"
    },
    {
      name: "Carlos Santos",
      age: 32,
      location: "Rio de Janeiro, RJ",
      message: "O Mix App Digital mudou minha vida. Encontrei pessoas incríveis e fiz grandes amizades.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face"
    },
    {
      name: "Ana Costa",
      age: 25,
      location: "Belo Horizonte, MG",
      message: "Aplicativo incrível! Interface linda e pessoas de qualidade. Recomendo!",
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&face"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dados das fases do projeto
  const projectPhases = [
    {
      id: "1",
      name: "Arquitetura Base",
      description: "Estrutura fundamental do aplicativo",
      progress: 100,
      status: 'completed',
      startDate: "10/07/2025",
      endDate: "15/07/2025",
      tasks: ["Configuração React + TypeScript", "Banco PostgreSQL configurado", "Autenticação OAuth implementada", "Sistema de rotas criado"]
    },
    {
      id: "2", 
      name: "Core Features",
      description: "Funcionalidades principais do dating app",
      progress: 95,
      status: 'in-progress',
      startDate: "16/07/2025",
      endDate: "25/07/2025",
      tasks: ["Sistema de perfis ✓", "Descoberta e swipes ✓", "Sistema de matches ✓", "Chat em tempo real ✓", "Otimizações finais"]
    },
    {
      id: "3",
      name: "Pagamentos & Premium",
      description: "Sistema de assinaturas Stripe",
      progress: 100,
      status: 'completed',
      startDate: "26/07/2025", 
      endDate: "28/07/2025",
      tasks: ["Integração Stripe completa", "Planos Premium e VIP", "Sistema PIX brasileiro", "Gerenciamento de assinaturas"]
    },
    {
      id: "4",
      name: "Admin Dashboard",
      description: "Painel administrativo completo",
      progress: 100,
      status: 'completed',
      startDate: "28/07/2025",
      endDate: "29/07/2025", 
      tasks: ["Dashboard de usuários", "Gerenciamento de matches", "Relatórios e analytics", "Configurações do sistema"]
    },
    {
      id: "5",
      name: "Testes & Otimização",
      description: "Varredura completa e correções",
      progress: 100,
      status: 'completed',
      startDate: "30/07/2025",
      endDate: "30/07/2025",
      tasks: ["Análise de 67+ páginas", "Correção de bugs críticos", "Otimização de performance", "Testes de API completos"]
    },
    {
      id: "6",
      name: "Deploy & Lançamento",
      description: "Preparação para produção",
      progress: 85,
      status: 'in-progress',
      startDate: "31/07/2025",
      endDate: "05/08/2025",
      tasks: ["Configuração de domínio ✓", "SSL e segurança ✓", "Testes de carga", "Marketing de lançamento", "Monitoramento em produção"]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-400 bg-green-400/10';
      case 'in-progress':
        return 'border-yellow-400 bg-yellow-400/10';
      default:
        return 'border-gray-400 bg-gray-400/10';
    }
  };

  if (showDevelopmentStatus) {
    const totalProgress = Math.round(
      projectPhases.reduce((acc, phase) => acc + phase.progress, 0) / projectPhases.length
    );
    const completedPhases = projectPhases.filter(p => p.status === 'completed').length;
    const inProgressPhases = projectPhases.filter(p => p.status === 'in-progress').length;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600">
        {/* Development Header */}
        <header className="bg-white/10 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <img 
                  src={mixLogo} 
                  alt="MIX Logo"
                  className="h-12 w-auto object-contain"
                />
                <div className="text-white">
                  <h1 className="text-xl font-bold">Status de Desenvolvimento</h1>
                  <p className="text-sm opacity-80">mixapp.digital</p>
                </div>
              </div>
              <div className="text-right text-white">
                <div className="text-2xl font-bold">{totalProgress}%</div>
                <div className="text-sm opacity-80">Concluído</div>
              </div>
            </div>
          </div>
        </header>

        {/* Development Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Project Overview */}
          <div className="mb-8">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div className="text-white">
                    <div className="flex justify-center mb-2">
                      <Code className="w-8 h-8 text-pink-300" />
                    </div>
                    <div className="text-2xl font-bold">{totalProgress}%</div>
                    <div className="text-sm opacity-80">Progresso Geral</div>
                  </div>
                  <div className="text-white">
                    <div className="flex justify-center mb-2">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold">{completedPhases}</div>
                    <div className="text-sm opacity-80">Fases Concluídas</div>
                  </div>
                  <div className="text-white">
                    <div className="flex justify-center mb-2">
                      <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold">{inProgressPhases}</div>
                    <div className="text-sm opacity-80">Em Progresso</div>
                  </div>
                  <div className="text-white">
                    <div className="flex justify-center mb-2">
                      <Calendar className="w-8 h-8 text-blue-300" />
                    </div>
                    <div className="text-2xl font-bold">20</div>
                    <div className="text-sm opacity-80">Dias Estimados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-semibold">Progresso Geral do Projeto</h3>
                <span className="text-white font-bold">{totalProgress}%</span>
              </div>
              <Progress value={totalProgress} className="h-3 bg-white/20" />
            </div>
          </div>

          {/* Project Phases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projectPhases.map((phase) => (
              <Card key={phase.id} className={`bg-white/10 backdrop-blur-md border ${getStatusColor(phase.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-lg">{phase.name}</h3>
                    {getStatusIcon(phase.status)}
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4">{phase.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm">Progresso</span> 
                      <span className="text-white font-bold">{phase.progress}%</span>
                    </div>
                    <Progress value={phase.progress} className="h-2 bg-white/20" />
                  </div>

                  <div className="mb-4">
                    <div className="text-white/70 text-xs mb-2">
                      {phase.startDate} - {phase.endDate}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {phase.tasks.map((task, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {task.includes('✓') ? (
                          <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-white/40 flex-shrink-0" />
                        )}
                        <span className="text-white/80 text-xs">{task}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Phase Highlight */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-md border-yellow-400/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Zap className="w-8 h-8 text-yellow-400" />
                  <div>
                    <h3 className="text-white text-xl font-bold">Fase Atual: Deploy & Lançamento</h3>
                    <p className="text-white/80">Preparando o aplicativo para produção em mixapp.digital</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-white">
                    <h4 className="font-semibold mb-2">Próximas Ações:</h4>
                    <ul className="space-y-1 text-sm text-white/80">
                      <li>• Configuração SSL para mixapp.digital</li>
                      <li>• Testes de carga e performance</li>
                      <li>• Campanha de marketing de lançamento</li>
                      <li>• Monitoramento em tempo real</li>
                    </ul>
                  </div>
                  <div className="text-white">
                    <h4 className="font-semibold mb-2">Alterações Recentes:</h4>
                    <ul className="space-y-1 text-sm text-white/80">
                      <li>• Varredura completa de 67+ páginas</li>
                      <li>• Correção de APIs críticas</li>
                      <li>• Otimização de performance</li>
                      <li>• Sistema de pagamentos brasileiro</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Developer Info */}
          <div className="text-center">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 inline-block">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">Desenvolvido por</h3>
                    <p className="text-white/80 font-bold">Alex Developer</p>
                    <p className="text-white/60 text-sm">Full-Stack Developer | Mix App Digital</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Clock */}
          <div className="mt-6 text-center text-white/60 text-sm">
            Última atualização: {currentTime.toLocaleString('pt-BR')}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img 
                src={mixLogo} 
                alt="MIX Logo"
                className="h-12 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#produto" className="text-white hover:text-pink-200 transition-colors">Produto</a>
              <a href="#seguranca" className="text-white hover:text-pink-200 transition-colors">Segurança</a>
              <a href="#suporte" className="text-white hover:text-pink-200 transition-colors">Suporte</a>
              <a href="#download" className="text-white hover:text-pink-200 transition-colors">Download</a>
            </nav>
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
                        <div className="w-28 h-28 mb-6 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                          <Heart className="w-20 h-20 text-pink-300" />
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-4 text-center">
                          MIX
                        </h2>
                        
                        <p className="text-center text-sm opacity-90 px-8 mb-8">
                          Seu novo app de relacionamentos favorito
                        </p>
                        
                        {/* App preview cards */}
                        <div className="mt-4 flex space-x-4">
                          <div className="w-16 h-20 bg-white/10 rounded-xl backdrop-blur-sm cursor-pointer">
                            <div className="w-full h-full flex items-center justify-center">
                              <Heart className="w-6 h-6 text-pink-300" />
                            </div>
                          </div>
                          <div className="w-16 h-20 bg-white/20 rounded-xl backdrop-blur-sm cursor-pointer">
                            <div className="w-full h-full flex items-center justify-center">
                              <MessageCircle className="w-6 h-6 text-blue-300" />
                            </div>
                          </div>
                          <div className="w-16 h-20 bg-white/15 rounded-xl backdrop-blur-sm cursor-pointer">
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-purple-300" />
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
            <div className="text-center p-6 rounded-xl">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Matches Inteligentes</h3>
              <p className="text-gray-600">
                Nosso algoritmo avançado conecta você com pessoas realmente compatíveis, 
                baseado em seus interesses, localização e preferências.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">100% Seguro</h3>
              <p className="text-gray-600">
                Verificação de perfil obrigatória, chat seguro e ferramentas de denúncia. 
                Sua segurança é nossa prioridade.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl">
              <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Encontros Locais</h3>
              <p className="text-gray-600">
                Conecte-se com pessoas próximas a você. Descubra cafés, restaurantes e 
                eventos perfeitos para o primeiro encontro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Números que impressionam</h2>
            <p className="text-xl opacity-90">Milhares de pessoas já encontraram o amor no MIX</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-5xl font-bold mb-2 text-yellow-300">
                  2.5M+
                </div>
                <p className="text-lg opacity-90">Usuários ativos</p>
                <Users className="w-8 h-8 mx-auto mt-4 text-yellow-300" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-5xl font-bold mb-2 text-green-300">
                  180K+
                </div>
                <p className="text-lg opacity-90">Matches por dia</p>
                <Heart className="w-8 h-8 mx-auto mt-4 text-green-300" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-5xl font-bold mb-2 text-pink-300">
                  45K+
                </div>
                <p className="text-lg opacity-90">Relacionamentos sérios</p>
                <Award className="w-8 h-8 mx-auto mt-4 text-pink-300" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-5xl font-bold mb-2 text-cyan-300">
                  98%
                </div>
                <p className="text-lg opacity-90">Satisfação dos usuários</p>
                <ThumbsUp className="w-8 h-8 mx-auto mt-4 text-cyan-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">O que nossos usuários dizem</h2>
            <p className="text-xl text-gray-600">Histórias reais de pessoas que encontraram o amor</p>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                <img 
                  src={testimonials[currentTestimonial].photo}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover shadow-lg"
                />
                <div className="ml-4">
                  <h4 className="text-xl font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].age}
                  </h4>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </div>
              
              <blockquote className="text-xl text-gray-700 italic mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].message}"
              </blockquote>
              
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            
            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentTestimonial 
                      ? 'bg-pink-500' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Como funciona?</h2>
            <p className="text-xl text-gray-600">Simples, rápido e eficiente</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Smartphone className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Crie seu perfil</h3>
              <p className="text-gray-600 text-lg">
                Adicione suas melhores fotos e conte um pouco sobre você. 
                Quanto mais completo, melhores os matches!
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Eye className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Descubra pessoas</h3>
              <p className="text-gray-600 text-lg">
                Explore perfis de pessoas próximas a você. 
                Deslize para a direita se gostar, para a esquerda caso contrário.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative">
                <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Converse e conecte</h3>
              <p className="text-gray-600 text-lg">
                Quando vocês se curtirem mutuamente, será um match! 
                Comece a conversar e marque um encontro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Pronto para encontrar o amor?
          </h2>
          <p className="text-2xl mb-12 opacity-90">
            Junte-se a milhões de pessoas que já encontraram conexões especiais no MIX
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => alert('Redirecionando para Google Play...')}
              className="flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold"
            >
              <Download className="mr-3 w-6 h-6" />
              Baixar no Google Play
            </Button>
            <Button 
              onClick={() => alert('Redirecionando para App Store...')}
              className="flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold"
            >
              <Download className="mr-3 w-6 h-6" />
              Baixar na App Store
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center items-center space-x-8">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-300 mr-2" />
              <span className="text-lg">Grátis para baixar</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-300 mr-2" />
              <span className="text-lg">Sem anúncios intrusivos</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-300 mr-2" />
              <span className="text-lg">Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src={mixLogo} 
                alt="MIX Logo"
                className="h-12 object-contain mb-4"
              />
              <p className="text-gray-400 mb-4">
                O app de relacionamentos mais confiável do Brasil. 
                Conectando corações desde 2020.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer">
                  <Heart className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer">
                  <Rocket className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#">Funcionalidades</a></li>
                <li><a href="#">Planos Premium</a></li>
                <li><a href="#">Segurança</a></li>
                <li><a href="#">Privacidade</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#">Sobre nós</a></li>
                <li><a href="#">Carreiras</a></li>
                <li><a href="#">Imprensa</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#">Central de ajuda</a></li>
                <li><a href="#">Contato</a></li>
                <li><a href="#">Diretrizes</a></li>
                <li><a href="#">Termos de uso</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MIX. Todos os direitos reservados. Feito com ❤️ no Brasil.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

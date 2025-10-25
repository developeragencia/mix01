import { useLocation } from "wouter";
import { Download, Smartphone, Monitor, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";
import { usePWA } from "@/hooks/usePWA";

export default function DownloadPage() {
  const [, setLocation] = useLocation();
  const { installApp, isInstalled, isIOSSafari, isInstallable } = usePWA();

  const features = [
    "Notificações em tempo real",
    "Funciona offline",
    "Acesso rápido pela tela inicial",
    "Interface nativa",
    "Sincronização automática",
    "Menos uso de bateria"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="cursor-pointer" onClick={() => setLocation("/")}>
              <img 
                src={mixLogoHorizontal} 
                alt="MIX Logo"
                className="h-12 object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
            <Button 
              onClick={() => setLocation("/welcome")}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-bold"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Baixe o MIX
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Instale o MIX como um aplicativo nativo no seu dispositivo. 
              Funciona em qualquer celular ou computador!
            </p>
            
            {/* Install Status */}
            {isInstalled && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-center text-green-300">
                  <Check className="mr-2 w-5 h-5" />
                  <span className="font-semibold">MIX já está instalado!</span>
                </div>
              </div>
            )}
          </div>

          {/* Download Buttons */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            
            {/* Mobile Install */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Smartphone className="w-16 h-16 text-pink-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Para Celular</h3>
              <p className="text-white/80 mb-6">
                Instale como app nativo no seu smartphone. 
                Funciona no Android e iPhone.
              </p>
              <Button 
                onClick={installApp}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 px-8 rounded-xl font-bold text-lg"
                disabled={isInstalled}
              >
                <Download className="mr-3 w-5 h-5" />
                {isInstalled ? 'Já Instalado' : isIOSSafari ? 'Instalar no iPhone' : 'Instalar no Android'}
              </Button>
              {isIOSSafari && (
                <p className="text-white/60 text-sm mt-4">
                  No Safari: Toque em 📤 → "Adicionar à Tela de Início"
                </p>
              )}
            </div>

            {/* Desktop Install */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex justify-center mb-6">
                <Monitor className="w-16 h-16 text-blue-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Para Computador</h3>
              <p className="text-white/80 mb-6">
                Use no Chrome, Edge, Firefox ou Safari. 
                Funciona como um aplicativo desktop.
              </p>
              <Button 
                onClick={installApp}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-8 rounded-xl font-bold text-lg"
                disabled={isInstalled}
              >
                <Download className="mr-3 w-5 h-5" />
                {isInstalled ? 'Já Instalado' : 'Instalar no PC'}
              </Button>
              <p className="text-white/60 text-sm mt-4">
                Disponível para Windows, Mac e Linux
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Por que instalar?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-white font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Como instalar?</h3>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              {/* Android/Chrome */}
              <div>
                <h4 className="text-lg font-semibold text-pink-300 mb-4">Android / Chrome</h4>
                <ol className="text-white/80 space-y-2">
                  <li>1. Clique em "Instalar no Android"</li>
                  <li>2. Aceite a instalação</li>
                  <li>3. O MIX aparecerá na sua tela inicial</li>
                  <li>4. Abra como qualquer outro app!</li>
                </ol>
              </div>

              {/* iOS/Safari */}
              <div>
                <h4 className="text-lg font-semibold text-blue-300 mb-4">iPhone / Safari</h4>
                <ol className="text-white/80 space-y-2">
                  <li>1. Toque no ícone de compartilhar (📤)</li>
                  <li>2. Selecione "Adicionar à Tela de Início"</li>
                  <li>3. Confirme tocando em "Adicionar"</li>
                  <li>4. O MIX estará na sua tela inicial!</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16">
            <p className="text-white/80 mb-6">
              Pronto para encontrar o amor da sua vida?
            </p>
            <Button 
              onClick={() => setLocation("/welcome")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-4 rounded-full font-bold text-xl"
            >
              Começar a Usar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
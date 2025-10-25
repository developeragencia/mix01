import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { RotateCcw, X, Star, Heart, Send } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function Tutorial() {
  const [, setLocation] = useLocation();

  const handleStartTutorial = () => {
    // Aqui você pode implementar o tutorial interativo
    setLocation("/discover");
  };

  const handleSkip = () => {
    setLocation("/discover");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Header com logo Mix */}
      <div className="p-4 flex items-center justify-between">
        <img 
          src="/mix-logo-horizontal.png" 
          alt="MIX" 
          className="h-8 object-contain"
        />
        <div className="flex items-center gap-4">
          <button className="text-gray-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
          <button className="text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
          <button className="text-yellow-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 4.08-3.05 7.44-7 7.93v2.02c5.05-.5 9-4.76 9-9.95 0-5.19-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7c3.87 0 7 3.13 7 7s-3.13 7-7 7z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
        {/* Imagem com emoji */}
        <div className="relative mb-8">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop&crop=face"
            alt="Tutorial"
            className="w-full max-w-md rounded-3xl object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl animate-bounce">👋</div>
          </div>
        </div>

        {/* Texto */}
        <h1 className="text-white text-4xl font-bold mb-4 text-center">
          Prepare-se!
        </h1>
        <p className="text-gray-400 text-lg text-center mb-8">
          Veja tudo o que você precisa saber.
        </p>

        {/* Botão começar */}
        <Button
          onClick={handleStartTutorial}
          className="w-full max-w-md h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-lg font-bold rounded-full mb-4"
          data-testid="button-start-tutorial"
        >
          COMEÇAR TUTORIAL
        </Button>

        {/* Botão pular */}
        <button
          onClick={handleSkip}
          className="text-white text-lg font-semibold"
          data-testid="button-skip-tutorial"
        >
          PULAR
        </button>
      </div>

      {/* Botões de ação do Mix */}
      <div className="flex items-center justify-center gap-4 pb-6 px-6">
        <button 
          className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-yellow-500 hover:bg-gray-700 transition-colors"
          data-testid="button-rewind"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button 
          className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-pink-500 hover:bg-gray-700 transition-colors"
          data-testid="button-nope"
        >
          <X className="w-8 h-8" />
        </button>
        <button 
          className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 hover:bg-gray-700 transition-colors"
          data-testid="button-super-like"
        >
          <Star className="w-6 h-6" />
        </button>
        <button 
          className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-green-500 hover:bg-gray-700 transition-colors"
          data-testid="button-like"
        >
          <Heart className="w-8 h-8" />
        </button>
        <button 
          className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-purple-500 hover:bg-gray-700 transition-colors"
          data-testid="button-boost"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}

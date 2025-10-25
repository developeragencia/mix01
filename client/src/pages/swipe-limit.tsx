import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import mixLogo from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function SwipeLimit() {
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 23); // 14:23 em segundos
  const [selectedPlan, setSelectedPlan] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-purple-500 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-500 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 text-center max-w-sm w-full">
        {/* Logo MIX */}
        <div className="mb-8">
          <img 
            src={mixLogo} 
            alt="MIX" 
            className="h-16 mx-auto mb-6"
          />
        </div>

        {/* Main Message */}
        <h1 className="text-2xl font-bold text-white mb-8">
          Calma que tem mais!
        </h1>

        {/* Timer Section */}
        <div className="mb-8">
          <p className="text-pink-300 text-lg font-semibold mb-4">
            Libere mais MIX em:
          </p>
          
          {/* Timer with curved borders */}
          <div className="relative">
            <div className="absolute -inset-2">
              <div className="w-full h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-lg opacity-30 blur-sm"></div>
            </div>
            <div className="relative bg-transparent border-2 border-pink-400 rounded-lg py-3 px-6">
              <span className="text-white text-2xl font-mono font-bold">
                00:{formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 text-white text-center">
          <p className="mb-2">É hora de sair da tela e viver o momento.</p>
          <p>Já tem mais <span className="font-bold text-pink-300">MIX</span> pra você.</p>
          <p className="text-sm text-pink-200 mt-2">Continuar grátis: limite de 15 curtidas grátis</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Gallery Button */}
          <Button
            onClick={() => setLocation("/matches-grid")}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 transform hover:scale-105"
          >
            Cadê a galera?
          </Button>

          {/* Premium Section */}
          <div className="mt-8">
            <h2 className="text-white text-xl font-bold mb-4">
              Não quer esperar?
            </h2>
            
            <Button
              onClick={() => setLocation("/premium")}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              Destrava isso aí!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
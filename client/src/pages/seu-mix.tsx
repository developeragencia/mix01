import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function SeuMix() {
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 23 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const mins = String(timeLeft.minutes).padStart(2, '0');
    const secs = String(timeLeft.seconds).padStart(2, '0');
    return `00:${mins}:${secs}`;
  };

  return (
    <div className="min-h-screen bg-blue-900 flex flex-col items-center justify-center px-6 pb-20">
      {/* Logo MIX Horizontal */}
      <div className="mb-12">
        <img 
          src={mixLogoHorizontal} 
          alt="MIX" 
          className="h-24 mx-auto drop-shadow-lg"
          data-testid="img-logo"
        />
      </div>

      {/* Main Heading */}
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Calma que tem mais!
      </h2>

      {/* Timer */}
      <div className="mb-8">
        <div className="text-center">
          <p className="text-pink-400 text-xl font-semibold mb-2">
            Libere mais MIX em:
          </p>
          <div className="relative inline-block">
            {/* Left parenthesis */}
            <span className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-pink-400 text-6xl font-thin">
              (
            </span>
            
            {/* Timer */}
            <div className="text-6xl font-bold text-white tabular-nums">
              {formatTime()}
            </div>

            {/* Right parenthesis */}
            <span className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-pink-400 text-6xl font-thin">
              )
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="text-white text-center text-lg max-w-sm mb-8 leading-relaxed">
        É hora de sair da tela e viver o momento.
        <br />
        Já já tem mais <span className="font-bold">MIX</span> pra você.
      </p>

      {/* Cadê a galera button */}
      <Button
        onClick={() => setLocation('/location')}
        className="w-full max-w-xs h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg rounded-full shadow-lg mb-6"
        data-testid="button-cade-galera"
      >
        Cadê a galera?
      </Button>

      {/* Não quer esperar? */}
      <p className="text-white font-bold text-2xl mb-4">
        Não quer esperar?
      </p>

      {/* Destrava isso aí button */}
      <Button
        onClick={() => setLocation('/premium')}
        className="w-full max-w-xs h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-bold text-lg rounded-full shadow-lg"
        data-testid="button-destrava"
      >
        Destrava isso aí!
      </Button>

      <BottomNavigation />
    </div>
  );
}

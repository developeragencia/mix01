import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface FreeUserLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToGrid: () => void;
  onUpgrade: () => void;
}

export default function FreeUserLimitModal({ 
  isOpen, 
  onClose, 
  onGoToGrid, 
  onUpgrade 
}: FreeUserLimitModalProps) {
  const [, setLocation] = useLocation();
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 23 });

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          return { minutes: 14, seconds: 23 }; // Reset para demo
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:23`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center z-50 p-4">
      <div className="max-w-sm w-full text-center text-white">
        {/* Logo MIX */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-4 relative">
            {/* Logo base circular */}
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
              {/* Ícone de localização com coração */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="w-6 h-6 text-white">
                      ❤️
                    </div>
                  </div>
                </div>
                {/* Ponto de localização */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Texto MIX */}
          <div className="text-4xl font-bold mb-2">
            <span className="text-white">m</span>
            <span className="text-white mx-1">i</span>
            <span className="text-white">x</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold mb-8">
          Calma que tem mais!
        </h1>

        {/* Timer */}
        <div className="mb-8">
          <p className="text-pink-400 text-lg mb-2">
            Libere mais MIX em:
          </p>
          <div className="relative">
            {/* Círculo de progresso */}
            <div className="w-32 h-32 mx-auto relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                {/* Círculo de fundo */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="4"
                />
                {/* Círculo de progresso */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="351.86"
                  strokeDashoffset="100"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Tempo no centro */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {formatTime(timeLeft.minutes, timeLeft.seconds)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Texto explicativo */}
        <div className="mb-8 text-lg">
          <p className="mb-2">
            É hora de sair da tela e viver o momento.
          </p>
          <p>
            Já tem mais <span className="font-bold">MIX</span> pra você.
          </p>
        </div>

        {/* Botão Cadê a galera? */}
        <Button
          onClick={onGoToGrid}
          className="w-full mb-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
        >
          Cadê a galera?
        </Button>

        {/* Não quer esperar? */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">
            Não quer esperar?
          </h2>
          
          <Button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
          >
            Destrava isso aí!
          </Button>
        </div>

        {/* Botão invisível para fechar (apenas para desenvolvimento) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Users } from "lucide-react";
import { useLocation } from "wouter";

interface WelcomeSlide {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const slides: WelcomeSlide[] = [
  {
    id: 1,
    title: "Bem-vindo ao MIX",
    description: "O aplicativo que ajuda você a dar o primeiro passo nos relacionamentos."
  },
  {
    id: 2,
    title: "Encontre seu Match",
    description: "Descubra pessoas compatíveis próximas a você",
    icon: <Heart className="w-16 h-16 text-blue-200 animate-pulse" />
  },
  {
    id: 3,
    title: "Converse e Conecte",
    description: "Chat seguro para iniciar conversas interessantes",
    icon: <MessageCircle className="w-16 h-16 text-blue-300 animate-bounce" />
  },
  {
    id: 4,
    title: "Relacionamentos Reais",
    description: "Construa conexões autênticas e duradouras",
    icon: <Users className="w-16 h-16 text-blue-400 animate-pulse" />
  }
];

export default function Welcome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();
  
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setLocation("/terms");
    }
  };

  const currentSlideData = slides[currentSlide];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center relative">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center text-center px-6 space-y-8">
        {/* Logo */}
        <div 
          className="transition-all duration-1000 ease-out"
          style={{
            transform: `scale(${currentSlide === 0 ? 1.2 : 1})`,
            opacity: 1
          }}
        >
          <img 
            src="/mix-logo.png" 
            alt="MIX Logo" 
            className={`animate-pulse ${currentSlide === 0 ? 'w-32 h-32' : 'w-20 h-20'} object-contain`}
          />
        </div>

        {/* Feature Icon */}
        {currentSlide > 0 && currentSlideData.icon && (
          <div className="w-24 h-24 bg-blue-700 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-300/30">
            {currentSlideData.icon}
          </div>
        )}

        {/* Progress indicators - BETWEEN icon and text (fixed position) */}
        <div className="flex space-x-3 my-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white bg-opacity-40"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="max-w-xs space-y-4">
          <h1 className="text-2xl font-bold text-white leading-tight">
            {currentSlideData.title}
          </h1>
          
          <p className="text-base text-white opacity-90 leading-relaxed">
            {currentSlideData.description}
          </p>
        </div>

        {/* Next button */}
        <Button
          onClick={nextSlide}
          className="bg-gradient-to-r from-blue-800 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-500 hover:to-pink-400 text-white px-12 py-4 rounded-full font-bold text-lg mt-8 hover:scale-105 transition-transform shadow-2xl border border-blue-600/40"
        >
          {currentSlide === slides.length - 1 ? "Começar" : "Próximo"}
        </Button>
      </div>
    </div>
  );
}
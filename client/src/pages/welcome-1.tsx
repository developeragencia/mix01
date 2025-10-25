import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import mixLogo from "@assets/Logo_MIX_horizontal_1750591494976.png";
import { MapPin, Users } from "lucide-react";

export default function Welcome1() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md flex flex-col items-center space-y-12">
          <div className="flex flex-col items-center space-y-8">
            <img 
              src={mixLogo} 
              alt="MIX" 
              className="h-16 w-auto drop-shadow-2xl"
              data-testid="img-logo"
            />
            
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-6">
                <MapPin className="w-16 h-16 text-white" strokeWidth={2} />
              </div>
              <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Users className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-white text-4xl font-bold leading-tight">
              Encontre pessoas perto de você
            </h1>

            <p className="text-white/90 text-lg leading-relaxed px-4">
              Descubra solteiros incríveis na sua região e comece a se conectar agora mesmo
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 space-y-6">
        <Button
          onClick={() => setLocation('/welcome-2')}
          className="w-full h-16 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold rounded-full shadow-2xl text-lg transition-all hover:scale-105"
          data-testid="button-next"
        >
          Continuar
        </Button>

        <div className="flex justify-center gap-2.5">
          <div className="w-2.5 h-2.5 bg-white rounded-full shadow-lg"></div>
          <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
        </div>

        <button
          onClick={() => setLocation('/login')}
          className="w-full text-white/70 hover:text-white text-sm font-medium transition-colors"
          data-testid="button-skip"
        >
          Pular
        </button>
      </div>
    </div>
  );
}

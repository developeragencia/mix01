import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center max-w-md w-full">
        <img 
          src={mixLogo} 
          alt="MIX Logo"
          className="h-16 mx-auto mb-6 object-contain"
        />
        
        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Página Não Encontrada</h2>
        <p className="text-white/80 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>

        <div className="space-y-3">
          <Button 
            onClick={() => setLocation("/")}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}

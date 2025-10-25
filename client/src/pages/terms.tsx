import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import mixLogo from "@assets/Logo_MIX_horizontal_1750591494976.png";
import { Shield, FileText, Eye, Users, Heart } from "lucide-react";

export default function Terms() {
  const [, setLocation] = useLocation();
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (accepted) {
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-between p-8 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="w-full flex justify-center items-center z-10 relative">
        <img 
          src={mixLogo} 
          alt="MIX" 
          className="h-12 w-auto drop-shadow-lg"
          data-testid="img-logo"
        />
        <button
          onClick={() => setLocation('/welcome-6')}
          className="absolute right-0 text-white/90 hover:text-white text-base font-medium"
          data-testid="button-back"
        >
          Voltar
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full z-10 px-4">
        <h1 className="text-white text-3xl font-bold text-center mb-3">
          Termos e Condições
        </h1>
        
        <p className="text-white/70 text-base text-center mb-6">
          Para começar, precisamos que você aceite nossos termos
        </p>

        <div 
          className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-6 shadow-2xl border border-white/20 max-h-80 overflow-y-auto scrollbar-transparent"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
          }}
        >
          <style>{`
            .scrollbar-transparent::-webkit-scrollbar {
              width: 8px;
            }
            .scrollbar-transparent::-webkit-scrollbar-track {
              background: transparent;
            }
            .scrollbar-transparent::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.2);
              border-radius: 10px;
            }
            .scrollbar-transparent::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          `}</style>
          <div className="text-white/90 space-y-3 text-xs">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-0.5 text-sm">Sobre o MIX</h3>
                <p>O MIX é uma plataforma de conexões sociais que visa ajudar pessoas a dar o primeiro passo em relacionamentos.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Users className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-0.5 text-sm">Funcionalidades</h3>
                <p>• Sistema de matching inteligente<br/>
                • Chat em tempo real<br/>
                • Perfil personalizado<br/>
                • Filtros avançados<br/>
                • Verificação de perfil</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Eye className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-0.5 text-sm">Privacidade</h3>
                <p>Seus dados são protegidos e nunca compartilhados com terceiros. Você tem controle total sobre sua visibilidade.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Heart className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-0.5 text-sm">Compromisso</h3>
                <p>Estamos comprometidos em criar um ambiente seguro, respeitoso e inclusivo para todos.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-0.5 text-sm">Termos de Uso</h3>
                <p className="mb-2">Ao usar o MIX, você concorda em:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Fornecer informações verdadeiras</li>
                  <li>Respeitar outros usuários</li>
                  <li>Não usar para fins comerciais</li>
                  <li>Reportar comportamentos inadequados</li>
                  <li>Não criar perfis falsos</li>
                  <li>Ter pelo menos 18 anos de idade</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 mb-6 w-full max-w-md bg-white/5 p-4 rounded-2xl border border-white/10">
          <Checkbox
            id="terms"
            checked={accepted}
            onCheckedChange={(checked) => setAccepted(checked as boolean)}
            className="mt-1 border-white/30 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
            data-testid="checkbox-terms"
          />
          <label
            htmlFor="terms"
            className="text-white/90 text-xs leading-relaxed cursor-pointer"
          >
            Li e concordo com os <span className="text-pink-400 font-semibold">Termos de Uso</span> e a <span className="text-pink-400 font-semibold">Política de Privacidade</span>. Declaro que tenho 18 anos ou mais.
          </label>
        </div>
      </div>

      <div className="w-full max-w-md space-y-6 z-10">
        <Button
          onClick={handleContinue}
          disabled={!accepted}
          className="w-full h-16 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold rounded-full shadow-2xl text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="button-continue"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
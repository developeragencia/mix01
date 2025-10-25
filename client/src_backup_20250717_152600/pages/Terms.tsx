import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";
import { Shield, FileText, Eye, Users, Heart } from "lucide-react";


export default function Terms() {
  const [, setLocation] = useLocation();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const handleContinue = () => {
    if (acceptedTerms && acceptedPrivacy) {
      setLocation("/user-type");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center relative">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/mix-logo.png" 
          alt="MIX" 
          className="animate-pulse w-20 h-20 object-contain"
        />
      </div>



      {/* Progress indicators - 5th slide */}
      <div className="flex space-x-3 mb-6">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === 4
                ? "w-8 bg-white"
                : "w-2 bg-white bg-opacity-40"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="max-w-xs space-y-4 mb-6">
        <h1 className="text-2xl font-bold text-white leading-tight text-center">
          Termos e Condições
        </h1>
        
        <p className="text-base text-white opacity-90 leading-relaxed text-center">
          Para começar, precisamos que você aceite nossos termos
        </p>
      </div>

      {/* Terms content with scroll */}
      <div className="w-full max-w-xs h-64 overflow-y-auto border-2 border-pink-500/30 rounded-lg p-4 bg-blue-900/40 mb-6 backdrop-blur-sm">
        <div className="text-blue-200 text-sm space-y-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1 text-xs">Sobre o MIX</h3>
              <p className="text-xs">O MIX é uma plataforma de conexões sociais que visa ajudar pessoas a dar o primeiro passo em relacionamentos.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Users className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1 text-xs">Funcionalidades</h3>
              <p className="text-xs">• Sistema de matching inteligente<br/>
              • Chat em tempo real<br/>
              • Perfil personalizado<br/>
              • Filtros avançados<br/>
              • Verificação de perfil</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Eye className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1 text-xs">Privacidade</h3>
              <p className="text-xs">Seus dados são protegidos e nunca compartilhados com terceiros. Você tem controle total sobre sua visibilidade.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Heart className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1 text-xs">Compromisso</h3>
              <p className="text-xs">Estamos comprometidos em criar um ambiente seguro, respeitoso e inclusivo para todos.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <FileText className="h-4 w-4 text-pink-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-1 text-xs">Termos de Uso</h3>
              <p className="text-xs">Ao usar o MIX, você concorda em:</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                <li>Fornecer informações verdadeiras</li>
                <li>Respeitar outros usuários</li>
                <li>Não usar para fins comerciais</li>
                <li>Reportar comportamentos inadequados</li>
                <li>Não criar perfis falsos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mb-6 w-full max-w-xs">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            className="border-blue-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
          />
          <label htmlFor="terms" className="text-sm text-white leading-tight">
            Concordo com os <span className="text-pink-400 underline">Termos de Uso</span>
          </label>
        </div>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="privacy"
            checked={acceptedPrivacy}
            onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
            className="border-blue-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
          />
          <label htmlFor="privacy" className="text-sm text-white leading-tight">
            Concordo com a <span className="text-pink-400 underline">Política de Privacidade</span>
          </label>
        </div>
      </div>

      {/* Continue button */}
      <Button
        onClick={handleContinue}
        disabled={!acceptedTerms || !acceptedPrivacy}
        className="bg-gradient-to-r from-blue-800 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-500 hover:to-pink-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl border border-blue-600/40"
      >
        Começar
      </Button>
    </div>
  );
}
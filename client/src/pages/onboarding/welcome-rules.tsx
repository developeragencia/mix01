import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

export default function WelcomeRules() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col p-6">
      {/* Close button */}
      <button
        onClick={() => setLocation("/login")}
        className="self-start mb-8"
        data-testid="button-close"
      >
        <X className="w-8 h-8 text-gray-400" />
      </button>

      {/* Logo */}
      <div className="mb-12 flex justify-center">
        <img src={mixLogo} alt="MIX" className="h-16 w-auto" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-8">
          <h1 className="text-white text-4xl font-bold leading-tight">
            Bem-vindo(a) ao<br />Mix.
          </h1>
          <p className="text-gray-400 text-lg">Siga as regras da casa.</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-white text-xl font-bold mb-2">
                Seja você mesmo(a).
              </h3>
              <p className="text-gray-400">
                Certifique-se de que suas fotos, idade e descrição sejam verdadeiras.
              </p>
            </div>

            <div>
              <h3 className="text-white text-xl font-bold mb-2">
                Proteja-se.
              </h3>
              <p className="text-gray-400">
                Não dê informações pessoais logo de cara.{" "}
                <span className="text-blue-400 underline">Dicas de segurança</span>
              </p>
            </div>

            <div>
              <h3 className="text-white text-xl font-bold mb-2">
                Seja legal.
              </h3>
              <p className="text-gray-400">
                Respeite os outros e os trate como você gostaria de ser tratado(a).
              </p>
            </div>

            <div>
              <h3 className="text-white text-xl font-bold mb-2">
                Seja pró-ativo(a).
              </h3>
              <p className="text-gray-400">
                Sempre denuncie mau comportamento.
              </p>
            </div>
          </div>
        </div>

        {/* Button */}
        <Button
          onClick={() => setLocation("/onboarding/name")}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-6 rounded-full text-lg shadow-xl"
          data-testid="button-accept"
        >
          Eu aceito
        </Button>
      </div>
    </div>
  );
}

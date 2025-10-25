import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

export default function OnboardingName() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleContinue = () => {
    if (name.trim()) {
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    localStorage.setItem("onboarding_name", name);
    setLocation("/onboarding/birthday");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "10%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4">
        <button onClick={() => setLocation("/onboarding/welcome")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-white text-4xl font-bold mb-4">
            Qual é o seu nome?
          </h1>
          
          <Input
            type="text"
            placeholder="Digite seu primeiro nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-b-2 border-gray-500 focus:border-pink-500 rounded-none text-white text-xl px-0 placeholder:text-gray-500"
            data-testid="input-name"
          />
          
          <p className="text-gray-400 text-sm mt-4">
            É assim que vai aparecer no seu perfil.<br />
            <span className="font-semibold">Não é possível alterar isso mais tarde.</span>
          </p>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-6 rounded-full text-lg"
          data-testid="button-continue"
        >
          Seguinte
        </Button>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-white text-2xl font-bold mb-2">
              Que bom te ver por aqui,<br />{name}!
            </h2>
            <p className="text-gray-400 mb-8">
              Tem muita gente pra você conhecer. Mas vamos configurar seu perfil primeiro.
            </p>
            <Button
              onClick={handleConfirm}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-4 rounded-full mb-3"
              data-testid="button-confirm"
            >
              Bora lá
            </Button>
            <Button
              onClick={() => setShowConfirmation(false)}
              variant="ghost"
              className="w-full text-white"
              data-testid="button-edit-name"
            >
              Editar nome
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

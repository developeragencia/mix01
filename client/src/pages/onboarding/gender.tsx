import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check, ChevronDown } from "lucide-react";

export default function OnboardingGender() {
  const [, setLocation] = useLocation();
  const [selectedGender, setSelectedGender] = useState("");
  const [showOnProfile, setShowOnProfile] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const handleContinue = () => {
    if (selectedGender) {
      localStorage.setItem("onboarding_gender", selectedGender);
      localStorage.setItem("onboarding_show_gender", showOnProfile.toString());
      setLocation("/onboarding/orientation");
    }
  };

  const genderOptions = ["Homem", "Mulher", "Além de binário"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "30%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => setLocation("/onboarding/birthday")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <button 
          onClick={() => setLocation("/onboarding/orientation")}
          className="text-gray-500 text-sm"
          data-testid="button-skip"
        >
          Pular
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-white text-4xl font-bold mb-3">
            Qual o seu gênero?
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Selecione todas as opções que melhor te descrevem pra gente poder mostrar seu perfil para as pessoas certas. Você pode adicionar mais detalhes se quiser.
          </p>
          
          <div className="space-y-3 mb-6">
            {genderOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedGender(option)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  selectedGender === option
                    ? "border-pink-500 bg-pink-500/20"
                    : "border-gray-600 bg-transparent"
                }`}
                data-testid={`button-gender-${option.toLowerCase()}`}
              >
                <span className="text-white font-medium">{option}</span>
                {selectedGender === option && (
                  <Check className="w-6 h-6 text-pink-500" />
                )}
              </button>
            ))}

            {showMoreOptions && (
              <button className="w-full p-4 rounded-2xl border-2 border-gray-600 bg-transparent text-white font-medium">
                Adicione mais informações sobre seu gênero (opcional)
              </button>
            )}
          </div>

          {!showMoreOptions && (
            <button
              onClick={() => setShowMoreOptions(true)}
              className="text-blue-400 text-sm flex items-center gap-1 mb-8"
            >
              Saiba como o Mix usa esta informação
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setShowOnProfile(!showOnProfile)}
            className="flex items-center gap-3"
            data-testid="button-show-gender"
          >
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
              showOnProfile ? "bg-pink-500 border-pink-500" : "border-gray-600"
            }`}>
              {showOnProfile && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="text-white">Mostrar gênero no perfil</span>
          </button>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedGender}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 text-white font-bold py-6 rounded-full text-lg"
          data-testid="button-continue"
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}

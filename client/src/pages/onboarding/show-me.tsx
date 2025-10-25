import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";

export default function OnboardingShowMe() {
  const [, setLocation] = useLocation();
  const [selectedPreference, setSelectedPreference] = useState("");

  const handleContinue = () => {
    if (selectedPreference) {
      localStorage.setItem("onboarding_show_me", selectedPreference);
      setLocation("/onboarding/looking-for");
    }
  };

  const preferenceOptions = [
    { value: "men", label: "Homens" },
    { value: "women", label: "Mulheres" },
    { value: "nonbinary", label: "Além de binário" },
    { value: "everyone", label: "Todos" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "50%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4">
        <button onClick={() => setLocation("/onboarding/orientation")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-white text-4xl font-bold mb-3">
            O que você gostaria de ver?
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Selecione todas as opções aplicáveis pra gente poder recomendar as pessoas certas pra você.
          </p>
          
          <div className="space-y-3 mb-6">
            {preferenceOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPreference(option.value)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  selectedPreference === option.value
                    ? "border-pink-500 bg-pink-500/20"
                    : "border-gray-600 bg-transparent"
                }`}
                data-testid={`button-preference-${option.value}`}
              >
                <span className="text-white font-medium">{option.label}</span>
                {selectedPreference === option.value && (
                  <Check className="w-6 h-6 text-pink-500" />
                )}
              </button>
            ))}
          </div>

          <button className="text-blue-400 text-sm underline">
            Saiba como o Mix usa esta informação
          </button>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedPreference}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-600 text-white font-bold py-6 rounded-full text-lg"
          data-testid="button-continue"
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}

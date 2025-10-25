import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";

export default function OnboardingOrientation() {
  const [, setLocation] = useLocation();
  const [selectedOrientation, setSelectedOrientation] = useState("");
  const [showOnProfile, setShowOnProfile] = useState(false);

  const handleContinue = () => {
    if (selectedOrientation) {
      localStorage.setItem("onboarding_orientation", selectedOrientation);
      localStorage.setItem("onboarding_show_orientation", showOnProfile.toString());
      setLocation("/onboarding/show-me");
    }
  };

  const orientationOptions = [
    {
      value: "heterosexual",
      title: "Heterossexual",
      description: "Alguém que se sente atraído exclusivamente por pessoas do gênero oposto"
    },
    {
      value: "homosexual",
      title: "Homossexual",
      description: "Um termo abrangente usado para descrever alguém que sente atração por pessoas do mesmo gênero"
    },
    {
      value: "lesbian",
      title: "Lésbica",
      description: "Uma mulher que sente atração sexual, romântica ou emocional por outra mulher"
    },
    {
      value: "bisexual",
      title: "Bissexual",
      description: "Alguém que pode sentir atração sexual, romântica ou emocional por pessoas de mais de um gênero"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "40%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => setLocation("/onboarding/gender")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <button 
          onClick={() => setLocation("/onboarding/show-me")} 
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
            Qual é a sua orientação sexual?
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Selecione todas as opções que melhor te descrevem pra refletir sua identidade.
          </p>
          
          <div className="space-y-3 mb-8">
            {orientationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedOrientation(option.value)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedOrientation === option.value
                    ? "border-pink-500 bg-pink-500/20"
                    : "border-gray-600 bg-transparent"
                }`}
                data-testid={`button-orientation-${option.value}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{option.title}</h3>
                    <p className="text-gray-400 text-sm">{option.description}</p>
                  </div>
                  {selectedOrientation === option.value && (
                    <Check className="w-5 h-5 text-pink-500 ml-2 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowOnProfile(!showOnProfile)}
            className="flex items-center gap-3"
            data-testid="button-show-orientation"
          >
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
              showOnProfile ? "bg-pink-500 border-pink-500" : "border-gray-600"
            }`}>
              {showOnProfile && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="text-white">Mostrar orientação sexual no perfil</span>
          </button>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedOrientation}
          className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-6 rounded-full text-lg"
          data-testid="button-continue"
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft } from "lucide-react";

export default function OnboardingDistance() {
  const [, setLocation] = useLocation();
  const [distance, setDistance] = useState(80);

  const handleContinue = () => {
    localStorage.setItem("onboarding_distance", distance.toString());
    setLocation("/onboarding/personality");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "70%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => setLocation("/onboarding/looking-for")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <button 
          onClick={() => setLocation("/onboarding/personality")} 
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
            Distância máxima?
          </h1>
          <p className="text-gray-400 text-sm mb-12">
            Use o controle deslizante para definir a distância máxima dos seus matches em potencial.
          </p>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Preferência de distância</span>
              <span className="text-white font-bold">{distance} km</span>
            </div>
            
            <Slider
              value={[distance]}
              onValueChange={(value) => setDistance(value[0])}
              max={160}
              min={1}
              step={1}
              className="w-full"
              data-testid="slider-distance"
            />
          </div>

          <p className="text-gray-400 text-sm text-center">
            Você pode alterar as preferências mais tarde nas Configurações
          </p>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-6 rounded-full text-lg"
          data-testid="button-continue"
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}

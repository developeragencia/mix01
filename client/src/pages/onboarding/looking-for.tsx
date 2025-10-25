import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function OnboardingLookingFor() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string[]>([]);

  const handleContinue = () => {
    if (selected.length > 0) {
      localStorage.setItem("onboarding_looking_for", JSON.stringify(selected));
      setLocation("/onboarding/distance");
    }
  };

  const toggleOption = (value: string) => {
    setSelected(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const options = [
    { value: "serious", emoji: "💘", title: "Relacionamento sério" },
    { value: "open", emoji: "😍", title: "Algo sério, mas vamos ver..." },
    { value: "fun", emoji: "🍾", title: "Nada sério, mas depende..." },
    { value: "casual", emoji: "🎉", title: "Algo casual" },
    { value: "friends", emoji: "🤚", title: "Novas amizades" },
    { value: "unsure", emoji: "🤔", title: "Ainda não sei" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "60%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4">
        <button onClick={() => setLocation("/onboarding/show-me")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-white text-4xl font-bold mb-3">
            O que você está procurando?
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Você pode mudar de ideia. No Mix, não faltam opções.
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`aspect-square rounded-3xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                  selected.includes(option.value)
                    ? "border-pink-500 bg-pink-500/20"
                    : "border-gray-700 bg-gray-800/50"
                }`}
                data-testid={`button-option-${option.value}`}
              >
                <div className="text-4xl mb-2">{option.emoji}</div>
                <div className="text-white text-xs text-center font-medium leading-tight">
                  {option.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-6 rounded-full text-lg"
          data-testid="button-continue"
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}

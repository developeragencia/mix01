import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

export default function OnboardingBirthday() {
  const [, setLocation] = useLocation();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleContinue = () => {
    if (day && month && year) {
      localStorage.setItem("onboarding_birthday", `${day}/${month}/${year}`);
      setLocation("/onboarding/gender");
    }
  };

  const isValid = day.length === 2 && month.length === 2 && year.length === 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "20%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4">
        <button onClick={() => setLocation("/onboarding/name")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-white text-4xl font-bold mb-8">
            Seu aniversário?
          </h1>
          
          <div className="flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="D D"
              maxLength={2}
              value={day}
              onChange={(e) => setDay(e.target.value.replace(/\D/g, ""))}
              className="w-20 bg-transparent border-b-2 border-gray-500 focus:border-pink-500 rounded-none text-white text-3xl text-center px-0 placeholder:text-gray-600"
              data-testid="input-day"
            />
            <span className="text-gray-500 text-3xl">/</span>
            <Input
              type="text"
              placeholder="M M"
              maxLength={2}
              value={month}
              onChange={(e) => setMonth(e.target.value.replace(/\D/g, ""))}
              className="w-20 bg-transparent border-b-2 border-gray-500 focus:border-pink-500 rounded-none text-white text-3xl text-center px-0 placeholder:text-gray-600"
              data-testid="input-month"
            />
            <span className="text-gray-500 text-3xl">/</span>
            <Input
              type="text"
              placeholder="A A A A"
              maxLength={4}
              value={year}
              onChange={(e) => setYear(e.target.value.replace(/\D/g, ""))}
              className="w-32 bg-transparent border-b-2 border-gray-500 focus:border-pink-500 rounded-none text-white text-3xl text-center px-0 placeholder:text-gray-600"
              data-testid="input-year"
            />
          </div>
          
          <p className="text-gray-400 text-sm">
            Seu perfil mostra sua idade, não sua data de nascimento.
          </p>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!isValid}
          className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-6 rounded-full text-lg"
          data-testid="button-continue"
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}

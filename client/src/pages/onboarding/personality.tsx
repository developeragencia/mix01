import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquare, GraduationCap, Sparkles } from "lucide-react";

export default function OnboardingPersonality() {
  const [, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState({
    communication: [] as string[],
    education: [] as string[],
    sign: "",
    loveLanguage: [] as string[]
  });

  const handleContinue = () => {
    if (currentPage < 3) {
      setCurrentPage(currentPage + 1);
    } else {
      localStorage.setItem("onboarding_personality", JSON.stringify(answers));
      setLocation("/onboarding/interests");
    }
  };

  const toggleAnswer = (category: keyof typeof answers, value: string) => {
    setAnswers(prev => {
      const current = prev[category];
      if (Array.isArray(current)) {
        return {
          ...prev,
          [category]: current.includes(value) 
            ? current.filter(v => v !== value)
            : [...current, value]
        };
      }
      return { ...prev, [category]: value };
    });
  };

  const pages = [
    {
      title: "O que faz de você uma pessoa única?",
      subtitle: "Não guarde segredo. Autenticidade atrai autenticidade.",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      question: "Qual é o seu estilo de comunicação?",
      options: [
        "Fico no WhatsApp o dia todo",
        "Fico o dia inteiro no Whats",
        "Gosto de falar no telefone",
        "Adoro chamadas de vídeo",
        "Demoro pra responder no WhatsApp",
        "Odeio falar por mensagem",
        "Melhor falar pessoalmente"
      ],
      category: "communication" as const
    },
    {
      title: "O que faz de você uma pessoa única?",
      subtitle: "Não guarde segredo. Autenticidade atrai autenticidade.",
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      question: "Qual é o seu nível de escolaridade?",
      options: [
        "Superior completo",
        "Fazendo faculdade",
        "Cursando o Ensino Médio",
        "Doutorado completo",
        "Fazendo pós",
        "Mestrado completo",
        "Curso técnico"
      ],
      category: "education" as const
    },
    {
      title: "O que faz de você uma pessoa única?",
      subtitle: "Não guarde segredo. Autenticidade atrai autenticidade.",
      icon: <Sparkles className="w-6 h-6 text-white" />,
      question: "Qual é o seu signo?",
      options: [
        "Capricórnio", "Aquário", "Peixes", "Áries",
        "Touro", "Gêmeos", "Câncer", "Leão",
        "Virgem", "Libra", "Escorpião", "Sagitário"
      ],
      category: "sign" as const,
      singleSelect: true
    },
    {
      title: "O que faz de você uma pessoa única?",
      subtitle: "Não guarde segredo. Autenticidade atrai autenticidade.",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      question: "Como você recebe amor?",
      options: [
        "Gestos de serviço",
        "Presentes",
        "Toque físico",
        "Elogios",
        "Tempo de qualidade"
      ],
      category: "loveLanguage" as const
    }
  ];

  const currentPageData = pages[currentPage];
  const currentAnswer = answers[currentPageData.category];
  const hasAnswer = Array.isArray(currentAnswer) ? currentAnswer.length > 0 : !!currentAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: `${75 + (currentPage * 2.5)}%` }}></div>
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={() => currentPage > 0 ? setCurrentPage(currentPage - 1) : setLocation("/onboarding/distance")}
          data-testid="button-back"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <button 
          onClick={() => setLocation("/onboarding/interests")} 
          className="text-gray-500 text-sm"
          data-testid="button-skip"
        >
          Pular
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">
            {currentPageData.title}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            {currentPageData.subtitle}
          </p>
          
          <div className="flex items-center gap-2 mb-4">
            {currentPageData.icon}
            <h2 className="text-white font-semibold">{currentPageData.question}</h2>
          </div>

          <div className="space-y-2 flex flex-wrap gap-2">
            {currentPageData.options.map((option) => {
              const isSelected = Array.isArray(currentAnswer) 
                ? currentAnswer.includes(option)
                : currentAnswer === option;
              
              return (
                <button
                  key={option}
                  onClick={() => toggleAnswer(currentPageData.category, option)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    isSelected
                      ? "border-pink-500 bg-pink-500/20 text-white"
                      : "border-gray-600 bg-transparent text-gray-300"
                  }`}
                  data-testid={`button-option-${option}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center text-sm text-gray-500">
            Próxima {currentPage}/4
          </div>
          <Button
            onClick={handleContinue}
            disabled={!hasAnswer}
            className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-6 rounded-full text-lg"
            data-testid="button-continue"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}

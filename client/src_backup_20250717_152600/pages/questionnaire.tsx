import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: string;
  question: string;
  options: string[];
  required: boolean;
}

const questions: Question[] = [
  {
    id: "preference_size",
    question: "Qual é sua preferência de tamanho?",
    options: [
      "Grande e fino",
      "Grande e grosso", 
      "Médio",
      "Médio grosso",
      "Médio normal",
      "Pequeno e grosso",
      "Pequeno e fino"
    ],
    required: true
  },
  {
    id: "relationship_type",
    question: "Que tipo de relacionamento você busca?",
    options: [
      "Relacionamento sério",
      "Encontros casuais",
      "Amizade",
      "Não tenho certeza"
    ],
    required: true
  },
  {
    id: "age_preference",
    question: "Qual sua faixa etária preferida?",
    options: [
      "18-25 anos",
      "26-35 anos",
      "36-45 anos",
      "46+ anos"
    ],
    required: true
  },
  {
    id: "lifestyle",
    question: "Como você descreveria seu estilo de vida?",
    options: [
      "Muito ativo",
      "Moderadamente ativo",
      "Caseiro",
      "Aventureiro",
      "Tranquilo"
    ],
    required: true
  }
];

export default function Questionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/questionnaire/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        toast({
          title: "Questionário concluído!",
          description: "Suas preferências foram salvas com sucesso.",
        });
        setLocation("/games");
      } else {
        const data = await response.json();
        toast({
          title: "Erro ao salvar",
          description: data.message || "Erro ao salvar suas respostas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro de conexão",
        description: "Verifique sua conexão e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[currentQuestionData.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Questionário de Preferências
          </h1>
          <p className="text-gray-600">
            Ajude-nos a encontrar matches perfeitos para você
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestionData.question}
            </CardTitle>
            {currentQuestionData.required && (
              <CardDescription>
                Esta pergunta é obrigatória
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestionData.id] || ""}
              onValueChange={(value) => handleAnswer(currentQuestionData.id, value)}
              className="space-y-3"
            >
              {currentQuestionData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label 
                    htmlFor={`option-${index}`}
                    className="text-sm cursor-pointer flex-1 py-2"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between space-x-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Anterior
          </Button>
          
          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {isSubmitting ? "Salvando..." : "Finalizar"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Próxima
            </Button>
          )}
        </div>

        {/* Skip Button */}
        <div className="text-center mt-4">
          <button
            onClick={() => setLocation("/games")}
            className="text-gray-500 text-sm hover:text-gray-700 underline"
          >
            Pular questionário (não recomendado)
          </button>
        </div>
      </div>
    </div>
  );
}
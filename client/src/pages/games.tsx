import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Heart, X, Trophy, Star } from "lucide-react";

interface GameQuestion {
  id: string;
  scenario: string;
  options: {
    text: string;
    type: "heart" | "x";
    points: number;
  }[];
}

const gameQuestions: GameQuestion[] = [
  {
    id: "scenario_1",
    scenario: "Você está em um primeiro encontro e a pessoa chega 30 minutos atrasada sem avisar. Como você reage?",
    options: [
      {
        text: "Fico irritado(a) e considero isso desrespeitoso",
        type: "x",
        points: 5
      },
      {
        text: "Compreendo que imprevistos acontecem e dou uma segunda chance",
        type: "heart",
        points: 10
      }
    ]
  },
  {
    id: "scenario_2",
    scenario: "Em um relacionamento, você prefere...",
    options: [
      {
        text: "Ter total liberdade e independência",
        type: "x",
        points: 5
      },
      {
        text: "Compartilhar a maioria das atividades juntos",
        type: "heart",
        points: 10
      }
    ]
  },
  {
    id: "scenario_3",
    scenario: "Quando há um conflito no relacionamento, você...",
    options: [
      {
        text: "Evita confrontos e prefere deixar passar",
        type: "x",
        points: 5
      },
      {
        text: "Conversa abertamente para resolver o problema",
        type: "heart",
        points: 10
      }
    ]
  },
  {
    id: "scenario_4",
    scenario: "Qual é mais importante para você em um relacionamento?",
    options: [
      {
        text: "Atração física e química",
        type: "x",
        points: 5
      },
      {
        text: "Conexão emocional e intelectual",
        type: "heart",
        points: 10
      }
    ]
  },
  {
    id: "scenario_5",
    scenario: "Como você lida com ciúmes?",
    options: [
      {
        text: "Fico possessivo(a) e expresso minha insatisfação",
        type: "x",
        points: 5
      },
      {
        text: "Converso sobre meus sentimentos de forma madura",
        type: "heart",
        points: 10
      }
    ]
  }
];

export default function Games() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleAnswer = (questionId: string, option: any) => {
    const newAnswers = {
      ...answers,
      [questionId]: option
    };
    setAnswers(newAnswers);
    setTotalPoints(prev => prev + option.points);

    // Auto-advance to next question
    setTimeout(() => {
      if (currentQuestion < gameQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setGameCompleted(true);
      }
    }, 1000);
  };

  const handleCompleteGame = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/games/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          answers,
          totalPoints,
          gameType: "compatibility_test"
        }),
      }).catch(() => null);

      if (response && response.ok) {
        toast({
          title: "Jogo concluído!",
          description: `Você fez ${totalPoints} pontos! Redirecionando para o painel...`,
        });
        setTimeout(() => {
          setLocation("/participant-dashboard");
        }, 2000);
      } else if (response) {
        const data = await response.json().catch(() => ({ message: "Erro desconhecido" }));
        toast({
          title: "Erro ao salvar",
          description: data.message || "Erro ao salvar resultado do jogo",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro de conexão",
          description: "Falha na conexão com o servidor",
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

  const progress = ((currentQuestion + 1) / gameQuestions.length) * 100;
  const currentQuestionData = gameQuestions[currentQuestion];

  const getPerformanceMessage = () => {
    if (totalPoints >= 45) return "Excelente! Você tem uma mentalidade muito madura para relacionamentos! 🏆";
    if (totalPoints >= 35) return "Muito bom! Você entende bem como construir relacionamentos saudáveis! ⭐";
    if (totalPoints >= 25) return "Bom trabalho! Você está no caminho certo! 💪";
    return "Continue praticando! Relacionamentos são uma jornada de aprendizado! 🌱";
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-lg mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              </div>
              <CardTitle className="text-2xl">Parabéns!</CardTitle>
              <CardDescription>
                Você completou o jogo de compatibilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Sua Pontuação</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {totalPoints}/50 pontos
                </div>
                <p className="text-sm text-gray-600">
                  {getPerformanceMessage()}
                </p>
              </div>
              
              <Button
                onClick={handleCompleteGame}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3"
              >
                {isSubmitting ? "Salvando..." : "Ir para o Painel do Participante"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Jogo de Compatibilidade
          </h1>
          <p className="text-gray-600">
            Teste sua maturidade em relacionamentos
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Pergunta {currentQuestion + 1} de {gameQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestionData.scenario}
            </CardTitle>
            <CardDescription>
              Escolha a opção que mais se identifica com você
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestionData.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className={`w-full p-4 h-auto text-left justify-start hover:bg-gradient-to-r ${
                  option.type === "heart" 
                    ? "hover:from-pink-50 hover:to-red-50 hover:border-pink-300"
                    : "hover:from-gray-50 hover:to-gray-100 hover:border-gray-300"
                }`}
                onClick={() => handleAnswer(currentQuestionData.id, option)}
              >
                <div className="flex items-center space-x-3">
                  {option.type === "heart" ? (
                    <Heart className="h-5 w-5 text-pink-500" />
                  ) : (
                    <X className="h-5 w-5 text-gray-500" />
                  )}
                  <span className="text-sm">{option.text}</span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Points Display */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Pontos: {totalPoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
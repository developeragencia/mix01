import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mountain, Leaf, Home, Dumbbell } from "lucide-react";

export default function OnboardingInterests() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string[]>([]);

  const handleContinue = () => {
    localStorage.setItem("onboarding_interests", JSON.stringify(selected));
    setLocation("/onboarding/photos");
  };

  const toggleInterest = (value: string) => {
    setSelected(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : prev.length < 10 ? [...prev, value] : prev
    );
  };

  const categories = [
    {
      icon: <Mountain className="w-5 h-5" />,
      title: "Atividades ao ar livre e aventura",
      interests: ["Remo", "Saltos Ornamentais", "Jet ski", "Tours a pé", "Natureza", "Ski", "Snowboard", "Bares de praia", "Velejar", "Camping", "Fontes termais", "Passear com o cachorro", "Canoagem", "Viagens de carro", "Couchsurfing", "Mergulho livre", "Viagem", "Stand Up Paddle", "Surfe", "Parapente", "Trilha", "Montanhas", "Mochilão", "Escalada em rocha", "Pesca", "Ar livre", "Piquenique"]
    },
    {
      icon: <Leaf className="w-5 h-5" />,
      title: "Bem-estar e estilo de vida",
      interests: ["Amor próprio", "Experimentar coisas novas", "Tarô", "Spa", "Autocuidado", "Autodesenvolvimento", "Meditação", "Skincare", "Maquiagem", "Astrologia", "Mindfulness", "Sauna", "Estilo de vida ativo", "Yoga"]
    },
    {
      icon: <Home className="w-5 h-5" />,
      title: "De boa em casa",
      interests: ["Leitura", "Maratonar séries", "Treino em casa", "Trivia", "Cozinhar", "Jogos online", "Compras online", "Jardinagem", "Jogos de tabuleiro", "Fazer pães e bolos"]
    },
    {
      icon: <Dumbbell className="w-5 h-5" />,
      title: "Esportes e fitness",
      interests: ["Hóquei no gelo", "Tiro Esportivo", "Atletismo", "Futebol americano", "Crossfit", "Esportes", "Caminhada", "Esportes de praia", "Aulas fitness", "Patinação", "Rugby", "Boxe", "Badminton", "Pilates", "Cheerleading"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "85%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => setLocation("/onboarding/personality")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <button 
          onClick={() => setLocation("/onboarding/photos")} 
          className="text-gray-500 text-sm"
          data-testid="button-skip"
        >
          Pular
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-white text-3xl font-bold mb-2">
            O que você curte?
          </h1>
          <p className="text-gray-400 text-sm">
            Adicione até 10 interesses ao seu perfil para encontrar pessoas que gostam do mesmo que você.
          </p>
        </div>

        <div className="flex-1 space-y-6 mb-6">
          {categories.map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-3">
                {category.icon}
                <h2 className="text-white font-semibold">{category.title}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      selected.includes(interest)
                        ? "border-pink-500 bg-pink-500/20 text-white"
                        : "border-gray-600 bg-transparent text-gray-300"
                    }`}
                    data-testid={`button-interest-${interest}`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 sticky bottom-0 bg-gradient-to-t from-blue-900 pt-4">
          <div className="text-center text-sm text-gray-400">
            Próxima {selected.length}/10
          </div>
          <Button
            onClick={handleContinue}
            disabled={selected.length === 0}
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

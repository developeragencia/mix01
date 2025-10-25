import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function EditProfile() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/20 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white text-xl font-bold">Editar Perfil</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center">
            <h3 className="text-white text-lg font-bold mb-4">Funcionalidade em Desenvolvimento</h3>
            <p className="text-white/80 text-sm mb-6">
              A edição de perfil será implementada em breve com todas as funcionalidades do banco de dados.
            </p>
            <Button 
              onClick={() => setLocation('/profile')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Voltar ao Perfil
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, AlertTriangle, UserX, MessageSquareX, Flag, Phone, Lock } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function SafetyTools() {
  const [, setLocation] = useLocation();

  const safetyTools = [
    {
      id: 1,
      title: "Denunciar Usuário",
      description: "Reporte comportamentos inadequados ou suspeitos",
      icon: Flag,
      color: "bg-red-500",
      action: () => alert("Funcionalidade de denúncia será implementada em breve")
    },
    {
      id: 2,
      title: "Bloquear Perfil",
      description: "Bloqueie usuários indesejados permanentemente",
      icon: UserX,
      color: "bg-orange-500",
      action: () => console.log("Bloquear perfil")
    },
    {
      id: 3,
      title: "Modo Privado",
      description: "Controle quem pode ver seu perfil",
      icon: Lock,
      color: "bg-purple-500",
      action: () => console.log("Modo privado")
    },
    {
      id: 4,
      title: "Filtrar Mensagens",
      description: "Configure filtros para mensagens inadequadas",
      icon: MessageSquareX,
      color: "bg-blue-500",
      action: () => console.log("Filtrar mensagens")
    },
    {
      id: 5,
      title: "Central de Ajuda",
      description: "Acesse dicas e orientações de segurança",
      icon: AlertTriangle,
      color: "bg-yellow-500",
      action: () => setLocation('/help')
    },
    {
      id: 6,
      title: "Contato de Emergência",
      description: "Números importantes para situações de risco",
      icon: Phone,
      color: "bg-green-500",
      action: () => console.log("Contato de emergência")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-800 to-pink-700">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-transparent">
        <Button
          variant="ghost"
          size="icon"
          className="text-white"
          onClick={() => setLocation('/messages')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-white text-lg font-bold">Kit de Segurança</h1>
        
        <div className="w-10 h-10 flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-20">
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Sua Segurança em Primeiro Lugar</h2>
                <p className="text-white/80 text-sm">Ferramentas para uma experiência segura</p>
              </div>
            </div>
          </div>

          {/* Safety Tools Grid */}
          <div className="space-y-4">
            {safetyTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={tool.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-all duration-200"
                  onClick={tool.action}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-base">{tool.title}</h3>
                      <p className="text-white/70 text-sm">{tool.description}</p>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-white/60 rotate-180" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emergency Info */}
          <div className="mt-8 bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-400/30">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-white font-bold">Em Caso de Emergência</h3>
            </div>
            <p className="text-white/90 text-sm mb-3">
              Se você se sentir ameaçado ou em perigo, entre em contato imediatamente:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span className="text-white font-medium">Polícia: 190</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span className="text-white font-medium">SAMU: 192</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-400" />
                <span className="text-white font-medium">Bombeiros: 193</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "@/components/BottomNavigation";

export default function Likes() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"likes" | "highlights">("likes");
  
  // Número de matches - você pode puxar isso de uma API
  const matchCount = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Header com logo */}
      <div className="p-4">
        <img 
          src="/mix-logo-horizontal.png" 
          alt="MIX" 
          className="h-8 object-contain"
        />
      </div>

      {/* Campo de busca */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder={`Buscar ${matchCount} Matches`}
            className="w-full bg-gray-900 text-gray-400 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
            data-testid="input-search-matches"
          />
        </div>
      </div>

      {/* Abas */}
      <div className="flex border-b border-gray-800 mb-8">
        <button
          onClick={() => setActiveTab("likes")}
          className={`flex-1 py-3 text-center font-semibold relative transition-colors ${
            activeTab === "likes"
              ? "text-white"
              : "text-gray-500"
          }`}
          data-testid="tab-likes"
        >
          O curtidas
          {activeTab === "likes" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("highlights")}
          className={`flex-1 py-3 text-center font-semibold relative transition-colors ${
            activeTab === "highlights"
              ? "text-white"
              : "text-gray-500"
          }`}
          data-testid="tab-highlights"
        >
          Destaques
          <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
            •
          </span>
          {activeTab === "highlights" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500"></div>
          )}
        </button>
      </div>

      {/* Conteúdo - Estado vazio */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-24 text-center">
        {activeTab === "likes" ? (
          <>
            <div className="mb-6">
              <div className="text-8xl mb-4">💛</div>
            </div>
            <h2 className="text-white text-xl font-bold mb-2">
              Faça um upgrade para o Gold e veja quem já curtiu você.
            </h2>
            <div className="mt-8 w-full max-w-sm">
              <Button
                onClick={() => setLocation("/plans")}
                className="w-full h-14 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg rounded-full"
                data-testid="button-see-who-liked"
              >
                Veja quem curtiu você
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="text-8xl mb-4">⭐</div>
            </div>
            <h2 className="text-white text-xl font-bold mb-2">
              Seus Destaques aparecerão aqui
            </h2>
            <p className="text-gray-500 text-sm">
              Quando você receber um destaque, ele aparecerá nesta seção
            </p>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}

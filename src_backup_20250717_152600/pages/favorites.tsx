import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Heart, Star, Clock } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";

export default function Favorites() {
  const [, setLocation] = useLocation();
  
  // Mock data dos locais favoritos
  const favoriteLocations = [
    {
      id: 1,
      name: "Bar Imaginario",
      address: "Rua das Flores, 123 - Centro",
      distance: "0.5 km",
      rating: 4.5,
      category: "Bar",
      photo: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop&crop=center&auto=format&q=60",
      isOpen: true,
      description: "Ambiente descontraído com música ao vivo",
    },
    {
      id: 2,
      name: "Café da Esquina",
      address: "Av. Principal, 456 - Bairro Novo",
      distance: "1.2 km",
      rating: 4.8,
      category: "Café",
      photo: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop&crop=center&auto=format&q=60",
      isOpen: false,
      description: "Melhor café da cidade com doces caseiros",
    },
    {
      id: 3,
      name: "Restaurante Bella Vista",
      address: "Rua do Comércio, 789 - Vila Alta",
      distance: "2.1 km",
      rating: 4.3,
      category: "Restaurante",
      photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop&crop=center&auto=format&q=60",
      isOpen: true,
      description: "Culinária italiana autêntica e ambiente romântico",
    },
    {
      id: 4,
      name: "Pub do Rock",
      address: "Rua da Música, 321 - Centro Histórico",
      distance: "1.8 km",
      rating: 4.6,
      category: "Pub",
      photo: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&h=300&fit=crop&crop=center&auto=format&q=60",
      isOpen: true,
      description: "Rock'n'roll e cerveja gelada todos os dias",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
      {/* Header */}
      <header className="bg-transparent sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-white text-xl font-bold">Locais Favoritos</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-20">
        <div className="mb-6">
          <p className="text-purple-200 text-sm text-center">
            Seus bares e restaurantes favoritos aparecem aqui
          </p>
        </div>

        {/* Favorite Locations Grid */}
        <div className="space-y-4">
          {favoriteLocations.map((location) => (
            <div
              key={location.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex gap-4">
                {/* Location Photo */}
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={location.photo}
                    alt={location.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Location Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-bold text-lg">{location.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{location.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-purple-300" />
                    <span className="text-purple-200 text-sm">{location.address}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-purple-300 text-sm">{location.distance}</span>
                    <span className="text-purple-300 text-sm">•</span>
                    <span className="text-purple-300 text-sm">{location.category}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-purple-300" />
                      <span className={`text-sm ${location.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                        {location.isOpen ? 'Aberto' : 'Fechado'}
                      </span>
                    </div>
                  </div>

                  <p className="text-purple-200 text-sm mb-3">{location.description}</p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setLocation(`/location/${location.id}`)}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-full text-sm flex-1"
                    >
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-400 text-purple-300 hover:bg-purple-600/20 px-4 py-2 rounded-full text-sm"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {favoriteLocations.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum local favorito ainda
            </h3>
            <p className="text-white/60 mb-6">
              Favorite locais enquanto descobre novos lugares!
            </p>
            <Button
              onClick={() => setLocation('/discover')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-full"
            >
              Descobrir Locais
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
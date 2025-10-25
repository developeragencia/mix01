import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Star, Heart, Eye, Clock } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import logoPath from "@assets/Logo_MIX_horizontal_1750591494976.png";

interface FavoritePlace {
  id: number;
  name: string;
  type: string;
  location: string;
  rating: number;
  image: string;
  distance: string;
  openUntil: string;
  description: string;
  features: string[];
}

export default function Favorites() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Simulando dados de locais favoritos
  const favoritePlaces: FavoritePlace[] = [
    {
      id: 1,
      name: "Vila Madalena",
      type: "Bairro",
      location: "São Paulo, SP",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop",
      distance: "2.5 km",
      openUntil: "24h",
      description: "Bairro boêmio com muitos bares e vida noturna agitada",
      features: ["Bares", "Restaurantes", "Arte de rua", "Vida noturna"]
    },
    {
      id: 2,
      name: "Ibirapuera",
      type: "Parque",
      location: "São Paulo, SP",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      distance: "3.2 km",
      openUntil: "18:00",
      description: "Parque urbano ideal para exercícios e relaxamento",
      features: ["Natureza", "Esportes", "Museus", "Eventos"]
    },
    {
      id: 3,
      name: "Mercado Municipal",
      type: "Mercado",
      location: "São Paulo, SP",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      distance: "5.1 km",
      openUntil: "18:00",
      description: "Mercado tradicional com comidas típicas e produtos locais",
      features: ["Gastronomia", "Tradição", "Compras", "Cultura"]
    },
    {
      id: 4,
      name: "Pinacoteca",
      type: "Museu",
      location: "São Paulo, SP",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      distance: "4.8 km",
      openUntil: "17:00",
      description: "Museu de arte brasileira com acervo histórico",
      features: ["Arte", "Cultura", "História", "Exposições"]
    },
    {
      id: 5,
      name: "Jardins",
      type: "Bairro",
      location: "São Paulo, SP",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=400&h=300&fit=crop",
      distance: "3.7 km",
      openUntil: "22:00",
      description: "Bairro elegante com lojas de luxo e restaurantes sofisticados",
      features: ["Shopping", "Restaurantes", "Luxo", "Moda"]
    },
    {
      id: 6,
      name: "Liberdade",
      type: "Bairro",
      location: "São Paulo, SP",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      distance: "4.2 km",
      openUntil: "20:00",
      description: "Bairro oriental com cultura japonesa e gastronomia asiática",
      features: ["Cultura", "Gastronomia", "Festivais", "Tradição"]
    }
  ];

  const categories = [
    { id: "all", name: "Todos", count: favoritePlaces.length },
    { id: "bairro", name: "Bairros", count: favoritePlaces.filter(p => p.type === "Bairro").length },
    { id: "parque", name: "Parques", count: favoritePlaces.filter(p => p.type === "Parque").length },
    { id: "mercado", name: "Mercados", count: favoritePlaces.filter(p => p.type === "Mercado").length },
    { id: "museu", name: "Museus", count: favoritePlaces.filter(p => p.type === "Museu").length }
  ];

  const filteredPlaces = selectedCategory === "all" 
    ? favoritePlaces 
    : favoritePlaces.filter(place => place.type.toLowerCase() === selectedCategory);

  const removeFavorite = (placeId: number) => {
    console.log(`Removendo favorito: ${placeId}`);
    // Aqui seria implementada a lógica de remoção
  };

  const openPlaceDetails = (placeId: number) => {
    setLocation(`/place/${placeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-transparent sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20"
            onClick={() => setLocation('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <img 
              src={logoPath} 
              alt="MIX Logo" 
              className="h-6 w-auto"
            />
          </div>
          
          <div className="w-10 h-10"></div> {/* Spacer */}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pb-20">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Locais Favoritos</h1>
          <p className="text-white/80">Seus lugares preferidos para encontros</p>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-white text-blue-900"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Places Grid */}
        <div className="space-y-4">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex space-x-4">
                {/* Image */}
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{place.name}</h3>
                      <p className="text-white/70 text-sm">{place.type}</p>
                    </div>
                    <button
                      onClick={() => removeFavorite(place.id)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors"
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-white/80 text-sm">{place.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">{place.openUntil}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-white/80 text-sm">{place.rating}</span>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-3">{place.description}</p>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {place.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="bg-white/20 text-white text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openPlaceDetails(place.id)}
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Ver Detalhes
                    </button>
                    <button
                      onClick={() => setLocation(`/directions/${place.id}`)}
                      className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      Direções
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlaces.length === 0 && (
          <div className="text-center py-16">
            <Star className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg mb-2">Nenhum favorito nesta categoria</p>
            <p className="text-white/40 text-sm">Explore novos lugares e adicione aos seus favoritos!</p>
            <Button
              onClick={() => setLocation('/discover')}
              className="mt-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              Descobrir Lugares
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
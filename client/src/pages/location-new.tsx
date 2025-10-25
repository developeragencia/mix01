import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  QrCode, 
  Camera,
  Loader2, 
  Crown,
  X,
  Users,
  Star,
  Search,
  Filter,
  Heart,
  MessageCircle
} from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";
import BottomNavigation from "@/components/BottomNavigation";

// Pessoas próximas para descobrir - baseado na imagem
const pessoasProximas = [
  {
    id: 1,
    nome: "Ana",
    idade: 24,
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    distancia: "0.5 km",
    online: true,
    verificado: true,
    superLike: false,
    bio: "Adoro viajar e conhecer lugares novos",
    interesses: ["Viagem", "Café", "Arte"]
  },
  {
    id: 2,
    nome: "Carlos", 
    idade: 28,
    foto: "https://randomuser.me/api/portraits/men/45.jpg",
    distancia: "0.8 km",
    online: false,
    verificado: true,
    superLike: true,
    bio: "Músico e amante do cinema",
    interesses: ["Música", "Cinema", "Shows"]
  },
  {
    id: 3,
    nome: "Marina",
    idade: 26,
    foto: "https://randomuser.me/api/portraits/women/55.jpg", 
    distancia: "1.2 km",
    online: true,
    verificado: false,
    superLike: false,
    bio: "Personal trainer e dançarina",
    interesses: ["Dança", "Fitness", "Yoga"]
  },
  {
    id: 4,
    nome: "Rafael",
    idade: 30,
    foto: "https://randomuser.me/api/portraits/men/67.jpg",
    distancia: "1.5 km", 
    online: true,
    verificado: true,
    superLike: false,
    bio: "Desenvolvedor apaixonado por tecnologia",
    interesses: ["Tecnologia", "Games", "Inovação"]
  }
];

export default function LocationNew() {
  const [, setLocation] = useLocation();
  const [selectedFilter, setSelectedFilter] = useState<string>("todos");
  const [isLoading, setIsLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleQRScan = async () => {
    setIsLoading(true);
    setShowQRScanner(true);
    
    // Simula scan de QR Code
    setTimeout(() => {
      const testLocation = {
        local: "Vila Madalena",
        cidade: "São Paulo",
        endereco: "Rua Harmonia, São Paulo",
        tipo: "Área Urbana"
      };
      
      localStorage.setItem("lastCheckIn", JSON.stringify({
        timestamp: new Date().toISOString(),
        ...testLocation
      }));
      localStorage.setItem("isCheckedIn", "true");
      localStorage.setItem("checkedInLocation", testLocation.local);
      
      alert(`🎉 Check-in realizado!
      
📍 ${testLocation.local}
🏙️ ${testLocation.cidade}
⏰ ${new Date().toLocaleTimeString('pt-BR')}

🔥 Agora você está conectado ao local!`);
      
      setIsLoading(false);
      setShowQRScanner(false);
    }, 3000);
  };

  const filteredPessoas = pessoasProximas.filter(pessoa => {
    if (selectedFilter === "online") return pessoa.online;
    if (selectedFilter === "verificados") return pessoa.verificado;
    if (selectedFilter === "super-likes") return pessoa.superLike;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="flex flex-col px-4 py-6 pb-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full max-w-sm mx-auto flex-1"
        >
          {/* Header moderno baseado na imagem */}
          <motion.div variants={cardVariants} className="flex items-center justify-between mb-8">
            <div className="flex-shrink-0">
              <img src={mixLogoHorizontal} alt="Mix Logo" className="h-8 object-contain" />
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setLocation("/premium")}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-2 px-4 rounded-full shadow-lg text-sm"
              >
                <Crown className="h-4 w-4 mr-1" />
                Premium
              </Button>
              
              <Button
                onClick={() => setLocation("/profile")}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20"
              >
                <Users className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          {/* Título principal */}
          <motion.div variants={cardVariants} className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Bem-vindo ao MIX
            </h1>
            <p className="text-white/70 text-sm">
              Descubra pessoas incríveis perto de você
            </p>
          </motion.div>

          {/* Card de localização moderna */}
          <motion.div variants={cardVariants} className="mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Sua Localização</h3>
                    <p className="text-white/70 text-sm">São Paulo, Vila Madalena</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-pink-400">{pessoasProximas.length}</div>
                  <div className="text-white/70 text-xs">pessoas próximas</div>
                </div>
              </div>
              
              <Button
                onClick={handleQRScan}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Escaneando...
                  </>
                ) : (
                  <>
                    <QrCode className="h-5 w-5 mr-2" />
                    Fazer Check-in
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Filtros modernos */}
          <motion.div variants={cardVariants} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Pessoas Próximas</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              {[
                { key: "todos", label: "Todos" },
                { key: "online", label: "Online" },
                { key: "verificados", label: "Verificados" },
                { key: "super-likes", label: "Super Likes" }
              ].map((filter) => (
                <Button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilter === filter.key
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Grid de pessoas - design moderno baseado na imagem */}
          <motion.div variants={cardVariants} className="grid grid-cols-2 gap-4">
            {filteredPessoas.map((pessoa, index) => (
              <motion.div
                key={pessoa.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 cursor-pointer"
                onClick={() => setLocation(`/profile/${pessoa.id}`)}
              >
                <div className="relative mb-3">
                  <img
                    src={pessoa.foto}
                    alt={pessoa.nome}
                    className="w-full h-32 object-cover rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${pessoa.nome}&background=gradient&color=fff&size=200`;
                    }}
                  />
                  {pessoa.online && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                  {pessoa.verificado && (
                    <div className="absolute top-2 left-2 bg-blue-500 rounded-full p-1">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {pessoa.superLike && (
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                      <Star className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white truncate">{pessoa.nome}</h3>
                    <span className="text-white/70 text-sm">{pessoa.idade}</span>
                  </div>
                  <p className="text-white/60 text-xs">{pessoa.distancia}</p>
                  <p className="text-white/70 text-xs line-clamp-2">{pessoa.bio}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      {pessoa.interesses.slice(0, 2).map((interesse, idx) => (
                        <span key={idx} className="bg-white/20 text-white/80 text-xs px-2 py-1 rounded-full">
                          {interesse}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-pink-500 transition-colors p-0"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-blue-500 transition-colors p-0"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Botão de continuar */}
          <motion.div variants={cardVariants} className="mt-8">
            <Button
              onClick={() => setLocation("/discover")}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg text-lg"
            >
              Começar a Descobrir
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scanner QR Code Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl max-w-sm mx-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-10 w-10 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Escaneando QR Code</h3>
              <p className="text-white/70 mb-4">Aponte a câmera para o QR Code do local</p>
              <div className="flex items-center justify-center gap-1 mb-4">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
              <Button
                onClick={() => {
                  setIsLoading(false);
                  setShowQRScanner(false);
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
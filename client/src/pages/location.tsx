import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  QrCode, 
  Store, 
  Loader2, 
  Crown,
  X,
  Users,
  Star,
  Check
} from "lucide-react";
import QrScanner from "qr-scanner";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";
import { useQuery } from "@tanstack/react-query";
import type { Establishment, Profile } from "@shared/schema";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Localizacao() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<string>("");
  const [showEstabelecimentos, setShowEstabelecimentos] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<any>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPessoas, setShowPessoas] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, city: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [distanceFilter, setDistanceFilter] = useState<number>(5); // km
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const qrScannerRef = useRef<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Verificar autenticação
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // ✅ Geolocalização automática ao carregar
  useEffect(() => {
    getUserLocation();
  }, []);

  // ✅ Obter localização do usuário
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Geocoding reverso para obter cidade
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "São Paulo";
          
          setUserLocation({
            lat: latitude,
            lng: longitude,
            city: city
          });
          
          toast({
            title: "Localização obtida! 📍",
            description: `Você está em ${city}`,
            duration: 3000
          });
        } catch (error) {
          setUserLocation({
            lat: latitude,
            lng: longitude,
            city: "São Paulo"
          });
        }
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        toast({
          title: "Erro ao obter localização",
          description: "Não foi possível acessar sua localização. Usando São Paulo como padrão.",
          variant: "destructive",
          duration: 3000
        });
        setUserLocation({
          lat: -23.5505,
          lng: -46.6333,
          city: "São Paulo"
        });
        setIsGettingLocation(false);
      }
    );
  };

  // ✅ Calcular distância entre dois pontos (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Buscar estabelecimentos reais
  const { data: estabelecimentos = [], isLoading: isLoadingEstabelecimentos } = useQuery<Establishment[]>({
    queryKey: ['/api/establishments'],
    enabled: true,
    staleTime: 15 * 60 * 1000, // ⚡ 15 minutos - estabelecimentos não mudam frequentemente
    gcTime: 30 * 60 * 1000, // ⚡ 30 minutos em cache
    refetchOnWindowFocus: false, // ⚡ Não refetch ao focar
    queryFn: async () => {
      const response = await fetch("/api/establishments", {
        credentials: 'include' // ✅ CRÍTICO: Envia cookies de sessão
      });
      if (!response.ok) {
        throw new Error('Failed to fetch establishments');
      }
      return response.json();
    }
  });

  // ✅ Filtrar estabelecimentos por busca e distância
  const filteredEstabelecimentos = estabelecimentos.filter(est => {
    const matchesSearch = !searchTerm || 
      est.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por distância se houver coordenadas
    if (userLocation && est.latitude && est.longitude) {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        est.latitude, 
        est.longitude
      );
      return matchesSearch && distance <= distanceFilter;
    }
    
    return matchesSearch;
  });

  // Buscar pessoas próximas reais
  const { data: pessoasProximas = [] } = useQuery<Profile[]>({
    queryKey: ['/api/profiles/discovery'],
    enabled: true,
    staleTime: 5 * 60 * 1000, // ⚡ 5 minutos - pessoas próximas
    gcTime: 15 * 60 * 1000, // ⚡ 15 minutos em cache
    refetchOnWindowFocus: false, // ⚡ Não refetch ao focar
    queryFn: async () => {
      const response = await fetch("/api/profiles/discovery", {
        credentials: 'include' // ✅ CRÍTICO: Envia cookies de sessão
      });
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }
      return response.json();
    }
  });

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Inicia o scanner de QR Code
  const startQRScanner = async () => {
    if (!videoRef.current) return;
    
    try {
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        alert("Nenhuma câmera detectada no dispositivo.");
        setIsLoading(null);
        setShowQRScanner(false);
        return;
      }

      const qrScanner = new QrScanner(
        videoRef.current,
        result => onQrCodeScanned(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
          maxScansPerSecond: 5,
          returnDetailedScanResult: true
        }
      );
      
      qrScannerRef.current = qrScanner;
      await qrScanner.start();
      setIsLoading(null);
    } catch (error: any) {
      console.error("Erro ao iniciar scanner:", error);
      let errorMessage = "Erro ao acessar a câmera.";
      
      if (error?.name === 'NotAllowedError') {
        errorMessage = "Permissão de câmera negada. Por favor, permita o acesso à câmera.";
      } else if (error?.name === 'NotFoundError') {
        errorMessage = "Nenhuma câmera encontrada no dispositivo.";
      } else if (error?.name === 'NotSupportedError') {
        errorMessage = "Câmera não suportada neste navegador.";
      }
      
      alert(errorMessage);
      setIsLoading(null);
      setShowQRScanner(false);
    }
  };

  // Processa o resultado do QR Code
  const onQrCodeScanned = (data: string) => {
    setQrResult(data);
    setSelectedOption("qr");
    stopQRScanner();
    
    try {
      const locationData = JSON.parse(data);
      if (locationData.local && locationData.cidade) {
        alert(`✅ Check-in realizado com sucesso!\nLocal: ${locationData.local}\nCidade: ${locationData.cidade}\n\nAgora você só verá pessoas deste local!`);
      } else {
        alert(`✅ Check-in realizado: ${data}\n\nVocê está conectado ao local onde fez o check-in!`);
      }
    } catch {
      alert(`✅ Check-in realizado: ${data}\n\nVocê está conectado ao local onde fez o check-in!`);
    }
  };

  // Para o scanner de QR Code
  const stopQRScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsLoading(null);
    setShowQRScanner(false);
  };

  // Manipula clique em estabelecimento
  const handleEstablishment = () => {
    setSelectedOption("estabelecimento");
    setShowEstabelecimentos(true);
  };

  // Manipula escaneamento de QR Code
  const handleQRScan = async () => {
    setIsLoading("qr");
    setShowQRScanner(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    await startQRScanner();
  };

  // Simula um QR Code para teste
  const handleTestQRCode = () => {
    const testData = JSON.stringify({
      local: "Bar Teste",
      cidade: "São Paulo",
      endereco: "Rua Teste, 123"
    });
    onQrCodeScanned(testData);
  };

  // Manipula seleção de estabelecimento
  const handleEstabelecimentoClick = (estabelecimento: any) => {
    if (estabelecimento.premium) {
      setShowPlanModal(true);
      setSelectedEstabelecimento(estabelecimento);
    }
  };

  // Continua para próxima página
  const handleContinue = () => {
    if (selectedOption) {
      const locationData = {
        method: selectedOption,
        qrData: qrResult,
        estabelecimento: selectedEstabelecimento
      };
      localStorage.setItem("userLocation", JSON.stringify(locationData));
      setLocation("/discover");
    }
  };

  // Manipula assinatura Premium
  const handleSubscribe = () => {
    setLocation("/subscription");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white flex flex-col items-center justify-center px-3 py-6 pb-28">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md mx-auto"
      >
        {/* Header com logo e botão premium - Layout melhorado */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="bg-transparent">
            <img src={mixLogoHorizontal} alt="Mix Logo" className="h-7 object-contain drop-shadow-lg" data-testid="img-logo" />
          </div>
          
          <Button 
            onClick={() => setShowPlanModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-2 px-5 rounded-xl shadow-2xl text-sm transform hover:scale-105 transition-transform"
            data-testid="button-premium"
          >
            <Crown className="h-4 w-4 mr-1" />
            PREMIUM
          </Button>
        </motion.div>

        {/* Título e descrição - Design aprimorado */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-pink-500/20 p-3 rounded-full backdrop-blur-sm">
              <MapPin className="h-8 w-8 text-pink-400" />
            </div>
            <h1 className="text-4xl font-bold">Descobrir</h1>
          </div>
          <p className="text-blue-200 text-lg">
            Encontre pessoas incríveis perto de você
          </p>
        </motion.div>
        
        {/* Mapa estilo Google Maps - Visual melhorado */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-2 border-blue-300/30">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg">
                  {isGettingLocation ? (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4 text-blue-500" />
                  )}
                </div>
                <span className="text-white font-semibold text-sm">
                  {isGettingLocation ? "Localizando..." : (userLocation?.city || "São Paulo")}, SP
                </span>
              </div>
              <div className="text-xs text-blue-100 font-medium">Maps</div>
            </div>
            
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
              <div className="absolute inset-0">
                {/* Grid do mapa */}
                <div className="absolute top-0 left-1/4 w-px h-full bg-gray-300/50"></div>
                <div className="absolute top-0 left-2/4 w-px h-full bg-gray-300/50"></div>
                <div className="absolute top-0 left-3/4 w-px h-full bg-gray-300/50"></div>
                <div className="absolute top-1/4 left-0 w-full h-px bg-gray-300/50"></div>
                <div className="absolute top-2/4 left-0 w-full h-px bg-gray-300/50"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-gray-300/50"></div>
                
                {/* Marcadores animados */}
                <motion.div 
                  className="absolute top-4 left-8 w-4 h-4 bg-pink-500 rounded-full shadow-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-12 right-12 w-4 h-4 bg-purple-500 rounded-full shadow-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute bottom-8 left-16 w-4 h-4 bg-green-500 rounded-full shadow-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.div 
                  className="absolute bottom-4 right-8 w-4 h-4 bg-orange-500 rounded-full shadow-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
                
                {/* Você está aqui */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div 
                    className="w-7 h-7 bg-blue-600 rounded-full shadow-2xl border-3 border-white flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </motion.div>
                </div>
              </div>
              
              {/* Info box */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 shadow-xl border border-gray-200">
                <div className="text-xs text-gray-700 font-bold">São Paulo Centro</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {pessoasProximas.length || 8} pessoas online
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Opções de localização - Cards redesenhados */}
        <motion.div variants={itemVariants} className="space-y-4 mb-8">
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h3 className="text-xl font-semibold text-blue-100 mb-3">
              Como você quer descobrir pessoas?
            </h3>
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-4 mb-4 border-2 border-pink-300/30 backdrop-blur-sm shadow-lg">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-green-300 font-semibold">{pessoasProximas.length || 127} pessoas online</span>
                </div>
                <div className="text-blue-200 font-medium">
                  São Paulo • 2.5km
                </div>
              </div>
            </div>
          </motion.div>

          {/* Opção 1: Estabelecimento - Redesenhado */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleEstablishment}
              className={`w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 p-4 h-auto rounded-2xl shadow-xl ${
                selectedOption === "estabelecimento" 
                  ? "bg-gradient-to-r from-pink-600 to-pink-700 border-2 border-pink-400" 
                  : "bg-white/10 hover:bg-white/20 border-2 border-white/20"
              } backdrop-blur-sm text-white transition-all duration-200`}
              data-testid="button-estabelecimentos"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-pink-500/30 p-3 rounded-xl flex-shrink-0">
                  <Store className="h-6 w-6 text-pink-300" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-bold text-base">Ver estabelecimentos próximos</div>
                  <div className="text-xs text-blue-100">
                    {filteredEstabelecimentos.length || estabelecimentos.length || 35} locais • Bares e restaurantes
                  </div>
                </div>
              </div>
              <div className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg self-start sm:self-center flex-shrink-0">
                POPULAR
              </div>
            </Button>
          </motion.div>

          {/* Opção 2: Descobrir Pessoas - Redesenhado */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => {
                setSelectedOption("pessoas");
                setShowPessoas(true);
              }}
              className={`w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 p-4 h-auto rounded-2xl shadow-xl ${
                selectedOption === "pessoas" 
                  ? "bg-gradient-to-r from-pink-600 to-pink-700 border-2 border-pink-400" 
                  : "bg-white/10 hover:bg-white/20 border-2 border-white/20"
              } backdrop-blur-sm text-white transition-all duration-200`}
              data-testid="button-pessoas"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-pink-500/30 p-3 rounded-xl flex-shrink-0">
                  <Users className="h-6 w-6 text-pink-300" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-bold text-base">Descobrir pessoas próximas</div>
                  <div className="text-xs text-blue-100">
                    {pessoasProximas.length || 127} online • 6 super likes disponíveis
                  </div>
                </div>
              </div>
              <motion.div 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg self-start sm:self-center flex-shrink-0"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                HOT
              </motion.div>
            </Button>
          </motion.div>

          {/* Opção 3: QR Code - Redesenhado */}
          <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleQRScan}
              disabled={isLoading === "qr"}
              className={`w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 p-4 h-auto rounded-2xl shadow-xl ${
                selectedOption === "qr" 
                  ? "bg-gradient-to-r from-pink-600 to-pink-700 border-2 border-pink-400" 
                  : "bg-white/10 hover:bg-white/20 border-2 border-white/20"
              } backdrop-blur-sm text-white transition-all duration-200 disabled:opacity-50`}
              data-testid="button-qr"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-pink-500/30 p-3 rounded-xl flex-shrink-0">
                  {isLoading === "qr" ? (
                    <Loader2 className="h-6 w-6 text-pink-300 animate-spin" />
                  ) : (
                    <QrCode className="h-6 w-6 text-pink-300" />
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-bold text-base">
                    {isLoading === "qr" ? "Iniciando câmera..." : "Fazer check-in com QR Code"}
                  </div>
                  <div className="text-xs text-blue-100">
                    {qrResult ? `Último scan: ${qrResult.substring(0, 30)}...` : "Escaneie o QR Code do local"}
                  </div>
                </div>
              </div>
              <div className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg self-start sm:self-center flex-shrink-0">
                GRÁTIS
              </div>
            </Button>
          </motion.div>
        </motion.div>

        {/* Botão Continuar */}
        {selectedOption && (
          <motion.div 
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Button 
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-transform"
              data-testid="button-continuar"
            >
              <Check className="w-5 h-5 mr-2" />
              Continuar
            </Button>
          </motion.div>
        )}

      </motion.div>

      {/* Modal Scanner QR Code */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Scanner QR Code</h3>
              <Button 
                onClick={stopQRScanner}
                variant="ghost" 
                size="sm"
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                data-testid="button-close-scanner"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4 border-2 border-gray-200">
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted
              />
            </div>
            
            <p className="text-gray-600 text-center text-sm mb-4">
              Aponte a câmera para o QR Code do estabelecimento
            </p>
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-500 text-xs text-center mb-2">
                Problemas com a câmera?
              </p>
              <Button 
                onClick={handleTestQRCode}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold"
                data-testid="button-test-qr"
              >
                Simular Check-in de Teste
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Lista de Estabelecimentos */}
      {showEstabelecimentos && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Estabelecimentos em {userLocation?.city || "SP"}</h3>
                <Button 
                  onClick={() => setShowEstabelecimentos(false)}
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full"
                  data-testid="button-close-estabelecimentos"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* ✅ Busca e filtros */}
              <div className="space-y-3">
                <input 
                  type="text"
                  placeholder="Buscar estabelecimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-pink-100">Distância máxima:</span>
                  <select 
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg text-gray-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-300"
                  >
                    <option value={2}>2 km</option>
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={20}>20 km</option>
                    <option value={50}>50 km</option>
                  </select>
                </div>
                
                <p className="text-pink-100 text-xs">
                  {filteredEstabelecimentos.length} estabelecimentos encontrados
                </p>
              </div>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {isLoadingEstabelecimentos ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="w-full p-4 bg-gray-100 rounded-2xl">
                        <div className="h-6 bg-gray-300 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEstabelecimentos.length === 0 ? (
                <div className="text-center py-12">
                  <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {searchTerm ? "Nenhum estabelecimento encontrado" : "Nenhum estabelecimento disponível"}
                  </p>
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="mt-3 text-pink-600 text-sm font-semibold hover:underline"
                    >
                      Limpar busca
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEstabelecimentos.map((estabelecimento) => {
                    const distance = userLocation && estabelecimento.latitude && estabelecimento.longitude
                      ? calculateDistance(userLocation.lat, userLocation.lng, estabelecimento.latitude, estabelecimento.longitude)
                      : null;
                    
                    return (
                    <motion.div
                      key={estabelecimento.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={() => handleEstabelecimentoClick(estabelecimento)}
                        className="w-full p-4 h-auto bg-gray-50 hover:bg-gray-100 text-gray-800 border-2 border-gray-200 rounded-2xl flex items-center justify-between shadow-md"
                        data-testid={`estabelecimento-${estabelecimento.id}`}
                      >
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-bold text-lg">{estabelecimento.name}</div>
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              PRO
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">{estabelecimento.type}</div>
                          <div className="text-xs text-gray-500">{estabelecimento.address}</div>
                          {distance && (
                            <div className="text-xs text-blue-600 font-semibold mt-1">
                              📍 {distance.toFixed(1)} km de distância
                            </div>
                          )}
                        </div>
                        <div className="text-gray-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
                          </svg>
                        </div>
                      </Button>
                    </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Plano Premium */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <div className="p-6 text-center">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="h-10 w-10 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Acesso Premium Necessário</h3>
              <p className="text-gray-600 mb-6">
                Para acessar estabelecimentos específicos e ver apenas pessoas desses locais, 
                você precisa do plano Premium. Faça upgrade agora!
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-5 mb-6 border-2 border-yellow-200">
                <h4 className="font-bold text-gray-800 mb-3">🎯 Com o Plano Premium você pode:</h4>
                <ul className="text-sm text-gray-700 space-y-2 text-left">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Acessar bares e restaurantes específicos
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Ver apenas pessoas desses estabelecimentos
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Matches ilimitados
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Super likes diários
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Filtros avançados de busca
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 space-y-3">
              <Button 
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 text-lg rounded-2xl shadow-lg transform hover:scale-105 transition-transform"
                data-testid="button-assinar"
              >
                <Crown className="h-5 w-5 mr-2" />
                Assinar Premium - R$ 19,90/mês
              </Button>
              <Button 
                onClick={() => setShowPlanModal(false)}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl py-3"
                data-testid="button-cancelar-premium"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Pessoas Próximas */}
      {showPessoas && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl"
          >
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Pessoas Próximas</h3>
                <Button 
                  onClick={() => setShowPessoas(false)}
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full"
                  data-testid="button-close-pessoas"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-pink-100 text-sm mt-2">
                Descubra pessoas incríveis perto de você
              </p>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              {pessoasProximas.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma pessoa por perto</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {pessoasProximas.map((pessoa) => (
                    <motion.div
                      key={pessoa.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-50 rounded-2xl p-3 border-2 border-gray-200 shadow-md cursor-pointer"
                      onClick={() => setLocation(`/profile/${pessoa.userId}`)}
                      data-testid={`pessoa-${pessoa.id}`}
                    >
                      <div className="relative mb-2">
                        <img 
                          src={pessoa.photos?.[0] || "https://via.placeholder.com/120"}
                          alt={pessoa.name || "Usuário"}
                          className="w-full aspect-square object-cover rounded-xl"
                        />
                        {pessoa.isVerified && (
                          <div className="absolute top-2 left-2">
                            <Star className="h-5 w-5 text-yellow-400 fill-current drop-shadow-lg" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <span className="font-bold text-gray-800">{pessoa.name || "Usuário"}</span>
                        </div>
                        <div className="text-sm text-gray-600">{pessoa.age || 25} anos</div>
                        <div className="text-xs text-gray-500 mt-1">📍 Próximo</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Menu Inferior */}
      <BottomNavigation />
    </div>
  );
}

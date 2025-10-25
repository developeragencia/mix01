import { useState, useRef } from "react";
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
  Star
} from "lucide-react";
import QrScanner from "qr-scanner";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591379272.png";

// Bares e estabelecimentos reais de São Paulo
const estabelecimentos = [
  { id: 1, nome: "Boteco do Valentim", tipo: "Bar", bairro: "Vila Madalena", distancia: "1.2 km", premium: true },
  { id: 2, nome: "Astor", tipo: "Bar/Restaurante", bairro: "Vila Madalena", distancia: "1.5 km", premium: true },
  { id: 3, nome: "Posto 6", tipo: "Bar", bairro: "Vila Madalena", distancia: "1.3 km", premium: true },
  { id: 4, nome: "Bar Secreto", tipo: "Speakeasy", bairro: "Rua Augusta", distancia: "2.1 km", premium: true },
  { id: 5, nome: "Skye Bar", tipo: "Rooftop Bar", bairro: "Jardins", distancia: "3.1 km", premium: true },
  { id: 6, nome: "Mocotó", tipo: "Bar/Restaurante", bairro: "Itaim Bibi", distancia: "4.1 km", premium: true },
  { id: 7, nome: "Bar da Dona Onça", tipo: "Bar/Restaurante", bairro: "Pinheiros", distancia: "2.8 km", premium: true },
  { id: 8, nome: "Bar Brahma", tipo: "Bar Tradicional", bairro: "Centro", distancia: "5.2 km", premium: true }
];

// Pessoas próximas para descobrir
const pessoasProximas = [
  {
    id: 1,
    nome: "Ana",
    idade: 28,
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
    distancia: "500m",
    online: true,
    verificado: true,
    superLike: false,
    interesses: ["Arte", "Café", "Viagem"]
  },
  {
    id: 2,
    nome: "Carlos", 
    idade: 32,
    foto: "https://randomuser.me/api/portraits/men/45.jpg",
    distancia: "800m",
    online: false,
    verificado: true,
    superLike: true,
    interesses: ["Música", "Cinema"]
  },
  {
    id: 3,
    nome: "Fernanda",
    idade: 26,
    foto: "https://randomuser.me/api/portraits/women/55.jpg", 
    distancia: "1.2km",
    online: true,
    verificado: false,
    superLike: false,
    interesses: ["Dança", "Fitness"]
  },
  {
    id: 4,
    nome: "Rafael",
    idade: 29,
    foto: "https://randomuser.me/api/portraits/men/67.jpg",
    distancia: "1.5km", 
    online: true,
    verificado: true,
    superLike: false,
    interesses: ["Tecnologia", "Games"]
  }
];

export default function Localizacao() {
  const [, setLocation] = useLocation();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [qrResult, setQrResult] = useState<string>("");
  const [showEstabelecimentos, setShowEstabelecimentos] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<any>(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPessoas, setShowPessoas] = useState(false);
  
  const qrScannerRef = useRef<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    const userData = localStorage.getItem("userData");
    
    if (userData) {
      setLocation("/checkout");
    } else {
      localStorage.setItem("pendingSubscription", "true");
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] text-white flex flex-col items-center justify-center p-6">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md mx-auto"
      >
        {/* Header com logo e botão premium */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="bg-transparent">
            <img src={mixLogoHorizontal} alt="Mix Logo" className="h-6 object-contain" />
          </div>
          
          <Button 
            onClick={() => setShowPlanModal(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-2 px-4 rounded-xl shadow-lg text-sm"
          >
            <Crown className="h-4 w-4 mr-1" />
            PREMIUM
          </Button>
        </motion.div>

        {/* Título e descrição */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-8 w-8 text-pink-400" />
            <h1 className="text-3xl font-bold">Descobrir</h1>
          </div>
          <p className="text-blue-200">
            Encontre pessoas incríveis perto de você
          </p>
        </motion.div>
        
        {/* Mapa estilo Google Maps */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200">
            <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700 font-medium text-sm">São Paulo, SP</span>
              </div>
              <div className="text-xs text-gray-500">Maps</div>
            </div>
            
            <div className="aspect-video bg-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gray-300"></div>
                <div className="absolute top-0 left-2/4 w-px h-full bg-gray-300"></div>
                <div className="absolute top-0 left-3/4 w-px h-full bg-gray-300"></div>
                <div className="absolute top-1/4 left-0 w-full h-px bg-gray-300"></div>
                <div className="absolute top-2/4 left-0 w-full h-px bg-gray-300"></div>
                <div className="absolute top-3/4 left-0 w-full h-px bg-gray-300"></div>
                
                <div className="absolute top-4 left-8 w-3 h-3 bg-pink-500 rounded-full shadow-md animate-pulse"></div>
                <div className="absolute top-12 right-12 w-3 h-3 bg-purple-500 rounded-full shadow-md animate-pulse delay-500"></div>
                <div className="absolute bottom-8 left-16 w-3 h-3 bg-green-500 rounded-full shadow-md animate-pulse delay-1000"></div>
                <div className="absolute bottom-4 right-8 w-3 h-3 bg-orange-500 rounded-full shadow-md animate-pulse delay-1500"></div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                <div className="text-xs text-gray-700 font-medium">São Paulo Centro</div>
                <div className="text-xs text-gray-500">8 pessoas online</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Opções de localização */}
        <motion.div variants={itemVariants} className="space-y-4 mb-8">
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h3 className="text-xl font-semibold text-blue-100 mb-2">
              Como você quer descobrir pessoas?
            </h3>
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-3 mb-4 border border-pink-300/30">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-medium">127 pessoas online</span>
                </div>
                <div className="text-blue-200">
                  São Paulo • 2.5km
                </div>
              </div>
            </div>
          </motion.div>

          {/* Opção 1: Estabelecimento */}
          <motion.div variants={itemVariants}>
            <Button 
              onClick={handleEstablishment}
              className={`w-full flex items-center justify-start gap-3 p-4 h-auto ${
                selectedOption === "estabelecimento" 
                  ? "bg-pink-600 hover:bg-pink-700" 
                  : "bg-white/10 hover:bg-white/20"
              } border border-white/20 text-white transition-all duration-200`}
            >
              <Store className="h-6 w-6 text-pink-400" />
              <div className="text-left flex-1">
                <div className="font-medium">Ver estabelecimentos próximos</div>
                <div className="text-sm text-blue-200">
                  35 locais • Bares e restaurantes
                </div>
              </div>
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                POPULAR
              </div>
            </Button>
          </motion.div>

          {/* Opção 2: Descobrir Pessoas */}
          <motion.div variants={itemVariants}>
            <Button 
              onClick={() => {
                setSelectedOption("pessoas");
                setShowPessoas(true);
              }}
              className={`w-full flex items-center justify-start gap-3 p-4 h-auto ${
                selectedOption === "pessoas" 
                  ? "bg-pink-600 hover:bg-pink-700" 
                  : "bg-white/10 hover:bg-white/20"
              } border border-white/20 text-white transition-all duration-200`}
            >
              <Users className="h-6 w-6 text-pink-400" />
              <div className="text-left flex-1">
                <div className="font-medium">Descobrir pessoas próximas</div>
                <div className="text-sm text-blue-200">
                  127 online • 6 super likes disponíveis
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                HOT
              </div>
            </Button>
          </motion.div>

          {/* Opção 3: QR Code */}
          <motion.div variants={itemVariants}>
            <Button 
              onClick={handleQRScan}
              disabled={isLoading === "qr"}
              className={`w-full flex items-center justify-start gap-3 p-4 h-auto ${
                selectedOption === "qr" 
                  ? "bg-pink-600 hover:bg-pink-700" 
                  : "bg-white/10 hover:bg-white/20"
              } border border-white/20 text-white transition-all duration-200 disabled:opacity-50`}
            >
              {isLoading === "qr" ? (
                <Loader2 className="h-6 w-6 text-pink-400 animate-spin" />
              ) : (
                <QrCode className="h-6 w-6 text-pink-400" />
              )}
              <div className="text-left flex-1">
                <div className="font-medium">
                  {isLoading === "qr" ? "Iniciando câmera..." : "Fazer check-in com QR Code"}
                </div>
                <div className="text-sm text-blue-200">
                  {qrResult ? `Último scan: ${qrResult.substring(0, 30)}...` : "Escaneie o QR Code do local"}
                </div>
              </div>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                GRÁTIS
              </div>
            </Button>
          </motion.div>
        </motion.div>

        {/* Botão Continuar */}
        {selectedOption && (
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            <Button 
              onClick={handleContinue}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-lg font-semibold text-lg"
            >
              Continuar
            </Button>
          </motion.div>
        )}

        {/* Opção de Pular */}
        <motion.div 
          variants={itemVariants}
          className="mt-6"
        >
          <Button 
            onClick={() => setLocation("/discover")}
            variant="ghost"
            className="w-full text-blue-200 hover:text-white hover:bg-white/10 py-3 rounded-lg font-medium"
          >
            Pular por agora
          </Button>
          <p className="text-xs text-blue-300 text-center mt-2">
            Você pode configurar sua localização depois nas configurações
          </p>
        </motion.div>
      </motion.div>

      {/* Modal Scanner QR Code */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Scanner QR Code</h3>
              <Button 
                onClick={stopQRScanner}
                variant="ghost" 
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-sm"
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
            className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Estabelecimentos em SP</h3>
                <Button 
                  onClick={() => setShowEstabelecimentos(false)}
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-pink-100 text-sm mt-2">
                Escolha onde você quer se conectar
              </p>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {estabelecimentos.map((estabelecimento) => (
                  <motion.div
                    key={estabelecimento.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleEstabelecimentoClick(estabelecimento)}
                      className="w-full p-4 h-auto bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-xl flex items-center justify-between"
                    >
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold">{estabelecimento.nome}</div>
                          {estabelecimento.premium && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              PRO
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{estabelecimento.tipo} • {estabelecimento.bairro}</div>
                        <div className="text-xs text-gray-500">{estabelecimento.distancia}</div>
                      </div>
                      <div className="text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
                        </svg>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
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
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">Acesso Premium Necessário</h3>
              <p className="text-gray-600 mb-6">
                Para acessar estabelecimentos específicos e ver apenas pessoas desses locais, 
                você precisa do plano Premium. Faça upgrade agora!
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">🎯 Com o Plano Premium você pode:</h4>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Acessar bares e restaurantes específicos</li>
                  <li>• Ver apenas pessoas desses estabelecimentos</li>
                  <li>• Matches ilimitados</li>
                  <li>• Super likes diários</li>
                  <li>• Modo invisível</li>
                  <li>• Filtros avançados de busca</li>
                  <li>• Chat prioritário</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 space-y-3">
              <Button 
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 text-lg"
              >
                <Crown className="h-5 w-5 mr-2" />
                Assinar Premium - R$ 19,90/mês
              </Button>
              <Button 
                onClick={() => setShowPlanModal(false)}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800"
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
            className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
          >
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Pessoas Próximas</h3>
                <Button 
                  onClick={() => setShowPessoas(false)}
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-pink-100 text-sm mt-2">
                Descubra pessoas incríveis perto de você
              </p>
            </div>
            
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {pessoasProximas.map((pessoa) => (
                  <motion.div
                    key={pessoa.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                  >
                    <div className="relative mb-2">
                      <img 
                        src={pessoa.foto} 
                        alt={pessoa.nome}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      {pessoa.online && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                      {pessoa.superLike && (
                        <div className="absolute top-2 left-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="font-semibold text-gray-800">{pessoa.nome}</span>
                        {pessoa.verificado && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{pessoa.idade} anos</div>
                      <div className="text-xs text-gray-500">{pessoa.distancia}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
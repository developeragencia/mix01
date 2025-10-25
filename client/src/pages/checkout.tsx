import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock, Check, ArrowLeft, QrCode, Copy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeGenerator from "qrcode";

const plans = {
  BASICO: {
    name: "Plano Básico",
    price: 19.90,
    features: [
      "Likes ilimitados",
      "Ver quem curtiu você",
      "1 Super Like por dia",
      "Sem anúncios"
    ]
  },
  PREMIUM: {
    name: "Plano Premium",
    price: 29.90,
    features: [
      "Tudo do Básico",
      "5 Super Likes por dia",
      "Boost mensal",
      "Leitura de mensagens",
      "Prioridade na descoberta"
    ]
  },
  VIP: {
    name: "Plano VIP",
    price: 49.90,
    features: [
      "Tudo do Premium",
      "Super Likes ilimitados",
      "Boost semanal",
      "Modo invisível",
      "Suporte prioritário"
    ]
  }
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>("PREMIUM");
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pixCode, setPixCode] = useState<string>("");
  const [pixQrCode, setPixQrCode] = useState<string>("");
  const [pixExpires, setPixExpires] = useState<number>(15 * 60); // 15 minutos em segundos
  
  // Get plan from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planFromUrl = urlParams.get('plan');
    if (planFromUrl) {
      const planUpper = planFromUrl.toUpperCase();
      if (plans[planUpper as keyof typeof plans]) {
        setSelectedPlan(planUpper);
      }
    }
  }, []);

  // PIX timer countdown
  useEffect(() => {
    if (pixCode && pixExpires > 0) {
      const timer = setInterval(() => {
        setPixExpires(prev => {
          if (prev <= 0) {
            clearInterval(timer);
            setPixCode("");
            setPixQrCode("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [pixCode, pixExpires]);

  const generatePixCode = async () => {
    const plan = plans[selectedPlan as keyof typeof plans];
    const value = plan.price.toFixed(2).replace('.', '');
    
    // Simulated PIX code - In production, this would come from payment API
    const pixString = `00020126580014BR.GOV.BCB.PIX0136${generateRandomKey()}5204532653039865802BR5925MIX APP DIGITAL LTDA6009SAO PAULO62070503***6304${generateChecksum()}`;
    
    setPixCode(pixString);
    
    // Gera QR code real
    const qrCodeImage = await generateQRCodeSVG(pixString);
    setPixQrCode(qrCodeImage);
    setPixExpires(15 * 60); // Reset timer to 15 minutes
    
    toast({
      title: "PIX gerado com sucesso!",
      description: "Código PIX válido por 15 minutos",
      duration: 3000,
    });
  };

  const generateRandomKey = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateChecksum = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
  };

  const generateQRCodeSVG = async (text: string) => {
    try {
      // Gera QR code real usando a biblioteca qrcode
      const qrCodeDataUrl = await QRCodeGenerator.toDataURL(text, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Erro ao gerar QR code:', error);
      // Fallback para QR code simples em caso de erro
      return `data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <rect x="10" y="10" width="180" height="180" fill="black"/>
          <rect x="20" y="20" width="160" height="160" fill="white"/>
          <text x="100" y="100" text-anchor="middle" font-family="monospace" font-size="8" fill="black">QR CODE</text>
          <text x="100" y="120" text-anchor="middle" font-family="monospace" font-size="6" fill="black">PIX MIX</text>
        </svg>
      `)}`;
    }
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "Código copiado!",
      description: "Cole no seu app do banco para pagar",
      duration: 2000,
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const plan = plans[selectedPlan as keyof typeof plans];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/swipe-limit")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Plan Summary */}
        <Card className="mb-6 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">
              {plan.name}
            </CardTitle>
            <CardDescription className="text-center">
              <span className="text-3xl font-bold text-white">R$ {plan.price}</span>
              <span className="text-white/70">/mês</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center text-white/90">
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Payment Method Selection */}
        <Card className="mb-6 bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant={paymentMethod === "pix" ? "default" : "outline"}
              className={`w-full justify-start ${
                paymentMethod === "pix" 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-white/10 hover:bg-white/20 text-white border-white/30"
              }`}
              onClick={() => setPaymentMethod("pix")}
            >
              <QrCode className="w-4 h-4 mr-2" />
              PIX - Instantâneo
            </Button>
            
            <Button
              variant={paymentMethod === "credit_card" ? "default" : "outline"}
              className={`w-full justify-start ${
                paymentMethod === "credit_card" 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-white/10 hover:bg-white/20 text-white border-white/30"
              }`}
              onClick={() => setPaymentMethod("credit_card")}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Cartão de Crédito
            </Button>
          </CardContent>
        </Card>

        {/* PIX Payment */}
        {paymentMethod === "pix" && (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                Pagamento PIX
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!pixCode ? (
                <Button
                  onClick={generatePixCode}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Gerando..." : "Gerar Código PIX"}
                </Button>
              ) : (
                <div className="space-y-4">
                  {/* Timer */}
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-3">
                    <div className="flex items-center justify-center text-orange-300">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-mono text-lg">
                        Expira em: {formatTime(pixExpires)}
                      </span>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-lg inline-block">
                      <img src={pixQrCode} alt="QR Code PIX" className="w-48 h-48" />
                    </div>
                    <p className="text-white/70 text-sm mt-2">
                      Escaneie com seu app do banco
                    </p>
                  </div>

                  {/* PIX Code */}
                  <div className="space-y-2">
                    <p className="text-white/90 text-sm font-medium">
                      Ou copie o código PIX:
                    </p>
                    <div className="flex gap-2">
                      <Input
                        value={pixCode}
                        readOnly
                        className="bg-white/10 border-white/30 text-white text-xs font-mono"
                      />
                      <Button
                        onClick={copyPixCode}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Como pagar:</h4>
                    <ol className="text-white/80 text-sm space-y-1">
                      <li>1. Abra seu app do banco</li>
                      <li>2. Escolha a opção PIX</li>
                      <li>3. Escaneie o QR Code ou cole o código</li>
                      <li>4. Confirme o pagamento</li>
                    </ol>
                  </div>

                  <Button
                    onClick={() => setLocation("/payment-success")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Simular Pagamento Realizado
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Credit Card Payment (existing) */}
        {paymentMethod === "credit_card" && (
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Cartão de Crédito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70 text-center">
                Funcionalidade em desenvolvimento
              </p>
              <Button
                onClick={() => setLocation("/payment-success")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Simular Pagamento com Cartão
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
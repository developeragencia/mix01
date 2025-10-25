import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Check, Clock, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mixLogo from "@assets/Logo_MIX_horizontal_1750591494976.png";

interface PaymentProps {
  plan?: string;
  amount?: number;
}

export default function Payment() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<'pix' | 'card' | null>(null);
  const [pixCode, setPixCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [countdown, setCountdown] = useState(600); // 10 minutos

  // Simular dados do plano (em produção viriam da navegação)
  const planData = {
    name: "Mix Premium",
    price: 29.90,
    features: ["Likes ilimitados", "Ver quem curtiu você", "Boost mensal"]
  };

  // Gerar PIX Code e QR Code automático
  useEffect(() => {
    if (selectedPayment === 'pix') {
      generatePixPayment();
    }
  }, [selectedPayment]);

  // Countdown timer
  useEffect(() => {
    if (selectedPayment === 'pix' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedPayment, countdown]);

  const generatePixPayment = async () => {
    try {
      // Simular geração de PIX (em produção seria uma API real)
      const pixKey = "mix.dating@example.com"; // Chave teste
      const amount = planData.price;
      const merchantName = "MIX APP DIGITAL";
      const city = "SAO PAULO";
      const txId = `MIXAPP${Date.now()}`;
      
      // Gerar PIX Code simplificado (em produção usar biblioteca PIX adequada)
      const pixPayload = generatePixPayload(pixKey, amount, merchantName, city, txId);
      setPixCode(pixPayload);
      
      // Gerar QR Code usando API pública
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`;
      setQrCodeUrl(qrUrl);
      
      // Simular monitoramento de pagamento
      simulatePaymentMonitoring();
      
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o PIX. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const generatePixPayload = (pixKey: string, amount: number, merchantName: string, city: string, txId: string) => {
    // Formato PIX simplificado para teste
    return `00020126580014br.gov.bcb.pix0136${pixKey}52040000530398654${amount.toFixed(2)}5802BR5913${merchantName}6009${city}62070503${txId}6304`;
  };

  const simulatePaymentMonitoring = () => {
    // Simular aprovação do pagamento após 30 segundos
    setTimeout(() => {
      setPaymentStatus('processing');
      toast({
        title: "Pagamento detectado!",
        description: "Processando seu pagamento...",
      });
      
      setTimeout(() => {
        setPaymentStatus('success');
        toast({
          title: "Pagamento aprovado!",
          description: "Bem-vindo ao Mix Premium!",
        });
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          setLocation("/discover");
        }, 2000);
      }, 3000);
    }, 30000);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({
      title: "PIX copiado!",
      description: "Cole no seu app do banco para pagar",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">Pagamento Aprovado!</CardTitle>
            <CardDescription>Bem-vindo ao Mix Premium</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Agora você tem acesso a todas as funcionalidades premium do MIX!
            </p>
            <Button 
              onClick={() => setLocation("/discover")}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Começar a usar Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/seu-mix")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <img src={mixLogo} alt="MIX" className="h-8 w-auto" />
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Finalizar Pagamento</CardTitle>
            <CardDescription>
              {planData.name} - R$ {planData.price.toFixed(2)}/mês
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!selectedPayment && (
              <div className="space-y-3">
                <h3 className="font-semibold text-center">Escolha a forma de pagamento:</h3>
                
                <Button
                  variant="outline"
                  className="w-full h-16 flex items-center justify-center space-x-3"
                  onClick={() => setSelectedPayment('pix')}
                >
                  <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PIX</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">PIX</div>
                    <div className="text-sm text-gray-500">Pagamento instantâneo</div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full h-16 flex items-center justify-center space-x-3"
                  onClick={() => setSelectedPayment('card')}
                >
                  <CreditCard className="w-8 h-8 text-blue-500" />
                  <div className="text-left">
                    <div className="font-semibold">Cartão de Crédito</div>
                    <div className="text-sm text-gray-500">Em breve</div>
                  </div>
                </Button>
              </div>
            )}

            {selectedPayment === 'pix' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">
                      Expira em: {formatTime(countdown)}
                    </span>
                  </div>
                  
                  {qrCodeUrl && (
                    <div className="flex justify-center mb-4">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code PIX" 
                        className="border rounded-lg"
                      />
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mb-3">
                    Escaneie o QR Code ou copie o código PIX:
                  </p>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs font-mono break-all mb-2">
                      {pixCode}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyPixCode}
                      className="w-full"
                      disabled={copied}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar código PIX
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {paymentStatus === 'processing' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        <span className="text-sm text-blue-600">Processando pagamento...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPayment(null)}
                  className="w-full"
                >
                  Voltar
                </Button>
              </div>
            )}

            {selectedPayment === 'card' && (
              <div className="text-center space-y-4">
                <div className="p-8 bg-gray-50 rounded-lg">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-600">Em breve</h3>
                  <p className="text-sm text-gray-500">
                    Pagamento por cartão será disponibilizado em breve
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPayment(null)}
                  className="w-full"
                >
                  Voltar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
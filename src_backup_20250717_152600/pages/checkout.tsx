import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock, Check, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
    cpf: ""
  });

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        const response = await fetch("/api/subscriptions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1, // Demo user ID
            planType: selectedPlan,
            price: Math.round(plans[selectedPlan as keyof typeof plans].price * 100) // Convert to cents
          })
        });

        if (response.ok) {
          toast({
            title: "Pagamento aprovado!",
            description: `Bem-vindo ao ${plans[selectedPlan as keyof typeof plans].name}`,
          });
          setLocation("/discover");
        } else {
          throw new Error("Falha no pagamento");
        }
      } catch (error) {
        toast({
          title: "Erro no pagamento",
          description: "Tente novamente ou entre em contato com o suporte",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleaned;
    }
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/(\d{0,2})(\d{0,2})/);
    return match ? `${match[1]}${match[2] ? '/' + match[2] : ''}` : cleaned;
  };

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
    return match ? `${match[1]}${match[2] ? '.' + match[2] : ''}${match[3] ? '.' + match[3] : ''}${match[4] ? '-' + match[4] : ''}` : cleaned;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/plans")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-white text-xl font-bold">Checkout</h1>
          <div className="w-10" />
        </div>

        {/* Plan Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Selecione seu plano</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(plans).map(([key, plan]) => (
                <div
                  key={key}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === key
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPlan(key)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                      <p className="text-sm text-gray-600">
                        R$ {plan.price.toFixed(2).replace('.', ',')} /mês
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === key ? "border-pink-500 bg-pink-500" : "border-gray-300"
                    }`}>
                      {selectedPlan === key && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Método de pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentMethod === "credit_card"
                    ? "border-pink-500 bg-pink-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMethod("credit_card")}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-800">Cartão de Crédito</span>
                </div>
              </div>

              {paymentMethod === "credit_card" && (
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do cartão
                    </label>
                    <Input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardData.number}
                      onChange={(e) => setCardData({...cardData, number: formatCardNumber(e.target.value)})}
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Validade
                      </label>
                      <Input
                        type="text"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({...cardData, expiry: formatExpiry(e.target.value)})}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <Input
                        type="text"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                        maxLength={3}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome no cartão
                    </label>
                    <Input
                      type="text"
                      placeholder="João Silva"
                      value={cardData.name}
                      onChange={(e) => setCardData({...cardData, name: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <Input
                      type="text"
                      placeholder="000.000.000-00"
                      value={cardData.cpf}
                      onChange={(e) => setCardData({...cardData, cpf: formatCPF(e.target.value)})}
                      maxLength={14}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {plans[selectedPlan as keyof typeof plans].name}
                </span>
                <span className="font-semibold">
                  R$ {plans[selectedPlan as keyof typeof plans].price.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Período</span>
                <span>Mensal</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>R$ {plans[selectedPlan as keyof typeof plans].price.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processando...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Finalizar pagamento</span>
            </div>
          )}
        </Button>

        {/* Security Info */}
        <div className="mt-4 text-center">
          <p className="text-white/80 text-sm">
            <Lock className="w-4 h-4 inline mr-1" />
            Pagamento 100% seguro e criptografado
          </p>
        </div>
      </div>
    </div>
  );
}
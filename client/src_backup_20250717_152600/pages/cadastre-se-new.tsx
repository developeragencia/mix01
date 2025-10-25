import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
// import logoMix from "@assets/Logo_MIX_horizontal_1751283015324.png";

export default function CadastreSeNew() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName.trim().length > 0;
      case 2:
        return formData.lastName.trim().length > 0;
      case 3:
        return formData.email.trim().length > 0 && formData.email.includes('@');
      case 4:
        return formData.password.length >= 6;
      case 5:
        return formData.confirmPassword === formData.password;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps && isStepValid()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        setLocation('/login');
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao criar conta");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Como você gostaria de ser chamado?</h2>
              <p className="text-gray-600 text-base">Vamos começar com seu primeiro nome</p>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Digite seu primeiro nome"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="h-16 text-xl border-2 border-gray-300 focus:border-pink-500 rounded-2xl px-6 text-center font-medium"
                required
                autoFocus
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Passo 1 de 6</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Oi, {formData.firstName}! 👋</h2>
              <p className="text-gray-600 text-base">Agora me conta seu sobrenome</p>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Digite seu sobrenome"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="h-16 text-xl border-2 border-gray-300 focus:border-pink-500 rounded-2xl px-6 text-center font-medium"
                required
                autoFocus
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Passo 2 de 6</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Qual é o seu email?</h2>
              <p className="text-gray-600 text-base">Usaremos para verificar sua conta e manter contato</p>
            </div>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="h-16 text-xl border-2 border-gray-300 focus:border-pink-500 rounded-2xl px-6 text-center font-medium"
                required
                autoFocus
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Passo 3 de 6</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Crie uma senha forte 🔒</h2>
              <p className="text-gray-600 text-base">Pelo menos 6 caracteres para manter sua conta segura</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="h-16 text-xl border-2 border-gray-300 focus:border-pink-500 rounded-2xl px-6 text-center font-medium"
                required
                minLength={6}
                autoFocus
              />
              {formData.password && formData.password.length < 6 && (
                <p className="text-red-500 text-sm text-center">A senha deve ter pelo menos 6 caracteres</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Passo 4 de 6</p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Confirme sua senha ✅</h2>
              <p className="text-gray-600 text-base">Digite sua senha novamente para confirmar</p>
            </div>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="h-16 text-xl border-2 border-gray-300 focus:border-pink-500 rounded-2xl px-6 text-center font-medium"
                required
                minLength={6}
                autoFocus
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-sm text-center">As senhas não coincidem</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Passo 5 de 6</p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Tudo pronto! 🎉</h2>
              <p className="text-gray-600 text-base">Revise suas informações e confirme o cadastro</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">{formData.firstName} {formData.lastName}</p>
                <p className="text-gray-600">{formData.email}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                Ao criar uma conta, você concorda com nossos{" "}
                <button 
                  type="button"
                  onClick={() => setLocation("/terms")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Termos de Uso
                </button>{" "}
                e{" "}
                <button 
                  type="button"
                  onClick={() => setLocation("/privacy")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Política de Privacidade
                </button>
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Passo 6 de 6</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] flex flex-col items-center justify-center p-6">
      {/* Logo MIX */}
      <div className="mb-8 text-center">
        <img 
          src="/mix-logo-horizontal.png" 
          alt="MIX" 
          className="h-16 mx-auto"
        />
      </div>

      {/* Card branco de cadastro */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-100 border-red-300 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={step === 6 ? handleSignup : (e) => { e.preventDefault(); handleNext(); }}>
          {renderStep()}

          {/* Botões de navegação */}
          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <Button
                type="button"
                onClick={handlePrevious}
                className="flex-1 h-14 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl text-lg"
              >
                Voltar
              </Button>
            )}
            
            <Button 
              type="submit"
              className={`${step === 1 ? 'w-full' : 'flex-1'} h-14 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-2xl text-lg shadow-lg`}
              disabled={isLoading || !isStepValid()}
            >
              {step === 6 ? (isLoading ? "Criando conta..." : "CRIAR CONTA") : "Continuar"}
            </Button>
          </div>
        </form>

        {/* Link para login */}
        {step === 1 && (
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Já tem uma conta? 
              <button 
                onClick={() => setLocation("/login")}
                className="text-blue-600 hover:underline ml-1 font-medium"
              >
                Entre aqui
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
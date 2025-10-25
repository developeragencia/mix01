import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";
import { Label } from "@/components/ui/label";

export default function PhoneAuth() {
  const [, setLocation] = useLocation();
  // ✅ Detectar modo pela URL - se veio de /login, inicia em modo login
  const urlParams = new URLSearchParams(window.location.search);
  const initialMode = urlParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validação de telefone
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setError("Digite um telefone válido: (11) 99999-9999");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const cleanPhone = phone.replace(/\D/g, '');

      if (mode === "register") {
        // CADASTRO
        if (!email.trim()) {
          setError("Email é obrigatório");
          setIsLoading(false);
          return;
        }

        if (!email.includes('@')) {
          setError("Digite um email válido");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError("As senhas não coincidem");
          setIsLoading(false);
          return;
        }

        const username = email.split('@')[0].toLowerCase() + Math.random().toString(36).substring(2, 5);

        console.log("🔵 Iniciando cadastro:", { email, phone: cleanPhone });
        
        const response = await fetch('/api/auth/phone/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email: email.trim().toLowerCase(),
            phone: cleanPhone,
            password
          }),
          credentials: 'include'
        });

        console.log("🔵 Response status:", response.status, response.ok);
        
        const data = await response.json();
        console.log("🔵 Response data:", data);

        if (!response.ok) {
          console.error("❌ Erro no cadastro:", data.message);
          setError(data.message || 'Erro ao criar conta');
          setIsLoading(false);
          return;
        }

        console.log("✅ Cadastro realizado com sucesso!");
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para completar seu perfil...",
        });

        setTimeout(() => {
          console.log("🔵 Redirecionando para /onboarding-flow");
          window.location.href = "/onboarding-flow";
        }, 500);

      } else {
        // LOGIN
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: cleanPhone,
            password
          }),
          credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Telefone ou senha incorretos');
          setIsLoading(false);
          return;
        }

        toast({
          title: "Login realizado!",
          description: "Bem-vindo de volta!",
        });

        // Buscar dados do usuário para verificar se perfil está completo
        const userResponse = await fetch('/api/auth/user', {
          credentials: 'include'
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          
          setTimeout(() => {
            if (userData.isProfileComplete) {
              window.location.href = "/discover";
            } else {
              window.location.href = "/onboarding-flow";
            }
          }, 500);
        } else {
          // Fallback: redirecionar para discover
          setTimeout(() => {
            window.location.href = "/discover";
          }, 500);
        }
      }

    } catch (err) {
      setError("Erro ao conectar com o servidor. Verifique sua conexão.");
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => setLocation(mode === "register" ? '/register' : '/login')}
          className="text-white/90 hover:text-white flex items-center gap-2 mb-6 sm:mb-8 transition-colors touch-manipulation"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        <div className="flex justify-center mb-6 sm:mb-8">
          <img src={mixLogo} alt="MIX" className="h-12 w-auto sm:h-16" data-testid="img-logo" />
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2" data-testid="text-title">
            {mode === "register" ? "Cadastre-se com Celular" : "Entrar com Celular"}
          </h1>
          <p className="text-white/70 text-sm" data-testid="text-subtitle">
            {mode === "register" 
              ? "Preencha seus dados para criar sua conta" 
              : "Digite seu telefone e senha para entrar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="bg-red-500/20 border-red-500/50">
              <AlertCircle className="h-4 w-4 text-white" />
              <AlertDescription className="text-white">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <Label htmlFor="email" className="text-white/90 text-sm font-medium mb-2 block">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 sm:h-14 text-sm sm:text-base bg-white/10 border-2 border-white/20 focus:border-pink-500/50 rounded-full text-white placeholder:text-white/50 px-4 sm:px-6 touch-manipulation"
                  disabled={isLoading}
                  data-testid="input-email"
                />
              </div>
            )}

            <div>
              <Label htmlFor="phone" className="text-white/90 text-sm font-medium mb-2 block">
                Número de Celular
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={15}
                className="h-12 sm:h-14 text-sm sm:text-base bg-white/10 border-2 border-white/20 focus:border-pink-500/50 rounded-full text-white placeholder:text-white/50 px-4 sm:px-6 touch-manipulation"
                disabled={isLoading}
                data-testid="input-phone"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-white/90 text-sm font-medium mb-2 block">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 sm:h-14 text-sm sm:text-base bg-white/10 border-2 border-white/20 focus:border-pink-500/50 rounded-full text-white placeholder:text-white/50 px-4 sm:px-6 pr-12 sm:pr-14 touch-manipulation"
                  disabled={isLoading}
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white touch-manipulation"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            {mode === "register" && (
              <div>
                <Label htmlFor="confirm-password" className="text-white/90 text-sm font-medium mb-2 block">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 sm:h-14 text-sm sm:text-base bg-white/10 border-2 border-white/20 focus:border-pink-500/50 rounded-full text-white placeholder:text-white/50 px-4 sm:px-6 pr-12 sm:pr-14 touch-manipulation"
                    disabled={isLoading}
                    data-testid="input-confirm-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white touch-manipulation"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button 
            type="submit"
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-full shadow-lg text-sm sm:text-base mt-4 sm:mt-6 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            disabled={isLoading}
            data-testid="button-submit"
          >
            {isLoading 
              ? (mode === "register" ? "Criando conta..." : "Entrando...") 
              : (mode === "register" ? "Criar Conta" : "Entrar")}
          </Button>
        </form>

        <div className="mt-6 sm:mt-8 text-center space-y-3 sm:space-y-4">
          {mode === "register" && (
            <p className="text-white/50 text-sm">
              Ao continuar, você concorda com nossos{" "}
              <button 
                onClick={() => setLocation('/terms')}
                className="text-white/70 underline hover:text-white touch-manipulation"
                data-testid="link-terms"
              >
                Termos de Uso
              </button>
            </p>
          )}

          <p className="text-white/70 text-sm">
            {mode === "register" ? "Já tem uma conta?" : "Não tem uma conta?"}{" "}
            <button
              onClick={toggleMode}
              className="text-pink-400 font-semibold hover:text-pink-300 touch-manipulation"
              data-testid="link-toggle-mode"
            >
              {mode === "register" ? "Entrar" : "Cadastre-se"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

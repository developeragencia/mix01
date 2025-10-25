import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import mixLogo from "@assets/Logo_MIX_horizontal_1750591494976.png";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import { GOOGLE_CLIENT_ID, FACEBOOK_APP_ID } from '@/config/oauth';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RegisterContent() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerMethod, setRegisterMethod] = useState<'google' | 'phone' | 'facebook'>('google');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({ 
          title: "Conta criada!", 
          description: "Bem-vindo ao MIX!" 
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        window.location.href = '/onboarding-flow';
      } else {
        setError(data.message || "Erro ao criar conta. Tente novamente.");
      }
    } catch (err: any) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Erro ao autenticar com Google. Tente novamente.");
  };

  const handleGoogleButtonClick = () => {
    const googleButton = googleButtonRef.current?.querySelector('div[role="button"]') as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

  const handleFacebookSuccess = async (response: any) => {
    try {
      setIsLoading(true);
      setError("");

      const res = await fetch("/api/auth/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ 
          accessToken: response.accessToken,
          userID: response.userID
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({ 
          title: "Conta criada!", 
          description: "Bem-vindo ao MIX!" 
        });
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        window.location.href = '/onboarding-flow';
      } else {
        setError(data.message || "Erro ao criar conta. Tente novamente.");
      }
    } catch (err: any) {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookError = (error: any) => {
    console.error('Facebook registration error:', error);
    setError("Erro ao autenticar com Facebook. Tente novamente.");
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setError("Digite um telefone válido: (11) 99999-9999");
      setIsLoading(false);
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
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

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const username = email.split('@')[0].toLowerCase() + Math.random().toString(36).substring(2, 5);

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

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erro ao criar conta');
        setIsLoading(false);
        return;
      }

      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para completar seu perfil...",
      });

      setTimeout(() => {
        window.location.href = "/onboarding-flow";
      }, 500);
    } catch (err) {
      setError("Erro ao conectar com o servidor. Verifique sua conexão.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="text-center space-y-3 sm:space-y-4">
            <img 
              src={mixLogo} 
              alt="MIX" 
              className="h-12 w-auto mx-auto drop-shadow-2xl sm:h-16"
              data-testid="img-logo"
            />
            <h2 className="text-white text-xl sm:text-2xl font-semibold">
              Crie sua conta
            </h2>
            <p className="text-white/70 text-sm sm:text-base">
              Comece sua jornada no MIX
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-xl border border-white/10">
            <div className="flex gap-1 sm:gap-1.5">
              <button
                onClick={() => setRegisterMethod('google')}
                className={`flex-1 py-2.5 px-2 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  registerMethod === 'google' 
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                data-testid="tab-google"
              >
                Google
              </button>
              <button
                onClick={() => setRegisterMethod('facebook')}
                className={`flex-1 py-2.5 px-2 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  registerMethod === 'facebook' 
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                data-testid="tab-facebook"
              >
                Facebook
              </button>
              <button
                onClick={() => setRegisterMethod('phone')}
                className={`flex-1 py-2.5 px-2 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  registerMethod === 'phone' 
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                data-testid="tab-phone"
              >
                Celular
              </button>
            </div>
          </div>

          {registerMethod === 'google' && (
            <div className="space-y-4">
              <Button
                onClick={handleGoogleButtonClick}
                disabled={isLoading}
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-full shadow-xl text-sm sm:text-base transition-all hover:scale-105 touch-manipulation"
                data-testid="button-google-register"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Cadastre-se com Google
              </Button>

              <div ref={googleButtonRef} className="hidden">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                />
              </div>
            </div>
          )}

          {registerMethod === 'facebook' && (
            <div className="space-y-4">
              {FACEBOOK_APP_ID ? (
                <FacebookLogin
                  appId={FACEBOOK_APP_ID}
                  onSuccess={handleFacebookSuccess}
                  onFail={handleFacebookError}
                  onProfileSuccess={(response: any) => {
                    console.log('Facebook profile:', response);
                  }}
                  render={({ onClick }) => (
                    <Button
                      onClick={onClick}
                      disabled={isLoading}
                      className="w-full h-12 sm:h-14 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-semibold rounded-full shadow-xl text-sm sm:text-base transition-all hover:scale-105 touch-manipulation"
                      data-testid="button-facebook-register"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Cadastre-se com Facebook
                    </Button>
                  )}
                />
              ) : (
                <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Facebook App ID não configurado. Entre em contato com o suporte.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {registerMethod === 'phone' && (
            <form onSubmit={handlePhoneRegister} className="space-y-4 sm:space-y-5">
              <div>
                <Label htmlFor="phone-email" className="text-white/90 text-sm font-medium mb-2 block">
                  Email
                </Label>
                <Input
                  id="phone-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 sm:h-14 text-sm sm:text-base bg-white/10 border-2 border-white/20 focus:border-pink-500/50 rounded-xl sm:rounded-2xl text-white placeholder:text-white/50 px-4 sm:px-5 backdrop-blur-sm touch-manipulation"
                  disabled={isLoading}
                  required
                  data-testid="input-phone-email"
                />
              </div>

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
                  className="h-12 sm:h-14 text-sm sm:text-base bg-white/10 border-2 border-white/20 focus:border-pink-500/50 rounded-xl sm:rounded-2xl text-white placeholder:text-white/50 px-4 sm:px-5 backdrop-blur-sm touch-manipulation"
                  disabled={isLoading}
                  required
                  data-testid="input-phone"
                />
              </div>

              <div>
                <Label htmlFor="phone-password" className="text-white/90 text-sm font-medium mb-2 block">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="phone-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 sm:h-14 text-sm sm:text-base bg-white/10 border-2 border-white/20 focus:border-pink-500/50 rounded-xl sm:rounded-2xl text-white placeholder:text-white/50 px-4 sm:px-5 pr-12 sm:pr-14 backdrop-blur-sm touch-manipulation"
                    disabled={isLoading}
                    required
                    data-testid="input-phone-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors touch-manipulation"
                    data-testid="button-toggle-phone-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="phone-confirm-password" className="text-white/90 text-sm font-medium mb-2 block">
                  Confirmar Senha
                </Label>
                <div className="relative">
                  <Input
                    id="phone-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 sm:h-14 text-sm sm:text-base bg-white/10 border-2 border-white/20 focus:border-pink-500/50 rounded-xl sm:rounded-2xl text-white placeholder:text-white/50 px-4 sm:px-5 pr-12 sm:pr-14 backdrop-blur-sm touch-manipulation"
                    disabled={isLoading}
                    required
                    data-testid="input-phone-confirm-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors touch-manipulation"
                    data-testid="button-toggle-phone-confirm-password"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 sm:h-14 bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold rounded-full shadow-xl text-sm sm:text-base disabled:opacity-50 transition-all hover:scale-105 touch-manipulation"
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>
          )}

          <div className="text-center space-y-3 sm:space-y-4 pt-3 sm:pt-4">
            <p className="text-white/70 text-sm">
              Já tem uma conta?{' '}
              <button
                onClick={() => setLocation('/login')}
                className="text-pink-400 font-semibold hover:text-pink-300 transition-colors touch-manipulation"
                data-testid="link-login"
              >
                Entrar
              </button>
            </p>

            <p className="text-white/50 text-xs">
              Ao continuar, você concorda com nossos{' '}
              <a href="/terms" className="underline hover:text-white/70 touch-manipulation">Termos de Uso</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-8">
        <Alert variant="destructive" className="bg-red-500/20 border-red-500/30 text-white">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Configuração do Google OAuth não encontrada. Entre em contato com o suporte.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <RegisterContent />
    </GoogleOAuthProvider>
  );
}

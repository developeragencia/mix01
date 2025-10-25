import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { FaGoogle, FaFacebook, FaPhone } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (response.ok) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao MIX",
        });
        setLocation("/discover");
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao fazer login");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google";
  };

  const handleFacebookAuth = () => {
    window.location.href = "/api/auth/facebook";
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] flex flex-col items-center justify-center p-6">
      {/* Logo MIX original */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4">
          <img src="/mix-logo.png" alt="MIX" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-white text-lg font-medium">Mais conexões em sua vida</h1>
      </div>

      {/* Card branco de login */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6">
        {/* Título */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Entrar</h2>
          <p className="text-gray-600 text-sm">Acesse sua conta</p>
        </div>

        {/* Botões de login social */}
        <div className="space-y-3 mb-6">
          {/* Google */}
          <Button 
            type="button"
            onClick={handleGoogleAuth}
            variant="outline"
            className="w-full h-13 border-2 border-gray-200 hover:bg-red-50 hover:border-red-300 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group"
          >
            <FaGoogle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium group-hover:text-red-600">Continuar com Google</span>
          </Button>

          {/* Facebook */}
          <Button 
            type="button"
            onClick={handleFacebookAuth}
            variant="outline"
            className="w-full h-13 border-2 border-gray-200 hover:bg-blue-50 hover:border-blue-300 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group"
          >
            <FaFacebook className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium group-hover:text-blue-600">Continuar com Facebook</span>
          </Button>

          {/* Telefone */}
          <Button 
            type="button"
            variant="outline"
            className="w-full h-13 border-2 border-gray-200 hover:bg-green-50 hover:border-green-300 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group"
          >
            <FaPhone className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 font-medium group-hover:text-green-600">Continuar com Telefone</span>
          </Button>
        </div>

        {/* Separador */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">ou</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Campos de login tradicional */}
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-100 border-red-300 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Email ou telefone"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-base border border-gray-300 focus:border-blue-500 rounded-lg px-4"
              required
            />

            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base border border-gray-300 focus:border-blue-500 rounded-lg px-4"
              required
            />
          </div>

          {/* Botão entrar */}
          <Button 
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "ENTRAR"}
          </Button>

          {/* Link esqueci senha */}
          <div className="text-center">
            <button 
              type="button" 
              onClick={() => setLocation("/forgot-password")}
              className="text-blue-600 text-sm hover:underline"
            >
              Esqueci minha senha
            </button>
          </div>
        </form>

        {/* Botão Pular */}
        <div className="text-center mt-4">
          <Button
            type="button"
            onClick={() => setLocation("/discover")}
            variant="ghost"
            className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            Pular por enquanto
          </Button>
        </div>

        {/* Link para criar conta */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Não tem uma conta? 
            <button 
              onClick={() => setLocation("/register")}
              className="text-blue-600 hover:underline ml-1 font-medium"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // ✅ Autenticação real via backend
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token || email);
        setLocation("/admin/dashboard");
      } else {
        const error = await response.json();
        alert(error.message || "Credenciais inválidas");
      }
    } catch (error) {
      console.error('Erro no login admin:', error);
      alert("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-blue-800/90 backdrop-blur-sm shadow-2xl border-0">
        <div className="text-center mb-8">
          <img src={mixLogoHorizontal} alt="Mix Logo" className="h-16 mx-auto mb-6" />
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-blue-200 mr-2" />
            <h1 className="text-2xl font-bold text-white">Painel Admin</h1>
          </div>
          <p className="text-blue-100">Acesso restrito para administradores</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Email do Administrador
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mixapp.digital"
              className="w-full bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Senha
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full pr-10 bg-blue-700/50 border-blue-600/50 text-white placeholder:text-blue-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar no Painel"
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-700/50 rounded-lg border border-blue-400/30">
          <p className="text-sm text-blue-100 font-medium">Credenciais de Acesso:</p>
          <p className="text-sm text-blue-200">Email: admin@mixapp.com</p>
          <p className="text-sm text-blue-200">Senha: admin123</p>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-blue-200 hover:text-white hover:bg-blue-700/30"
          >
            Voltar ao App
          </Button>
        </div>
      </Card>
    </div>
  );
}
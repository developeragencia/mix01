import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Eye, EyeOff } from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1752607947932.png";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate admin authentication
    setTimeout(() => {
      if (email === "admin@mix.com" && password === "admin123") {
        localStorage.setItem("adminToken", "admin-authenticated");
        setLocation("/admin/dashboard");
      } else {
        alert("Credenciais inválidas. Use admin@mix.com / admin123");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl">
        <div className="text-center mb-8">
          <img src={mixLogoHorizontal} alt="Mix Logo" className="h-12 mx-auto mb-4" />
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-purple-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Painel Admin</h1>
          </div>
          <p className="text-gray-600">Acesso restrito para administradores</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email do Administrador
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mix.com"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
          >
            {isLoading ? "Entrando..." : "Entrar no Painel"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">Credenciais de Teste:</p>
          <p className="text-sm text-blue-600">Email: admin@mix.com</p>
          <p className="text-sm text-blue-600">Senha: admin123</p>
        </div>

        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="text-gray-600 hover:text-gray-800"
          >
            Voltar ao App
          </Button>
        </div>
      </Card>
    </div>
  );
}
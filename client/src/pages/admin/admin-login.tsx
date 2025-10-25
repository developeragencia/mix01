import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, CheckCircle2, Sparkles, KeyRound, UserCheck } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("adminToken", data.token || email);
        
        setTimeout(() => {
          setLocation("/admin/dashboard");
        }, 300);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Credenciais inválidas. Verifique seu email e senha.");
      }
    } catch (error) {
      console.error('Erro no login admin:', error);
      setError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Efeitos de fundo animados - partículas flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Estrelas decorativas */}
        {[...Array(30)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/10 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 16 + 8}px`,
              height: `${Math.random() * 16 + 8}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Container principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className={`w-full max-w-lg bg-white/98 backdrop-blur-2xl shadow-2xl border-0 rounded-3xl overflow-hidden transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}>
          
          {/* Header com Logo - Fundo da mesma cor */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-10">
            {/* Efeito de brilho no header */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent"></div>
            
            {/* Efeito geométrico de fundo */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500 to-transparent rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col items-center justify-center space-y-6">
              {/* Logo com fundo transparente */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-transparent rounded-2xl p-5 transform hover:scale-105 transition-all duration-300 group">
                  <img 
                    src="/mix-logo-horizontal.png" 
                    alt="Mix Logo" 
                    className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-2xl"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<span class="text-2xl font-bold text-white">MIX</span>';
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Ícone Shield com efeitos */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-300">
                  <Shield className="w-10 h-10 text-white animate-pulse" strokeWidth={2.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-xl">
                  <KeyRound className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              
              {/* Título */}
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg">Painel Admin</h1>
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <Lock className="w-4 h-4" />
                  <p className="text-sm font-medium">Acesso restrito para administradores</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Mensagem de erro */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-4 flex items-start space-x-3 animate-shake shadow-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0 animate-bounce" />
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              )}
              
              <style>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                  20%, 40%, 60%, 80% { transform: translateX(8px); }
                }
                .animate-shake {
                  animation: shake 0.5s ease-in-out;
                }
              `}</style>

              {/* Campo de email */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white" />
                  Email do Administrador
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mixapp.com"
                    className="w-full pl-12 pr-4 h-14 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 hover:border-gray-300 font-medium text-base"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Campo de senha */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-white" />
                  Senha
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full pl-12 pr-14 h-14 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 hover:border-gray-300 font-medium text-base"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Botão de login */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group text-base"
              >
                {/* Efeito de brilho ao passar o mouse */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {isLoading ? (
                  <span className="flex items-center justify-center relative z-10 gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Autenticando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center relative z-10 gap-2">
                    <Shield className="w-5 h-5" />
                    Entrar no Painel Admin
                  </span>
                )}
              </Button>
            </form>

            {/* Informações de desenvolvimento */}
            <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-2 border-blue-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-bold text-blue-900">🔐 Credenciais de Acesso</p>
              </div>
              <div className="space-y-2 pl-12">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Email:</span> admin@mixapp.com
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Senha:</span> admin123
                  </p>
                </div>
              </div>
            </div>

            {/* Botão de voltar */}
            <div className="mt-8 text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 hover:scale-105 rounded-xl font-medium"
              >
                <span className="flex items-center gap-2">
                  ← Voltar ao App
                </span>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-10 py-5 border-t-2 border-gray-200">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-center text-gray-500 font-semibold">
                  Sistema protegido por autenticação avançada
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <UserCheck className="w-3 h-3" />
                <p>
                  Mix Admin © {new Date().getFullYear()} • Todos os direitos reservados
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animação de entrada
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
        
        // Pequeno delay para melhor UX
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
      {/* Efeitos de fundo animados */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Estrelas decorativas */}
        {[...Array(20)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-white/20 animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Container principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className={`w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-0 rounded-2xl overflow-hidden transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          {/* Header com logo */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center relative overflow-hidden">
            {/* Efeito de brilho no header */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent"></div>
            
            <div className="relative flex flex-col items-center justify-center space-y-4">
              {/* Logo */}
              <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <img 
                  src="/mix-logo-horizontal.png" 
                  alt="Mix Logo" 
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback se a logo não carregar - mostra texto
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text">MIX</span>';
                    }
                  }}
                />
              </div>
              
              {/* Título */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Shield className="w-8 h-8 text-white animate-pulse" strokeWidth={2} />
                  <div className="absolute inset-0 w-8 h-8 text-white/30 blur-sm animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">Painel Admin</h1>
              </div>
              <p className="text-blue-100 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Acesso restrito para administradores
              </p>
          </div>
        </div>

          {/* Formulário */}
          <div className="p-8">
        <form onSubmit={handleLogin} className="space-y-6">
              {/* Mensagem de erro */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-shake">
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
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email do Administrador
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mixapp.com"
                    className="w-full pl-11 h-12 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 hover:border-gray-300"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Campo de senha */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  Senha
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full pl-11 pr-11 h-12 bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 hover:border-gray-300"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200 hover:scale-110"
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
                className="w-full h-12 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
          >
                {/* Efeito de brilho ao passar o mouse */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
            {isLoading ? (
                  <span className="flex items-center justify-center relative z-10">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Entrando...
                  </span>
            ) : (
                  <span className="flex items-center justify-center relative z-10">
                    <Shield className="w-5 h-5 mr-2" />
                    Entrar no Painel
                  </span>
            )}
          </Button>
        </form>

            {/* Informações de desenvolvimento (remover em produção) */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-500 rounded-full p-1">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs font-bold text-blue-900">🔐 Credenciais de Acesso</p>
              </div>
              <div className="space-y-2 pl-7">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">Email:</span> admin@mixapp.com
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">Senha:</span> admin123
                  </p>
                </div>
              </div>
            </div>

            {/* Botão de voltar */}
            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLocation("/")}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  ← Voltar ao App
                </span>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-4 border-t border-gray-200">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-center text-gray-500 font-medium">
                  Sistema protegido por autenticação
                </p>
              </div>
              <p className="text-xs text-center text-gray-400">
                Mix Admin © {new Date().getFullYear()} • Todos os direitos reservados
              </p>
            </div>
          </div>
      </Card>
      </div>
    </div>
  );
}


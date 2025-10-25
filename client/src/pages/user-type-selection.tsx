import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, ArrowRight } from "lucide-react";

export default function UserTypeSelection() {
  const [, setLocation] = useLocation();

  const handleExistingUser = () => {
    setLocation("/login");
  };

  const handleNewUser = () => {
    setLocation("/register");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: "url(/couple-background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-pink-900/70"></div>
      
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/mix-logo-horizontal.png" 
              alt="MIX" 
              className="h-20 mx-auto object-contain drop-shadow-2xl"
            />
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === 5
                    ? "w-12 bg-white shadow-lg shadow-white/50"
                    : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Bem-vindo ao MIX
          </h1>
          <p className="text-xl text-white/90 font-light">
            Escolha como deseja continuar
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Existing User Card */}
          <div
            onClick={handleExistingUser}
            className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 cursor-pointer transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30"
            data-testid="card-login"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              {/* Icon Circle */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                <LogIn className="w-12 h-12 text-white" strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-white">
                  Já sou cliente
                </h3>
                <p className="text-lg text-white/80 leading-relaxed">
                  Acesse sua conta e continue conectando
                </p>
              </div>

              {/* Button */}
              <Button
                onClick={handleExistingUser}
                className="w-full mt-4 h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                data-testid="button-login"
              >
                Entrar agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* New User Card */}
          <div
            onClick={handleNewUser}
            className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 cursor-pointer transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/30"
            data-testid="card-register"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              {/* Icon Circle */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                <UserPlus className="w-12 h-12 text-white" strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-white">
                  Novo por aqui
                </h3>
                <p className="text-lg text-white/80 leading-relaxed">
                  Cadastre-se grátis e comece agora
                </p>
              </div>

              {/* Button */}
              <Button
                onClick={handleNewUser}
                className="w-full mt-4 h-14 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105"
                data-testid="button-register"
              >
                Cadastrar grátis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-white/60 text-sm">
            Ao continuar, você concorda com nossos{" "}
            <button className="text-white/90 underline hover:text-white transition-colors">
              Termos de Uso
            </button>
            {" "}e{" "}
            <button className="text-white/90 underline hover:text-white transition-colors">
              Política de Privacidade
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, UserPlus } from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";
import backgroundImage from "@assets/be2-1_1750622861133.jpg";

export default function UserChoice() {
  const [, setLocation] = useLocation();

  const handleExistingUser = () => {
    setLocation("/login");
  };

  const handleNewUser = () => {
    setLocation("/register");
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative p-6"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Gradient overlay with logo colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-800/60 to-pink-600/50"></div>
      {/* Additional transparent shadow */}
      <div className="absolute inset-0 bg-black/30"></div>
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex items-center justify-center mb-12">
          <img 
            src={mixLogoHorizontal} 
            alt="MIX Logo" 
            className="h-16 object-contain"
          />
        </div>

        {/* Progress indicators */}
        <div className="flex space-x-3 justify-center mb-8">
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
          <div className="w-3 h-3 bg-white bg-opacity-40 rounded-full"></div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Quase lá!
          </h1>
          <p className="text-white/80">
            Você já tem uma conta ou é novo por aqui?
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {/* Existing User Card */}
          <Card 
            className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
            onClick={handleExistingUser}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-pink-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Já tenho conta</h3>
                  <p className="text-white/70 text-sm">Entrar com minha conta existente</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New User Card */}
          <Card 
            className="bg-white/10 backdrop-blur-sm border-white/20 cursor-pointer hover:bg-white/20 transition-all duration-300"
            onClick={handleNewUser}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-pink-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">Sou novo aqui</h3>
                  <p className="text-white/70 text-sm">Criar uma nova conta</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/location")}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
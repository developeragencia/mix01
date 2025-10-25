import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, UserPlus } from "lucide-react";

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
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url(/couple-background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay azul transparente */}
      <div className="absolute inset-0 bg-blue-900/60"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-12">
          <div 
            className="flex items-center justify-center mb-6"
            style={{
              transform: "scale(1.2)",
              opacity: 1
            }}
          >
            <img 
              src="/mix-logo.png" 
              alt="MIX Logo" 
              className="animate-pulse w-32 h-32 object-contain"
            />
          </div>
        </div>

        {/* Progress indicators - 6th slide */}
        <div className="flex space-x-3 mb-8 justify-center">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === 5
                  ? "w-8 bg-white"
                  : "w-2 bg-white bg-opacity-40"
              }`}
            />
          ))}
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo ao MIX</h2>
          <p className="text-white/80 text-lg">Escolha como deseja continuar</p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto px-4">
          {/* Login Card */}
          <Card 
            className="bg-white/15 border-white/30 backdrop-blur-md hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group transform hover:scale-105 shadow-xl h-56 w-full"
            onClick={handleExistingUser}
          >
            <CardContent className="p-6 text-center h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/30 rounded-full mb-3 group-hover:bg-blue-500/40 transition-all duration-300 group-hover:scale-110">
                  <UserCheck className="h-6 w-6 text-blue-300" />
                </div>
                <h2 className="text-sm font-bold text-white mb-2">Entrar</h2>
                <p className="text-white/70 text-xs mb-3">
                  Entre na sua conta
                </p>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 text-xs rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleExistingUser}
              >
                Login
              </Button>
            </CardContent>
          </Card>

          {/* Register Card */}
          <Card 
            className="bg-white/15 border-white/30 backdrop-blur-md hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer group transform hover:scale-105 shadow-xl h-56 w-full"
            onClick={handleNewUser}
          >
            <CardContent className="p-6 text-center h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-400/30 rounded-full mb-3 group-hover:bg-pink-400/40 transition-all duration-300 group-hover:scale-110">
                  <UserPlus className="h-6 w-6 text-pink-300" />
                </div>
                <h2 className="text-sm font-bold text-white mb-2">Cadastro</h2>
                <p className="text-white/70 text-xs mb-3">
                  Crie sua conta
                </p>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-2 text-xs rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleNewUser}
              >
                Cadastrar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Ao continuar, você concorda com nossos Termos de Uso
          </p>
        </div>
      </div>
    </div>
  );
}
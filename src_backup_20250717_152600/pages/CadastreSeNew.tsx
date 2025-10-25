import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Camera, User, Mail, Lock, Calendar, MapPin, Heart } from "lucide-react";

export function CadastreSeNew() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
    location: "",
    interests: [] as string[],
    photos: [] as string[],
  });

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - create account
      console.log("Creating account:", formData);
      setLocation("/discover");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const availableInterests = [
    "Música", "Filmes", "Viagem", "Esportes", "Culinária", "Arte", 
    "Leitura", "Dança", "Tecnologia", "Natureza", "Café", "Fotografia"
  ];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">Como você se chama?</h2>
              <p className="text-white opacity-90">Este nome aparecerá no seu perfil</p>
            </div>
            
            <div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                placeholder="Seu nome"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Mail className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">Qual seu email?</h2>
              <p className="text-white opacity-90">Vamos usar para recuperar sua conta</p>
            </div>
            
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Lock className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">Crie uma senha</h2>
              <p className="text-white opacity-90">Mínimo 8 caracteres</p>
            </div>
            
            <div className="space-y-4">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                placeholder="Sua senha"
                required
                minLength={8}
              />
              
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                placeholder="Confirme sua senha"
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">Quando você nasceu?</h2>
              <p className="text-white opacity-90">Sua idade aparecerá no perfil</p>
            </div>
            
            <div>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                required
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">Onde você está?</h2>
              <p className="text-white opacity-90">Vamos encontrar pessoas próximas</p>
            </div>
            
            <div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white text-lg placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                placeholder="Sua cidade"
                required
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-white text-2xl font-bold mb-2">Seus interesses</h2>
              <p className="text-white opacity-90">Escolha pelo menos 3 interesses</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {availableInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.interests.includes(interest)
                      ? 'bg-white bg-opacity-20 border-white text-white'
                      : 'bg-white bg-opacity-10 border-white border-opacity-30 text-white opacity-70'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <button onClick={handleBack} className="w-6 h-6 text-white">
            <ArrowLeft className="w-full h-full" />
          </button>
          <h1 className="text-white text-lg font-semibold">
            {currentStep} de {totalSteps}
          </h1>
          <div className="w-6"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleNext}
            className="mix-button w-full py-4 text-lg font-semibold"
            disabled={
              (currentStep === 1 && !formData.name) ||
              (currentStep === 2 && !formData.email) ||
              (currentStep === 3 && (!formData.password || formData.password !== formData.confirmPassword)) ||
              (currentStep === 4 && !formData.birthDate) ||
              (currentStep === 5 && !formData.location) ||
              (currentStep === 6 && formData.interests.length < 3)
            }
          >
            {currentStep === totalSteps ? "Criar conta" : "Continuar"}
          </button>
          
          <div className="text-center">
            <p className="text-white opacity-70 text-sm">
              Já tem conta?{" "}
              <Link href="/login" className="text-white underline font-semibold">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
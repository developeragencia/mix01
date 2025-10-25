import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload, X, ChevronDown } from "lucide-react";
import { FaGoogle, FaFacebook, FaPhone } from "react-icons/fa";

export default function CadastreSe() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1); // Multi-step form
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    day: "",
    month: "",
    year: "",
    gender: "",
    interestedIn: "",
    sexualOrientation: "",
    bio: "",
    jobTitle: "",
    company: "",
    school: "",
    location: "",
    characteristic: ""
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const characteristics = [
    "🎉 Baladeiro",
    "🏠 Caseiro", 
    "☕ Do café",
    "🍷 Do vinho",
    "🌍 Aventureiro",
    "💕 Romântico",
    "🏃 Esportivo",
    "🎨 Artístico",
    "📚 Intelectual",
    "🌿 Natureza",
    "👨‍🍳 Gourmet",
    "✈️ Viajante",
    "🎵 Music Lover",
    "🎮 Gamer",
    "🍕 Foodie",
    "📸 Fotógrafo",
    "🏖️ Praia",
    "⛰️ Montanha",
    "🦉 Coruja",
    "🐓 Madrugador",
    "📖 Leitor",
    "🎬 Cinéfilo",
    "🐶 Pet Lover",
    "🧘 Yoga",
    "💪 Fitness",
    "💼 Empreendedor",
    "🙏 Espiritual",
    "✨ Minimalista",
    "🌈 Maximalista",
    "💻 Tech"
  ];

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => String(currentYear - 18 - i));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview("");
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const signupData = new FormData();
      signupData.append('firstName', formData.firstName);
      signupData.append('lastName', formData.lastName);
      signupData.append('email', formData.email);
      signupData.append('phone', formData.phone);
      
      // Combinar data de nascimento
      const dateOfBirth = `${formData.year}-${formData.month}-${formData.day}`;
      signupData.append('dateOfBirth', dateOfBirth);
      
      signupData.append('gender', formData.gender);
      signupData.append('interestedIn', formData.interestedIn);
      signupData.append('sexualOrientation', formData.sexualOrientation);
      signupData.append('password', formData.password);
      signupData.append('bio', formData.bio);
      signupData.append('jobTitle', formData.jobTitle);
      signupData.append('company', formData.company);
      signupData.append('school', formData.school);
      signupData.append('location', formData.location);
      signupData.append('characteristic', formData.characteristic);
      
      if (profilePhoto) {
        signupData.append('profilePhoto', profilePhoto);
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: signupData,
      });

      if (response.ok) {
        setLocation("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao criar conta");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Cadastrar</h2>
              <p className="text-gray-600 text-sm">Preencha seus dados</p>
            </div>

            {/* Botões de cadastro social */}
            <div className="space-y-3 mb-5">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm rounded-lg"
                onClick={() => window.location.href = '/api/auth/google'}
              >
                <FaGoogle className="mr-2 text-red-500" />
                Cadastrar com Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm rounded-lg"
              >
                <FaFacebook className="mr-2 text-blue-600" />
                Cadastrar com Facebook
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border border-gray-300 hover:border-gray-400 text-gray-700 text-sm rounded-lg"
              >
                <FaPhone className="mr-2 text-green-500" />
                Cadastrar com Telefone
              </Button>
            </div>

            {/* Separador OU */}
            <div className="flex items-center my-5">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-3 text-gray-500 text-sm">OU</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Nome e Email */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Nome"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3"
                  required
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Sobrenome"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3"
                  required
                />
              </div>

              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3"
                required
              />

              <div className="space-y-3">
                <Input
                  type="password"
                  name="password"
                  placeholder="Senha"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3"
                  required
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar senha"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">INSCRIÇÃO</h2>
              <p className="text-gray-600 text-sm">Nome</p>
              <p className="text-gray-500 text-xs mt-2">ENTRE 3 E 13 CARACTERES</p>
            </div>

            <Input
              type="text"
              name="firstName"
              placeholder="Nome"
              value={formData.firstName}
              onChange={handleInputChange}
              className="h-12 text-lg border border-gray-300 focus:border-blue-500 rounded-lg px-4 text-center"
              maxLength={13}
              minLength={3}
              required
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">INSCRIÇÃO</h2>
              <p className="text-gray-600 text-sm mb-6">EU NASCI</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <select
                  name="day"
                  value={formData.day}
                  onChange={(e) => setFormData(prev => ({ ...prev, day: e.target.value }))}
                  className="w-full h-12 text-lg border border-gray-300 focus:border-blue-500 rounded-lg px-4 bg-white appearance-none text-center"
                  required
                >
                  <option value="">09</option>
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  name="month"
                  value={formData.month}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                  className="w-full h-12 text-lg border border-gray-300 focus:border-blue-500 rounded-lg px-4 bg-white appearance-none text-center"
                  required
                >
                  <option value="">09</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  name="year"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full h-12 text-lg border border-gray-300 focus:border-blue-500 rounded-lg px-4 bg-white appearance-none text-center"
                  required
                >
                  <option value="">1989</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm mb-6">FOTO DE PERFIL</p>
              <p className="text-sm text-gray-600 px-4">
                COLOCAR UMA BOA FOTO EM SEU PERFIL AUMENTA CONSIDERAVELMENTE SUAS CHANCES DE SUCESSO DENTRO DO APP!
              </p>
            </div>

            <div className="flex justify-center mb-6">
              {photoPreview ? (
                <div className="relative w-32 h-32">
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="block w-32 h-32 border-4 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-400 transition-colors bg-gray-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center mb-2">
                      <span className="text-xl text-gray-400">+</span>
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Biografia</h2>
            </div>

            <div className="space-y-4">
              <Textarea
                name="bio"
                placeholder="Texto curto"
                value={formData.bio}
                onChange={handleInputChange}
                className="h-32 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3 py-2 resize-none"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 text-right">{formData.bio.length}/150</p>

              {/* Campos adicionais */}
              <Input
                type="text"
                name="phone"
                placeholder="Telefone"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Gênero</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3 bg-white"
                  required
                >
                  <option value="" disabled>Selecione seu gênero</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="nao-binario">Não-binário</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Interessado em</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, interestedIn: "homem" }))}
                    className={`h-10 text-sm border rounded-lg px-3 transition-all ${
                      formData.interestedIn === "homem" 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    Homem
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, interestedIn: "mulher" }))}
                    className={`h-10 text-sm border rounded-lg px-3 transition-all ${
                      formData.interestedIn === "mulher" 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    Mulher
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, interestedIn: "ambos" }))}
                    className={`h-10 text-sm border rounded-lg px-3 transition-all ${
                      formData.interestedIn === "ambos" 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                  >
                    Ambos
                  </button>
                </div>
              </div>

              <Input
                type="text"
                name="location"
                placeholder="Cidade"
                value={formData.location}
                onChange={handleInputChange}
                className="h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sua vibe</label>
                <select
                  name="characteristic"
                  value={formData.characteristic}
                  onChange={(e) => setFormData(prev => ({ ...prev, characteristic: e.target.value }))}
                  className="w-full h-10 text-sm border border-gray-300 focus:border-blue-500 rounded-lg px-3 bg-white"
                  required
                >
                  <option value="" disabled>Escolha sua característica</option>
                  {characteristics.map((char) => (
                    <option key={char} value={char}>{char}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] flex flex-col items-center justify-center p-6">
      {/* Logo MIX */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">♥</span>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-white text-4xl font-bold">mix</h1>
      </div>

      {/* Card branco de cadastro */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        {error && (
          <Alert variant="destructive" className="mb-4 bg-red-100 border-red-300 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={step === 5 ? handleSignup : (e) => { e.preventDefault(); handleNext(); }}>
          {renderStep()}

          {/* Botões de navegação */}
          <div className="flex gap-3 mt-8">
            <Button
              type="button"
              onClick={handlePrevious}
              className="flex-1 h-12 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-full"
              disabled={step === 1}
            >
              Anterior
            </Button>
            
            <Button 
              type="submit"
              className="flex-1 h-12 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-full"
              disabled={isLoading}
            >
              {step === 5 ? (isLoading ? "Criando..." : "CRIAR CONTA") : "PRÓXIMO"}
            </Button>
          </div>
        </form>

        {/* Link para login */}
        {step === 1 && (
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Já tem uma conta? 
              <button 
                onClick={() => setLocation("/login")}
                className="text-blue-600 hover:underline ml-1 font-medium"
              >
                Entrar
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
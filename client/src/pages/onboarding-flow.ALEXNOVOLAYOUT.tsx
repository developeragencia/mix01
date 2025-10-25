import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, PartyPopper } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import mixLogo from "@assets/Logo_MIX_horizontal_1750591494976.png";

// Dados dos interesses por categoria
const interestCategories = {
  outdoor: {
    icon: "🏕️",
    name: "Atividades ao ar livre e aventura",
    items: [
      "Remo", "Saltos Ornamentais", "Jet ski", "Tours a pé", "Natureza",
      "Ski", "Snowboard", "Bares de praia", "Velejar", "Camping",
      "Fontes termais", "Passear com o cachorro", "Canoagem", "Viagens de carro",
      "Couchsurfing", "Mergulho livre", "Viagem", "Stand Up Paddle", "Surfe",
      "Parapente", "Trilha", "Montanhas", "Mochilão", "Escalada em rocha",
      "Pesca", "Ar livre", "Piquenique"
    ]
  },
  wellness: {
    icon: "🌿",
    name: "Bem-estar e estilo de vida",
    items: [
      "Amor próprio", "Experimentar coisas novas", "Tarô", "Spa", "Autocuidado",
      "Autodesenvolvimento", "Meditação", "Skincare", "Maquiagem", "Astrologia",
      "Mindfulness", "Sauna", "Estilo de vida ativo", "Yoga"
    ]
  },
  food: {
    icon: "🍽️",
    name: "Comida e bebida",
    items: ["Foodie", "Tours gastronômicos", "Comida de rua", "Churrasco", "Mocktails"]
  },
  home: {
    icon: "🏠",
    name: "De boa em casa",
    items: [
      "Leitura", "Maratonar séries", "Treino em casa", "Trívia", "Cozinhar",
      "Jogos online", "Jardinagem", "Jogos de tabuleiro", "Fazer pães e bolos"
    ]
  },
  sports: {
    icon: "⚽",
    name: "Esportes e fitness",
    items: [
      "Hóquei no gelo", "Tiro Esportivo", "Atletismo", "Futebol americano",
      "Crossfit", "Esportes", "Caminhada", "Esportes de praia", "Aulas fitness",
      "Patinação", "Pole dance", "Corrida de carro", "Esporte motorizado",
      "Jogging", "Tênis", "Skate", "Ginástica", "Hóquei", "Basquete", "Corrida",
      "Academia", "Críquete", "Levantamento de peso", "Luta livre", "Badminton",
      "Pilates", "Cheerleading"
    ]
  },
  geek: {
    icon: "🎮",
    name: "Favoritos dos fãs",
    items: [
      "Comic-con", "Harry Potter", "Criança dos anos 90", "NBA", "MLB",
      "Dungeons & Dragons", "Mangá", "Marvel", "Disney"
    ]
  },
  gaming: {
    icon: "🎮",
    name: "Games",
    items: [
      "E-sports", "PlayStation", "Fortnite", "Xbox", "League of Legends",
      "Among Us", "Nintendo", "Atari", "Roblox"
    ]
  },
  music: {
    icon: "🎵",
    name: "Música",
    items: ["Pisadinha", "Pagode", "Brega Funk", "MPB"]
  }
};

const lookingForOptions = [
  { emoji: "💘", title: "Relacionamento sério", subtitle: "" },
  { emoji: "😍", title: "Algo sério, mas vamos ver...", subtitle: "" },
  { emoji: "🥂", title: "Nada sério, mas depende...", subtitle: "" },
  { emoji: "🎉", title: "Algo casual", subtitle: "" },
  { emoji: "👋", title: "Novas amizades", subtitle: "" },
  { emoji: "🤔", title: "Ainda não sei", subtitle: "" }
];

export default function OnboardingFlow() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  
  // ✅ Função que detecta em qual etapa o usuário parou
  const getInitialStep = (userData: any): number => {
    if (!userData) return 1;
    
    // Step 2: Nome
    if (!userData.firstName) return 2;
    
    // Step 3: Aniversário
    if (!userData.birthDate) return 3;
    
    // Step 4: Gênero
    if (!userData.gender) return 4;
    
    // Step 5: Orientação
    if (!userData.sexualOrientation || userData.sexualOrientation.length === 0) return 5;
    
    // Step 6: Mostrar-me (interestedIn) - CRÍTICO
    if (!userData.interestedIn || userData.interestedIn.length === 0) return 6;
    
    // Step 7: Procurando por
    if (!userData.relationshipGoals) return 7;
    
    // Step 8: Distância
    // Não verificamos distância pois tem valor default
    
    // Step 9: Estilo de comunicação + educação
    if (!userData.communicationStyle || !userData.educationLevel) return 9;
    
    // Step 10: Signo + linguagem do amor
    if (!userData.starSign || !userData.loveStyle) return 10;
    
    // Step 11: Interesses
    if (!userData.interests || userData.interests.length === 0) return 11;
    
    // Step 12: Fotos (mínimo 2)
    if (!userData.photos || userData.photos.length < 2) return 12;
    
    // Se chegou aqui, perfil está completo
    return 1;
  };
  
  // ✅ TODOS OS HOOKS DEVEM ESTAR NO TOPO, ANTES DE QUALQUER RETURN
  const [step, setStep] = useState(1);
  const [showNameModal, setShowNameModal] = useState(false);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState<string[]>([]);
  const [showGenderOnProfile, setShowGenderOnProfile] = useState(true);
  const [orientation, setOrientation] = useState<string[]>([]);
  const [showOrientationOnProfile, setShowOrientationOnProfile] = useState(true);
  const [showMe, setShowMe] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [distance, setDistance] = useState(80);
  const [communicationStyle, setCommunicationStyle] = useState<string[]>([]);
  const [educationLevel, setEducationLevel] = useState("");
  const [starSign, setStarSign] = useState("");
  const [loveLanguage, setLoveLanguage] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  
  // ✅ Detectar etapa inicial baseado nos dados do usuário
  useEffect(() => {
    if (user) {
      const initialStep = getInitialStep(user);
      console.log("🔵 Etapa inicial detectada:", initialStep);
      console.log("🔵 Dados do usuário:", {
        firstName: user.firstName,
        birthDate: user.birthDate,
        gender: user.gender,
        sexualOrientation: user.sexualOrientation,
        interestedIn: user.interestedIn,
        relationshipGoals: user.relationshipGoals,
        communicationStyle: user.communicationStyle,
        educationLevel: user.educationLevel,
        starSign: user.starSign,
        loveStyle: user.loveStyle,
        interests: user.interests,
        photos: user.photos?.length
      });
      setStep(initialStep);
    }
  }, [user]);
  
  // ✅ Pré-preencher TODOS os dados existentes do usuário
  useEffect(() => {
    if (user) {
      console.log("🔵 Pré-preenchendo dados existentes do usuário...");
      
      // Nome
      if (user.firstName && !name) {
        setName(user.firstName);
      }
      
      // Aniversário
      if (user.birthDate && !birthday) {
        // Converter de YYYY-MM-DD para DD/MM/YYYY
        const date = new Date(user.birthDate);
        if (!isNaN(date.getTime())) {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          setBirthday(`${day}/${month}/${year}`);
        }
      }
      
      // Gênero
      if (user.gender && gender.length === 0) {
        setGender([user.gender]);
      }
      
      // Orientação
      if (user.sexualOrientation && orientation.length === 0) {
        setOrientation(Array.isArray(user.sexualOrientation) ? user.sexualOrientation : [user.sexualOrientation]);
      }
      
      // Mostrar-me (interestedIn)
      if (user.interestedIn && showMe.length === 0) {
        setShowMe(Array.isArray(user.interestedIn) ? user.interestedIn : [user.interestedIn]);
      }
      
      // Procurando por
      if (user.relationshipGoals && lookingFor.length === 0) {
        setLookingFor([user.relationshipGoals]);
      }
      
      // Estilo de comunicação
      if (user.communicationStyle && communicationStyle.length === 0) {
        setCommunicationStyle([user.communicationStyle]);
      }
      
      // Nível de educação
      if (user.educationLevel && !educationLevel) {
        setEducationLevel(user.educationLevel);
      }
      
      // Signo
      if (user.starSign && !starSign) {
        setStarSign(user.starSign);
      }
      
      // Linguagem do amor
      if (user.loveStyle && loveLanguage.length === 0) {
        setLoveLanguage([user.loveStyle]);
      }
      
      // Interesses
      if (user.interests && interests.length === 0) {
        setInterests(Array.isArray(user.interests) ? user.interests : []);
      }
      
      // Fotos
      if (user.photos && photos.length === 0) {
        const userPhotos = Array.isArray(user.photos) ? user.photos : [];
        if (userPhotos.length > 0) {
          setPhotos(userPhotos);
        } else if (user.profileImage) {
          setPhotos([user.profileImage]);
        }
      } else if (!user.photos && user.profileImage && photos.length === 0) {
        setPhotos([user.profileImage]);
      }
    }
  }, [user]);
  
  // Proteção: redirecionar se não autenticado
  if (!isLoading && !user) {
    console.log("🔴 Usuário não autenticado, redirecionando para login...");
    window.location.href = '/';
    return null;
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  const totalSteps = 12;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    if (step === 2 && name.trim()) {
      setShowNameModal(true);
      return;
    }
    
    if (step === totalSteps) {
      // Salvar todos os dados COMPLETOS (user + profile)
      try {
        console.log("🔵 ========================================");
        console.log("🔵 SALVANDO ONBOARDING COMPLETO");
        console.log("🔵 ========================================");
        console.log("🔵 Birthday formato original:", birthday);
        
        // Converter data de DD/MM/YYYY para YYYY-MM-DD
        let formattedBirthDate = birthday;
        if (birthday && birthday.includes('/')) {
          const parts = birthday.split('/');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            formattedBirthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          }
        }
        console.log("🔵 Birthday formato convertido:", formattedBirthDate);
        
        // ✅ VALIDAÇÃO: Garantir que fotos são válidas (base64 data URLs)
        const validPhotos = photos.filter(photo => {
          if (!photo) return false;
          if (!photo.startsWith('data:image/')) {
            console.warn("⚠️ Foto inválida detectada (não é base64):", photo.substring(0, 50));
            return false;
          }
          return true;
        });
        
        console.log("🔵 ========================================");
        console.log("🔵 FOTOS:");
        console.log(`🔵 Total de fotos: ${photos.length}`);
        console.log(`🔵 Fotos válidas: ${validPhotos.length}`);
        validPhotos.forEach((photo, idx) => {
          const sizeKB = Math.round((photo.length * 0.75) / 1024);
          const mimeType = photo.substring(0, photo.indexOf(';'));
          console.log(`🔵 Foto ${idx + 1}: ${sizeKB} KB, tipo: ${mimeType}`);
        });
        console.log("🔵 ========================================");
        
        const payload = {
          // Dados do perfil
          name,
          bio: lookingFor.join(", "),
          gender: gender[0],
          interests,
          photos: validPhotos, // ✅ Usar apenas fotos válidas
          relationshipGoals: lookingFor[0],
          languages: [],
          starSign,
          educationLevel,
          communicationStyle: communicationStyle[0],
          loveStyle: loveLanguage[0],
          // Dados críticos do usuário (para isProfileComplete)
          birthDate: formattedBirthDate,
          interestedIn: showMe, // CRÍTICO: salvar "interessado em"
          sexualOrientation: orientation
        };
        
        console.log("🔵 ========================================");
        console.log("🔵 PAYLOAD COMPLETO:");
        console.log("🔵 Nome:", payload.name);
        console.log("🔵 Gênero:", payload.gender);
        console.log("🔵 Data nascimento:", payload.birthDate);
        console.log("🔵 Interessado em:", payload.interestedIn);
        console.log("🔵 Fotos:", payload.photos.length);
        console.log("🔵 Interesses:", payload.interests.length);
        console.log("🔵 ========================================");
        
        const response = await apiRequest(`/api/profiles/${user?.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ao salvar: ${errorText}`);
        }
        
        const result = await response.json();
        console.log("🔵 ✅ Resposta do servidor:", result);
        console.log("🔵 ✅ Onboarding salvo com sucesso! Redirecionando...");
        
        // ✅ CRÍTICO: Invalidar TODOS os caches relacionados
        await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/user'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/profiles', user?.id] });
        
        console.log("🔵 ✅ Cache invalidado com sucesso!");
        console.log("🔵 ========================================");
        
        // Redirecionar para página de sucesso separada
        window.location.href = '/onboarding/success';
      } catch (error: any) {
        console.error('🔴 ========================================');
        console.error('🔴 ERRO AO SALVAR ONBOARDING');
        console.error('🔴 ========================================');
        console.error('🔴 Erro:', error);
        console.error('🔴 Mensagem:', error.message);
        console.error('🔴 ========================================');
        alert(`Erro ao salvar onboarding:\n\n${error.message || 'Erro desconhecido'}\n\nPor favor, tente novamente.`);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSelection = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, multi = true) => {
    setter(prev => {
      if (!multi) return [value];
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      }
      return [...prev, value];
    });
  };

  const isValidBirthday = (dateStr: string): boolean => {
    if (dateStr.length !== 10) return false;
    const parts = dateStr.split('/').map(p => p.trim());
    if (parts.length !== 3) return false;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Validate that the date is real (e.g., not Feb 30)
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getDate() !== day || birthDate.getMonth() !== month - 1 || birthDate.getFullYear() !== year) {
      return false;
    }
    
    // Calculate age considering year, month, and day
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18 && year >= 1900;
  };

  const canProceed = () => {
    switch(step) {
      case 2: return name.trim().length > 0;
      case 3: return isValidBirthday(birthday);
      case 4: return gender.length > 0;
      case 5: return orientation.length > 0;
      case 6: return showMe.length > 0;
      case 7: return lookingFor.length > 0;
      case 9: return communicationStyle.length > 0 && educationLevel.length > 0; // Both required
      case 10: return starSign.length > 0 && loveLanguage.length > 0; // Both required
      case 11: return interests.length > 0;
      case 12: return photos.length >= 2;
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress Bar */}
      {step > 1 && (
        <div className="w-full bg-gray-800 h-1">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      {step > 1 && (
        <div className="p-4">
          <button
            onClick={handleBack}
            className="text-white hover:opacity-80"
            data-testid="button-back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pb-6">
        
        {/* Step 1: Welcome / Rules */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div className="flex flex-col items-center">
              <img src={mixLogo} alt="MIX" className="h-16 w-auto mb-8" data-testid="img-logo" />
              
              <h1 className="text-white text-4xl font-bold mb-6" data-testid="text-welcome-title">
                Bem-vindo(a) ao<br />Mix.
              </h1>
              
              <p className="text-gray-300 text-lg mb-8" data-testid="text-welcome-subtitle">
                Siga as regras da casa.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-bold text-lg mb-2" data-testid="text-rule-1-title">Seja você mesmo(a).</h3>
                  <p className="text-gray-400" data-testid="text-rule-1-desc">
                    Certifique-se de que suas fotos, idade e descrição sejam verdadeiras.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg mb-2" data-testid="text-rule-2-title">Proteja-se.</h3>
                  <p className="text-gray-400" data-testid="text-rule-2-desc">
                    Não dê informações pessoais logo de cara.{" "}
                    <a href="#" className="text-blue-400 underline" data-testid="link-safety-tips">Dicas de segurança</a>
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg mb-2" data-testid="text-rule-3-title">Seja legal.</h3>
                  <p className="text-gray-400" data-testid="text-rule-3-desc">
                    Respeite os outros e os trate como você gostaria de ser tratado(a).
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-bold text-lg mb-2" data-testid="text-rule-4-title">Seja pró-ativo(a).</h3>
                  <p className="text-gray-400" data-testid="text-rule-4-desc">
                    Sempre denuncie mau comportamento.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 rounded-full text-lg"
              data-testid="button-accept-rules"
            >
              Eu aceito
            </Button>
          </div>
        )}

        {/* Step 2: Name */}
        {step === 2 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-6" data-testid="text-name-title">
                Qual é o seu nome?
              </h1>

              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu primeiro nome"
                className="bg-transparent border-b-2 border-gray-500 rounded-none text-white text-lg pb-2 focus:border-pink-500"
                data-testid="input-name"
              />

              <p className="text-gray-400 mt-4 text-sm" data-testid="text-name-info">
                É assim que vai aparecer no seu perfil.<br />
                Não é possível alterar isso mais tarde.
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-400 font-bold py-6 rounded-full text-lg disabled:opacity-50"
              data-testid="button-name-next"
            >
              Seguinte
            </Button>
          </div>
        )}

        {/* Name Confirmation Modal */}
        {showNameModal && (
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-indigo-900/95 flex items-center justify-center z-50 p-6">
            <div className="bg-gradient-to-br from-blue-800 to-indigo-800 rounded-3xl p-8 max-w-sm w-full backdrop-blur-xl" data-testid="modal-name-confirmation">
              <div className="text-6xl mb-6 text-center">👋</div>
              
              <h2 className="text-white text-2xl font-bold text-center mb-4" data-testid="text-modal-greeting">
                Que bom te ver por aqui,<br />{name}!
              </h2>
              
              <p className="text-gray-400 text-center mb-6" data-testid="text-modal-message">
                Tem muita gente pra você conhecer. Mas vamos configurar seu perfil primeiro.
              </p>

              <Button
                onClick={() => {
                  setShowNameModal(false);
                  setStep(step + 1);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 rounded-full mb-3"
                data-testid="button-modal-confirm"
              >
                Bora lá
              </Button>

              <button
                onClick={() => setShowNameModal(false)}
                className="w-full text-white font-medium py-2"
                data-testid="button-modal-edit"
              >
                Editar nome
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Birthday */}
        {step === 3 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-6" data-testid="text-birthday-title">
                Seu aniversário?
              </h1>

              <Input
                type="text"
                value={birthday}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let formatted = value;
                  if (value.length >= 2) {
                    formatted = value.slice(0, 2) + '/' + value.slice(2);
                  }
                  if (value.length >= 4) {
                    formatted = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4, 8);
                  }
                  setBirthday(formatted);
                }}
                placeholder="DD / MM / AAAA"
                maxLength={10}
                className="bg-transparent border-b-2 border-gray-500 rounded-none text-white text-lg pb-2 focus:border-pink-500 text-center tracking-widest"
                data-testid="input-birthday"
              />

              <p className="text-gray-400 mt-4 text-sm" data-testid="text-birthday-info">
                Seu perfil mostra sua idade, não sua data de nascimento.
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-400 font-bold py-6 rounded-full text-lg disabled:opacity-50"
              data-testid="button-birthday-next"
            >
              Seguinte
            </Button>
          </div>
        )}

        {/* Step 4: Gender */}
        {step === 4 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-4" data-testid="text-gender-title">
                Qual o seu gênero?
              </h1>
              
              <p className="text-gray-400 mb-6 text-sm" data-testid="text-gender-subtitle">
                Selecione todas as opções que melhor te descrevem pra gente poder mostrar seu perfil para as pessoas certas. Você pode adicionar mais detalhes se quiser.
              </p>

              <div className="space-y-3">
                {['Homem', 'Mulher', 'Além de binário'].map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleSelection(option, setGender, false)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all ${
                      gender.includes(option)
                        ? 'border-pink-500 bg-pink-500/20 text-white'
                        : 'border-gray-600 text-white'
                    }`}
                    data-testid={`button-gender-${option.toLowerCase().replace(' ', '-')}`}
                  >
                    {option}
                    {gender.includes(option) && (
                      <span className="float-right text-pink-500">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <button className="text-blue-400 mt-6 text-sm" data-testid="link-gender-info">
                Saiba como o Mix usa esta informação
              </button>

              <div className="flex items-center justify-between mt-8 p-4 bg-gray-800/50 rounded-2xl">
                <span className="text-white text-sm" data-testid="text-show-gender">Mostrar gênero no perfil</span>
                <input
                  type="checkbox"
                  checked={showGenderOnProfile}
                  onChange={(e) => setShowGenderOnProfile(e.target.checked)}
                  className="w-6 h-6"
                  data-testid="checkbox-show-gender"
                />
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 rounded-full text-lg disabled:opacity-50"
              data-testid="button-gender-next"
            >
              Seguinte
            </Button>
          </div>
        )}

        {/* Step 5: Sexual Orientation */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-white text-3xl font-bold" data-testid="text-orientation-title">
                  Qual é a sua orientação sexual?
                </h1>
                <button className="text-gray-400 text-sm" data-testid="button-skip-orientation">Pular</button>
              </div>
              
              <p className="text-gray-400 mb-6 text-sm" data-testid="text-orientation-subtitle">
                Selecione todas as opções que melhor te descrevem pra refletir sua identidade.
              </p>

              <div className="space-y-3">
                {[
                  { title: 'Heterossexual', desc: 'Alguém que se sente atraído exclusivamente por pessoas do gênero oposto' },
                  { title: 'Homossexual', desc: 'Um termo abrangente usado para descrever alguém que sente atração por pessoas do mesmo gênero' },
                  { title: 'Lésbica', desc: 'Uma mulher que sente atração sexual, romântica ou emocional por outra mulher' },
                  { title: 'Bissexual', desc: 'Alguém que pode sentir atração sexual, romântica ou emocional por pessoas de mais de um gênero' }
                ].map((option) => (
                  <button
                    key={option.title}
                    onClick={() => toggleSelection(option.title, setOrientation)}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      orientation.includes(option.title)
                        ? 'border-pink-500 bg-pink-500/20'
                        : 'border-gray-600'
                    }`}
                    data-testid={`button-orientation-${option.title.toLowerCase()}`}
                  >
                    <div className="font-medium text-white">{option.title}</div>
                    <div className="text-sm text-gray-400 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8">
                <span className="text-white text-sm" data-testid="text-show-orientation">Mostrar orientação sexual no perfil</span>
                <input
                  type="checkbox"
                  checked={showOrientationOnProfile}
                  onChange={(e) => setShowOrientationOnProfile(e.target.checked)}
                  className="w-6 h-6"
                  data-testid="checkbox-show-orientation"
                />
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-400 font-bold py-6 rounded-full text-lg disabled:opacity-50"
              data-testid="button-orientation-next"
            >
              Seguinte
            </Button>
          </div>
        )}

        {/* Step 6: Show Me */}
        {step === 6 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-4" data-testid="text-showme-title">
                O que você gostaria de ver?
              </h1>
              
              <p className="text-gray-400 mb-6 text-sm" data-testid="text-showme-subtitle">
                Selecione todas as opções aplicáveis pra gente poder recomendar as pessoas certas pra você.
              </p>

              <div className="space-y-3">
                {['Homens', 'Mulheres', 'Além de binário', 'Todos'].map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleSelection(option, setShowMe)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-medium transition-all ${
                      showMe.includes(option)
                        ? 'border-pink-500 bg-pink-500/20 text-white'
                        : 'border-gray-600 text-white'
                    }`}
                    data-testid={`button-showme-${option.toLowerCase()}`}
                  >
                    {option}
                    {showMe.includes(option) && (
                      <span className="float-right text-pink-500">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <button className="text-blue-400 mt-6 text-sm" data-testid="link-showme-info">
                Saiba como o Mix usa esta informação
              </button>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 rounded-full text-lg disabled:opacity-50"
              data-testid="button-showme-next"
            >
              Seguinte
            </Button>
          </div>
        )}

        {/* Step 7: Looking For */}
        {step === 7 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-4" data-testid="text-lookingfor-title">
                O que você está procurando?
              </h1>
              
              <p className="text-gray-400 mb-6 text-sm" data-testid="text-lookingfor-subtitle">
                Você pode mudar de ideia. No Mix, não faltam opções.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {lookingForOptions.map((option) => (
                  <button
                    key={option.title}
                    onClick={() => toggleSelection(option.title, setLookingFor)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      lookingFor.includes(option.title)
                        ? 'border-pink-500 bg-pink-500/20'
                        : 'border-gray-600'
                    }`}
                    data-testid={`button-lookingfor-${option.title.toLowerCase().replace(/\s+/g, '-').replace(/\,/g, '')}`}
                  >
                    <div className="text-4xl mb-3">{option.emoji}</div>
                    <div className="text-white text-sm font-medium text-center">{option.title}</div>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-400 font-bold py-6 rounded-full text-lg disabled:opacity-50"
              data-testid="button-lookingfor-next"
            >
              Seguinte
            </Button>
          </div>
        )}

        {/* Step 8: Distance */}
        {step === 8 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-4" data-testid="text-distance-title">
                Distância máxima?
              </h1>
              
              <p className="text-gray-400 mb-8 text-sm" data-testid="text-distance-subtitle">
                Use o controle deslizante para definir a distância máxima dos seus matches em potencial.
              </p>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400" data-testid="text-distance-label">Preferência de distância</span>
                  <span className="text-white font-bold" data-testid="text-distance-value">{distance} km</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="160"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-pink"
                  data-testid="slider-distance"
                />
              </div>

              <p className="text-gray-400 text-sm text-center" data-testid="text-distance-info">
                Você pode alterar as preferências mais tarde nas Configurações
              </p>
            </div>

            <Button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 rounded-full text-lg"
              data-testid="button-distance-next"
            >
              Seguinte
            </Button>
          </div>
        )}

        {/* Step 9: Personality Page 1 - Communication & Education */}
        {step === 9 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-6" data-testid="text-personality-title">
                O que faz de você uma pessoa única?
              </h1>
              
              <p className="text-gray-400 mb-6 text-sm" data-testid="text-personality-subtitle">
                Responda algumas perguntas para nos ajudar a encontrar matches perfeitos para você.
              </p>

              {/* Communication Style */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Estilo de comunicação</h3>
                <div className="flex flex-wrap gap-2">
                  {['Melhor por mensagem', 'Ligação de vídeo', 'Ao vivo', 'Ligação por telefone'].map((style) => (
                    <button
                      key={style}
                      onClick={() => toggleSelection(style, setCommunicationStyle)}
                      className={`px-4 py-2 rounded-full border transition-all text-sm ${
                        communicationStyle.includes(style)
                          ? 'border-pink-500 bg-pink-500/20 text-white'
                          : 'border-gray-600 text-gray-300'
                      }`}
                      data-testid={`button-comm-${style.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Education Level */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Nível de educação</h3>
                <div className="flex flex-wrap gap-2">
                  {['Ensino Médio', 'Graduação', 'Mestrado', 'Doutorado', 'Prefiro não dizer'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setEducationLevel(level)}
                      className={`px-4 py-2 rounded-full border transition-all text-sm ${
                        educationLevel === level
                          ? 'border-pink-500 bg-pink-500/20 text-white'
                          : 'border-gray-600 text-gray-300'
                      }`}
                      data-testid={`button-edu-${level.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={
                canProceed()
                  ? 'w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 rounded-full text-lg transition-all'
                  : 'w-full bg-gray-600 text-white font-bold py-6 rounded-full text-lg cursor-not-allowed opacity-50'
              }
              data-testid="button-personality1-next"
            >
              Próxima 1/4
            </button>
          </div>
        )}

        {/* Step 10: Personality Page 2 - Star Sign & Love Language */}
        {step === 10 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-6" data-testid="text-personality2-title">
                Conte mais sobre você
              </h1>

              {/* Star Sign */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Signo</h3>
                <div className="flex flex-wrap gap-2">
                  {['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'].map((sign) => (
                    <button
                      key={sign}
                      onClick={() => setStarSign(sign)}
                      className={`px-4 py-2 rounded-full border transition-all text-sm ${
                        starSign === sign
                          ? 'border-pink-500 bg-pink-500/20 text-white'
                          : 'border-gray-600 text-gray-300'
                      }`}
                      data-testid={`button-sign-${sign.toLowerCase()}`}
                    >
                      {sign}
                    </button>
                  ))}
                </div>
              </div>

              {/* Love Language */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Linguagem do amor</h3>
                <div className="flex flex-wrap gap-2">
                  {['Palavras de afirmação', 'Tempo de qualidade', 'Presentes', 'Atos de serviço', 'Toque físico'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleSelection(lang, setLoveLanguage)}
                      className={`px-4 py-2 rounded-full border transition-all text-sm ${
                        loveLanguage.includes(lang)
                          ? 'border-pink-500 bg-pink-500/20 text-white'
                          : 'border-gray-600 text-gray-300'
                      }`}
                      data-testid={`button-love-${lang.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={
                canProceed()
                  ? 'w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 rounded-full text-lg transition-all'
                  : 'w-full bg-gray-600 text-white font-bold py-6 rounded-full text-lg cursor-not-allowed opacity-50'
              }
              data-testid="button-personality2-next"
            >
              Próxima 2/4
            </button>
          </div>
        )}

        {/* Step 11: Interests */}
        {step === 11 && (
          <div className="flex-1 flex flex-col justify-between py-8 overflow-auto">
            <div>
              <h1 className="text-white text-3xl font-bold mb-4" data-testid="text-interests-title">
                O que você curte?
              </h1>
              
              <p className="text-gray-400 mb-6 text-sm" data-testid="text-interests-subtitle">
                Adicione até 10 interesses ao seu perfil para encontrar pessoas que gostam do mesmo que você.
              </p>

              <div className="space-y-6">
                {Object.entries(interestCategories).map(([key, category]) => (
                  <div key={key}>
                    <h3 className="text-white font-medium mb-3 flex items-center gap-2" data-testid={`text-category-${key}`}>
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.slice(0, 10).map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            if (interests.length < 10 || interests.includes(item)) {
                              toggleSelection(item, setInterests);
                            }
                          }}
                          className={`px-4 py-2 rounded-full border transition-all text-sm ${
                            interests.includes(item)
                              ? 'border-pink-500 bg-pink-500/20 text-white'
                              : 'border-gray-600 text-gray-300'
                          }`}
                          data-testid={`button-interest-${item.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <span className="text-gray-400" data-testid="text-interests-count">Próxima {interests.length}/10</span>
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={interests.length === 0}
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-400 font-bold py-6 rounded-full text-lg disabled:opacity-50 mt-6"
              data-testid="button-interests-next"
            >
              Próxima {interests.length}/10
            </Button>
          </div>
        )}

        {/* Step 12: Photos */}
        {step === 12 && (
          <div className="flex-1 flex flex-col justify-between py-8">
            <div>
              <h1 className="text-white text-3xl font-bold mb-4" data-testid="text-photos-title">
                Adicione suas fotos recentes
              </h1>
              
              <p className="text-gray-400 mb-6 text-sm" data-testid="text-photos-subtitle">
                Carregue 2 fotos pra começar. Adicione 4 ou mais fotos para destacar seu perfil.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <div key={index} className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const img = new Image();
                          const reader = new FileReader();
                          
                          reader.onload = (event) => {
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              let width = img.width;
                              let height = img.height;
                              
                              // ✅ Reduzido para melhor compressão (1.7MB → ~100-150KB)
                              const MAX_WIDTH = 600;
                              const MAX_HEIGHT = 900;
                              
                              if (width > height) {
                                if (width > MAX_WIDTH) {
                                  height = height * (MAX_WIDTH / width);
                                  width = MAX_WIDTH;
                                }
                              } else {
                                if (height > MAX_HEIGHT) {
                                  width = width * (MAX_HEIGHT / height);
                                  height = MAX_HEIGHT;
                                }
                              }
                              
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              ctx?.drawImage(img, 0, 0, width, height);
                              
                              // ✅ JPEG com quality 0.65 para melhor compressão
                              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.65);
                              
                              // ✅ Calcular tamanho sem expor base64 completa
                              const sizeKB = Math.round((compressedDataUrl.length * 0.75) / 1024);
                              console.log(`📸 Foto ${index + 1} comprimida: ${width}x${height}, ${sizeKB} KB`);
                              
                              if (sizeKB > 300) {
                                console.warn(`⚠️ Foto ${index + 1} muito grande: ${sizeKB} KB (máx: 300 KB)`);
                              }
                              
                              const newPhotos = [...photos];
                              newPhotos[index] = compressedDataUrl;
                              setPhotos(newPhotos.filter(p => p));
                            };
                            img.src = event.target?.result as string;
                          };
                          
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id={`photo-input-${index}`}
                    />
                    <label
                      htmlFor={`photo-input-${index}`}
                      className="aspect-[3/4] border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center bg-gray-800/50 cursor-pointer hover:border-pink-500 transition-colors block"
                      data-testid={`button-photo-${index}`}
                    >
                      {photos[index] ? (
                        <div className="relative w-full h-full">
                          <img src={photos[index]} alt="" className="w-full h-full object-cover rounded-2xl" />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setPhotos(photos.filter((_, i) => i !== index));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="text-pink-500 text-4xl">+</div>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleNext}
              disabled={photos.length < 2}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-6 rounded-full text-lg disabled:opacity-50 disabled:from-gray-700 disabled:to-gray-700"
              data-testid="button-photos-complete"
            >
              Concluir
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

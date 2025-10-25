import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, User, Ruler, Heart, Languages, Moon, Users, Wine, Cigarette, Dumbbell, Utensils, Music, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function EditProfileNew() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  // Basic Info
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [height, setHeight] = useState("");
  const [relationshipType, setRelationshipType] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  
  // More about me
  const [starSign, setStarSign] = useState("");
  const [familyPlans, setFamilyPlans] = useState("");
  const [personalityType, setPersonalityType] = useState("");
  const [communicationStyle, setCommunicationStyle] = useState("");
  
  // Lifestyle
  const [pets, setPets] = useState("");
  const [drinking, setDrinking] = useState("");
  const [smoking, setSmoking] = useState("");
  const [exercise, setExercise] = useState("");
  const [diet, setDiet] = useState("");
  const [sleepSchedule, setSleepSchedule] = useState("");
  
  // Location & Social
  const [city, setCity] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [favoriteMusic, setFavoriteMusic] = useState("");
  
  // Identity
  const [gender, setGender] = useState("");
  const [sexualOrientation, setSexualOrientation] = useState<string[]>([]);

  // Load existing profile
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/login');
      return;
    }

    if (user?.id) {
      // Garantir que temos os dados mais recentes do usuário
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] }).then(() => {
        // Buscar perfil
        fetch(`/api/profiles/${user.id}`, { credentials: 'include' })
          .then(res => {
            if (res.ok) return res.json();
            if (res.status === 404) {
              console.log("Profile not found, using user data");
              return null;
            }
            throw new Error('Failed to load profile');
          })
          .then(profile => {
            const userData = user as any;
            if (profile) {
              // Priorizar profile.name, depois user.firstName
              setName(profile.name || user.firstName || "");
              setBio(profile.bio || userData.bio || "");
              setInterests(profile.interests || userData.interests || []);
              setHeight(profile.height?.toString() || "");
              setRelationshipType(profile.relationshipGoals || "");
              setLanguages(profile.languages || []);
              setStarSign(profile.starSign || "");
              setFamilyPlans(profile.familyPlans || "");
              setPersonalityType(profile.personalityType || "");
              setCommunicationStyle(profile.communicationStyle || "");
              setPhotos(profile.photos || userData.photos || []);
              setGender(profile.gender || userData.gender || "");
              setSexualOrientation(profile.sexualOrientation || userData.sexualOrientation || []);
              setPets(profile.pets || "");
              setDrinking(profile.drinking || "");
              setSmoking(profile.smoking || "");
              setExercise(profile.exercise || "");
              setDiet(profile.diet || "");
              setSleepSchedule(profile.sleepSchedule || "");
              setCity(profile.location || userData.city || "");
              setSocialMedia(profile.instagram || "");
              setFavoriteMusic(profile.spotify || "");
              
              // Carregar birthDate do usuário
              if (userData.birthDate) {
                // Converter YYYY-MM-DD para DD/MM/YYYY
                const [year, month, day] = userData.birthDate.split('-');
                setBirthDate(`${day}/${month}/${year}`);
              }
              
              console.log("✅ Perfil carregado:", { name: profile.name, firstName: user.firstName });
            } else {
              // Use user data as fallback
              const userData = user as any;
              setName(user.firstName || "");
              setBio(userData.bio || "");
              setInterests(userData.interests || []);
              setPhotos(userData.photos || []);
              setGender(userData.gender || "");
              setSexualOrientation(userData.sexualOrientation || []);
              setCity(userData.city || "");
              
              if (userData.birthDate) {
                const [year, month, day] = userData.birthDate.split('-');
                setBirthDate(`${day}/${month}/${year}`);
              }
              
              console.log("✅ Usando dados do usuário (perfil não existe):", { firstName: user.firstName });
            }
          })
          .catch(err => {
            console.error("Error loading profile:", err);
          });
      });
    }
  }, [user, isLoading, setLocation]);

  const handlePhotoUpload = (index: number, file: File) => {
    // Validar tamanho do arquivo original (máx 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "Por favor, selecione uma imagem menor que 10MB",
        variant: "destructive",
      });
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (event) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Reduzir dimensões mais agressivamente
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 1200;
        
        // Calcular proporção
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
        if (!ctx) {
          toast({
            title: "Erro ao processar imagem",
            description: "Não foi possível processar a imagem. Tente novamente.",
            variant: "destructive",
          });
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Começar com qualidade mais baixa
        let quality = 0.7;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        let sizeKB = Math.round((compressedDataUrl.length * 0.75) / 1024);
        
        console.log(`📸 Foto ${index + 1} inicial: ${width}x${height}, ${sizeKB} KB, qualidade ${quality.toFixed(2)}`);
        
        // Recomprimir agressivamente até ficar abaixo de 250 KB (margem de segurança)
        const MAX_SIZE_KB = 250;
        let attempts = 0;
        const MAX_ATTEMPTS = 20;
        
        while (sizeKB > MAX_SIZE_KB && quality > 0.05 && attempts < MAX_ATTEMPTS) {
          quality -= 0.05;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          sizeKB = Math.round((compressedDataUrl.length * 0.75) / 1024);
          attempts++;
          console.log(`🔄 Tentativa ${attempts}: qualidade ${quality.toFixed(2)}, ${sizeKB} KB`);
        }
        
        console.log(`✅ Foto ${index + 1} final: ${width}x${height}, ${sizeKB} KB, qualidade ${quality.toFixed(2)}`);
        
        // Verificação final
        if (sizeKB > 300) {
          toast({
            title: "Imagem ainda muito grande",
            description: `A foto ${index + 1} tem ${sizeKB} KB. Tente uma imagem menor ou com menos detalhes.`,
            variant: "destructive",
          });
          return;
        }
        
        const newPhotos = [...photos];
        newPhotos[index] = compressedDataUrl;
        setPhotos(newPhotos);
        
        toast({
          title: "Foto adicionada!",
          description: `Foto ${index + 1} (${sizeKB} KB) pronta para salvar`,
        });
      };
      
      img.onerror = () => {
        toast({
          title: "Erro ao carregar imagem",
          description: "Não foi possível carregar a imagem. Tente outro arquivo.",
          variant: "destructive",
        });
      };
      
      img.src = event.target?.result as string;
    };
    
    reader.onerror = () => {
      toast({
        title: "Erro ao ler arquivo",
        description: "Não foi possível ler o arquivo. Tente novamente.",
        variant: "destructive",
      });
    };
    
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    console.log("💾 Salvando alterações do perfil...");

    try {
      // Converter birthDate de DD/MM/YYYY para YYYY-MM-DD
      let formattedBirthDate = "";
      if (birthDate && birthDate.includes('/')) {
        const [day, month, year] = birthDate.split('/');
        formattedBirthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }

      const profileData = {
        userId: user.id,
        name: name || user.firstName,
        birthDate: formattedBirthDate || undefined,
        bio,
        height: height ? parseInt(height) : null,
        relationshipGoals: relationshipType,
        photos: photos.filter(p => p),
        location: city,
        instagram: socialMedia,
        spotify: favoriteMusic
      };

      console.log("🔵 Dados do perfil a salvar:", {
        ...profileData,
        photos: `${profileData.photos.length} fotos`
      });

      const res = await fetch(`/api/profiles/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profileData)
      });
      
      if (!res.ok) {
        let errorMessage = "Erro ao atualizar perfil";
        try {
          const errorData = await res.json();
          console.error("Erro ao atualizar perfil:", errorData);
          
          // Tratamento específico para erro de foto muito grande
          if (errorData.error === "PHOTO_TOO_LARGE") {
            const photoNumbers = errorData.oversizedPhotos?.join(", ") || "";
            errorMessage = `Fotos muito grandes: #${photoNumbers}. Máximo permitido: ${errorData.maxSizeKB} KB por foto.`;
            
            toast({
              title: "Erro ao salvar",
              description: errorMessage,
              variant: "destructive",
            });
            return;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Se não conseguir fazer parse do JSON, usar texto
          const errorText = await res.text();
          console.error("Erro ao atualizar perfil (texto):", errorText);
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      console.log("✅ Perfil atualizado com sucesso!");

      toast({
        title: "Perfil atualizado!",
        description: "Suas alterações foram salvas com sucesso.",
      });
      
      await queryClient.invalidateQueries({ queryKey: ['/api/profiles', user.id] });
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      setTimeout(() => setLocation('/profile'), 500);
    } catch (error: any) {
      console.error("❌ Erro ao salvar perfil:", error);
      
      // Não mostrar toast se já mostramos um específico acima
      if (error.message && !error.message.includes("Fotos muito grandes")) {
        toast({
          title: "Erro ao salvar",
          description: error.message || "Não foi possível salvar as alterações. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-blue-900/80 backdrop-blur-md border-b border-white/10 z-10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            onClick={() => setLocation("/profile")}
            className="text-white hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Editar perfil</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 space-y-4 pt-6">
        {/* Fotos */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold">Fotos</h2>
            <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              IMPORTANTE
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Renderizar fotos existentes */}
            {photos.filter(p => p).map((photo, idx) => {
              const originalIndex = photos.indexOf(photo);
              return (
                <div key={originalIndex} className="relative">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-800/50">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        const newPhotos = [...photos];
                        newPhotos[originalIndex] = "";
                        setPhotos(newPhotos.filter(p => p));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      data-testid={`button-remove-photo-${originalIndex}`}
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
            
            {/* Slot para adicionar nova foto (só aparece se tiver menos de 9) */}
            {photos.filter(p => p).length < 9 && (
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const nextIndex = photos.filter(p => p).length;
                      handlePhotoUpload(nextIndex, file);
                    }
                  }}
                  className="hidden"
                  id="photo-input-add"
                  data-testid="input-photo-add"
                />
                <label
                  htmlFor="photo-input-add"
                  className="aspect-[3/4] border-2 border-dashed border-gray-600 rounded-2xl flex items-center justify-center bg-gray-800/50 cursor-pointer hover:border-pink-500 transition-colors block"
                  data-testid="button-photo-add"
                >
                  <div className="text-center">
                    <div className="text-gray-500 text-4xl mb-1">+</div>
                    <p className="text-xs text-gray-500">Adicionar foto</p>
                  </div>
                </label>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-400 mt-3">
            {photos.filter(p => p).length}/9 fotos adicionadas
          </p>
        </div>

        {/* Nome */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-bold">Nome</h2>
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="bg-transparent border-0 text-white p-0 h-auto focus-visible:ring-0 placeholder:text-gray-600"
            data-testid="input-name"
          />
        </div>

        {/* Data de Nascimento */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-bold">Data de Nascimento</h2>
          </div>
          <Input
            value={birthDate}
            onChange={(e) => {
              let value = e.target.value;
              
              // Remove tudo que não é número
              value = value.replace(/\D/g, '');
              
              // Adiciona as barras automaticamente
              if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
              }
              if (value.length >= 5) {
                value = value.substring(0, 5) + '/' + value.substring(5, 9);
              }
              
              setBirthDate(value);
            }}
            placeholder="DD/MM/AAAA"
            maxLength={10}
            className="bg-transparent border-0 text-white p-0 h-auto focus-visible:ring-0 placeholder:text-gray-600"
            data-testid="input-birthdate"
          />
          <p className="text-sm text-gray-400 mt-2">
            Formato: DD/MM/AAAA (ex: 15/03/1990)
          </p>
        </div>

        {/* Sobre mim */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-bold">Sobre mim</h2>
            <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              IMPORTANTE
            </span>
          </div>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Conte um pouco sobre você..."
            className="bg-transparent border-0 text-white resize-none p-0 focus-visible:ring-0 placeholder:text-gray-600"
            rows={3}
            maxLength={500}
            data-testid="input-bio"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {bio.length}/500
          </div>
        </div>

        {/* Altura */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold">Altura</h2>
          </div>
          <Input
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Altura em cm (ex: 175)"
            className="bg-transparent border-0 text-white p-0 h-auto focus-visible:ring-0 placeholder:text-gray-600"
            data-testid="input-height"
          />
        </div>

        {/* Tipo de relacionamento */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-bold">Tipo de relacionamento</h2>
          </div>
          <Input
            value={relationshipType}
            onChange={(e) => setRelationshipType(e.target.value)}
            placeholder="O que você procura..."
            className="bg-transparent border-0 text-white p-0 h-auto focus-visible:ring-0 placeholder:text-gray-600"
            data-testid="input-relationship-type"
          />
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <h2 className="text-lg font-bold mb-4">Localização & Social</h2>
          
          <div className="space-y-4">
            {/* Cidade */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300">Cidade</span>
              </div>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo"
                className="bg-transparent border-0 text-white p-0 h-auto focus-visible:ring-0 placeholder:text-gray-600"
                data-testid="input-city"
              />
            </div>

            {/* Instagram */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Music className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300">Instagram</span>
              </div>
              <Input
                value={socialMedia}
                onChange={(e) => setSocialMedia(e.target.value)}
                placeholder="@seuinstagram"
                className="bg-transparent border-0 text-white p-0 h-auto focus-visible:ring-0 placeholder:text-gray-600"
                data-testid="input-instagram"
              />
            </div>

            {/* Spotify */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Music className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-300">Spotify</span>
              </div>
              <Input
                value={favoriteMusic}
                onChange={(e) => setFavoriteMusic(e.target.value)}
                placeholder="Artistas favoritos"
                className="bg-transparent border-0 text-white p-0 h-auto focus-visible:ring-0 placeholder:text-gray-600"
                data-testid="input-spotify"
              />
            </div>
          </div>
        </div>

        {/* Botão Salvar */}
        <Button
          onClick={handleSave}
          className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold rounded-full text-lg shadow-lg"
          data-testid="button-save"
        >
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}

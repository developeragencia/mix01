import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Camera, X, Plus, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { brazilStates, brazilCities } from "@/data/brazil-states-cities";

export default function EditProfile() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state - Basic
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [location, setLocationState] = useState("");
  
  // Form state - Professional
  const [job, setJob] = useState("");
  const [company, setCompany] = useState("");
  const [school, setSchool] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  
  // Form state - Physical & Lifestyle
  const [height, setHeight] = useState("");
  const [relationshipGoals, setRelationshipGoals] = useState("");
  const [familyPlans, setFamilyPlans] = useState("");
  const [starSign, setStarSign] = useState("");
  
  // Form state - Personality
  const [personalityType, setPersonalityType] = useState("");
  const [communicationStyle, setCommunicationStyle] = useState("");
  const [loveStyle, setLoveStyle] = useState("");
  
  // Form state - Arrays & Social
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [instagram, setInstagram] = useState("");
  const [spotify, setSpotify] = useState("");
  
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);

  // Atualizar location quando estado ou cidade mudar
  useEffect(() => {
    if (selectedState && selectedCity) {
      const stateLabel = brazilStates.find(s => s.value === selectedState)?.label || selectedState;
      setLocationState(`${selectedCity} - ${selectedState}`);
    } else if (selectedState && !selectedCity) {
      setLocationState("");
    }
  }, [selectedState, selectedCity]);

  // Load existing profile data
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/login');
      return;
    }

    if (user?.id) {
      fetch(`/api/profiles/${user.id}`, { credentials: 'include' })
        .then(res => {
          if (res.ok) return res.json();
          return null;
        })
        .then(profile => {
          if (profile) {
            setHasExistingProfile(true);
            setProfileId(profile.id);
            setName(profile.name || "");
            setAge(profile.age?.toString() || "");
            setBio(profile.bio || "");
            setPhotos(profile.photos || []);
            setInterests(profile.interests || []);
            
            // Parse location (formato: "Cidade - UF")
            const locationStr = profile.location || "";
            setLocationState(locationStr);
            if (locationStr.includes(" - ")) {
              const [city, state] = locationStr.split(" - ");
              setSelectedCity(city.trim());
              setSelectedState(state.trim());
            }
            
            setJob(profile.job || "");
            setCompany(profile.company || "");
            setSchool(profile.school || "");
            setEducationLevel(profile.educationLevel || "");
            setHeight(profile.height?.toString() || "");
            setRelationshipGoals(profile.relationshipGoals || "");
            setFamilyPlans(profile.familyPlans || "");
            setStarSign(profile.starSign || "");
            setPersonalityType(profile.personalityType || "");
            setCommunicationStyle(profile.communicationStyle || "");
            setLoveStyle(profile.loveStyle || "");
            setLanguages(profile.languages || []);
            setInstagram(profile.instagram || "");
            setSpotify(profile.spotify || "");
          }
        })
        .catch(err => console.error("Error loading profile:", err));
    }
  }, [user, isLoading, setLocation]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (photos.length < 9) {
          setPhotos([...photos, base64]);
        } else {
          toast({
            title: "Limite atingido",
            description: "Você pode adicionar no máximo 9 fotos (como no Mix)",
            variant: "destructive"
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const addInterest = () => {
    if (newInterest.trim() && interests.length < 10) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && languages.length < 5) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        toast({ title: "Desconectado!", description: "Até logo!" });
        window.location.href = '/';
      }
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível sair", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age || photos.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, idade e adicione pelo menos uma foto",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const profileData = {
        name,
        age: parseInt(age),
        bio: bio || "",
        photos,
        interests,
        location: location || "",
        job: job || "",
        company: company || "",
        school: school || "",
        educationLevel: educationLevel || "",
        height: height ? parseInt(height) : null,
        relationshipGoals: relationshipGoals || "",
        familyPlans: familyPlans || "",
        starSign: starSign || "",
        personalityType: personalityType || "",
        communicationStyle: communicationStyle || "",
        loveStyle: loveStyle || "",
        languages,
        instagram: instagram || "",
        spotify: spotify || ""
      };

      if (hasExistingProfile && profileId) {
        const response = await apiRequest(`/api/profiles/${user?.id}`, {
          method: 'PUT',
          body: profileData
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Erro ao atualizar perfil");
        }

        toast({
          title: "Perfil atualizado!",
          description: "Suas alterações foram salvas"
        });
      } else {
        const response = await apiRequest('/api/profiles', {
          method: 'POST',
          body: profileData
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Erro ao criar perfil");
        }

        toast({
          title: "Perfil criado!",
          description: "Seu perfil foi criado com sucesso"
        });
      }

      // Invalidar TODOS os caches para garantir sincronização de fotos
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      queryClient.invalidateQueries({ queryKey: ['/api/profiles', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      
      console.log("✅ Perfil salvo! Fotos sincronizadas com sucesso");
      setLocation('/profile');
    } catch (error: any) {
      console.error("🔴 Error saving profile:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar o perfil",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-blue-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/profile')}
            className="text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <h1 className="text-white text-xl font-bold">
            {hasExistingProfile ? 'Editar Perfil' : 'Complete seu Perfil'}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-400 hover:bg-red-500/20"
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-white font-bold mb-4">📸 Adicione suas fotos (máx. 9)</h2>
            
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img 
                    src={photo} 
                    alt={`Foto ${index + 1}`} 
                    className="w-full h-full object-cover"
                    data-testid={`img-photo-${index}`}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`button-remove-photo-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {photos.length < 9 && (
                <label className="aspect-square rounded-xl bg-white/20 border-2 border-dashed border-white/40 flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-xs">Adicionar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    data-testid="input-photo-upload"
                  />
                </label>
              )}
            </div>
            
            <p className="text-white/60 text-xs mt-3">
              {photos.length}/9 fotos adicionadas
            </p>
          </div>

          {/* Basic Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
            <h2 className="text-white font-bold mb-4">ℹ️ Informações Básicas</h2>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Nome *</label>
              <Input
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                required
                data-testid="input-name"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Idade *</label>
              <Input
                type="number"
                placeholder="Sua idade"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="18"
                max="100"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                required
                data-testid="input-age"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Estado</label>
              <Select 
                value={selectedState} 
                onValueChange={(value) => {
                  setSelectedState(value);
                  setSelectedCity(""); // Reset cidade quando mudar estado
                }}
              >
                <SelectTrigger className="bg-white/20 border-white/30 text-white" data-testid="select-state">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilStates.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Cidade</label>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity}
                disabled={!selectedState}
              >
                <SelectTrigger className="bg-white/20 border-white/30 text-white disabled:opacity-50" data-testid="select-city">
                  <SelectValue placeholder={selectedState ? "Selecione a cidade" : "Primeiro selecione um estado"} />
                </SelectTrigger>
                <SelectContent>
                  {selectedState && brazilCities[selectedState]?.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
            <h2 className="text-white font-bold mb-4">💼 Vida Profissional</h2>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Profissão</label>
              <Input
                type="text"
                placeholder="Ex: Engenheiro de Software"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-job"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Empresa</label>
              <Input
                type="text"
                placeholder="Ex: Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-company"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Escola/Universidade</label>
              <Input
                type="text"
                placeholder="Ex: USP"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-school"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Nível de Educação</label>
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white" data-testid="select-education">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">Ensino Médio</SelectItem>
                  <SelectItem value="undergraduate">Graduação</SelectItem>
                  <SelectItem value="graduate">Pós-graduação</SelectItem>
                  <SelectItem value="masters">Mestrado</SelectItem>
                  <SelectItem value="phd">Doutorado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Physical & Lifestyle */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
            <h2 className="text-white font-bold mb-4">🌟 Estilo de Vida</h2>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Altura (cm)</label>
              <Input
                type="number"
                placeholder="Ex: 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-height"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">O que você procura?</label>
              <Select value={relationshipGoals} onValueChange={setRelationshipGoals}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white" data-testid="select-relationship-goals">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long-term">💕 Relacionamento Sério</SelectItem>
                  <SelectItem value="short-term">😊 Algo Casual</SelectItem>
                  <SelectItem value="figuring-out">🤔 Descobrindo</SelectItem>
                  <SelectItem value="friends">🤝 Amizades</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Planos com Filhos</label>
              <Select value={familyPlans} onValueChange={setFamilyPlans}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white" data-testid="select-family-plans">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="want-children">👶 Quero ter filhos</SelectItem>
                  <SelectItem value="dont-want">🚫 Não quero filhos</SelectItem>
                  <SelectItem value="open-to">🤷 Aberto à possibilidade</SelectItem>
                  <SelectItem value="have-children">👨‍👧‍👦 Tenho filhos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Signo</label>
              <Select value={starSign} onValueChange={setStarSign}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white" data-testid="select-star-sign">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Áries">♈ Áries</SelectItem>
                  <SelectItem value="Touro">♉ Touro</SelectItem>
                  <SelectItem value="Gêmeos">♊ Gêmeos</SelectItem>
                  <SelectItem value="Câncer">♋ Câncer</SelectItem>
                  <SelectItem value="Leão">♌ Leão</SelectItem>
                  <SelectItem value="Virgem">♍ Virgem</SelectItem>
                  <SelectItem value="Libra">♎ Libra</SelectItem>
                  <SelectItem value="Escorpião">♏ Escorpião</SelectItem>
                  <SelectItem value="Sagitário">♐ Sagitário</SelectItem>
                  <SelectItem value="Capricórnio">♑ Capricórnio</SelectItem>
                  <SelectItem value="Aquário">♒ Aquário</SelectItem>
                  <SelectItem value="Peixes">♓ Peixes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Personality */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
            <h2 className="text-white font-bold mb-4">🎭 Personalidade</h2>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Tipo de Personalidade (MBTI)</label>
              <Input
                type="text"
                placeholder="Ex: INFP, ENTJ"
                value={personalityType}
                onChange={(e) => setPersonalityType(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-personality-type"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Estilo de Comunicação</label>
              <Input
                type="text"
                placeholder="Ex: Direto, Reflexivo, Emotivo"
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-communication-style"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Linguagem do Amor</label>
              <Input
                type="text"
                placeholder="Ex: Palavras de afirmação, Toque físico"
                value={loveStyle}
                onChange={(e) => setLoveStyle(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-love-style"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-white font-bold mb-4">✍️ Sobre Você</h2>
            <Textarea
              placeholder="Conte um pouco sobre você..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={500}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50 resize-none"
              data-testid="textarea-bio"
            />
            <p className="text-white/60 text-xs mt-2">{bio.length}/500 caracteres</p>
          </div>

          {/* Interests */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-white font-bold mb-4">🎯 Interesses</h2>
            
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="Adicionar interesse"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-interest"
              />
              <Button
                type="button"
                onClick={addInterest}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-add-interest"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-blue-500/30 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  data-testid={`tag-interest-${index}`}
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="hover:text-red-300"
                    data-testid={`button-remove-interest-${index}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {interests.length === 0 && (
              <p className="text-white/60 text-sm">Nenhum interesse adicionado</p>
            )}
          </div>

          {/* Languages */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <h2 className="text-white font-bold mb-4">🌍 Idiomas</h2>
            
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                placeholder="Ex: Português, Inglês"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-language"
              />
              <Button
                type="button"
                onClick={addLanguage}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-add-language"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {languages.map((language, index) => (
                <span
                  key={index}
                  className="bg-green-500/30 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  data-testid={`tag-language-${index}`}
                >
                  {language}
                  <button
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="hover:text-red-300"
                    data-testid={`button-remove-language-${index}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {languages.length === 0 && (
              <p className="text-white/60 text-sm">Nenhum idioma adicionado</p>
            )}
          </div>

          {/* Social Media */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 space-y-4">
            <h2 className="text-white font-bold mb-4">📱 Redes Sociais</h2>
            
            <div>
              <label className="text-white text-sm font-medium mb-2 block">Instagram</label>
              <Input
                type="text"
                placeholder="Seu usuário (sem @)"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value.replace('@', ''))}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-instagram"
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">Spotify</label>
              <Input
                type="text"
                placeholder="Seu artista favorito"
                value={spotify}
                onChange={(e) => setSpotify(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                data-testid="input-spotify"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !name || !age || photos.length === 0}
            className="w-full h-14 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg rounded-xl disabled:opacity-50"
            data-testid="button-save-profile"
          >
            {isSubmitting ? "SALVANDO..." : "SALVAR E CONTINUAR"}
          </Button>
        </form>
      </div>
    </div>
  );
}

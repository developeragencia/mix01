import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, X, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

const createProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  age: z.number().min(18, "Idade mínima é 18 anos").max(100, "Idade máxima é 100 anos"),
  bio: z.string().optional(),
  profession: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()).default([]),
});

type CreateProfileForm = z.infer<typeof createProfileSchema>;

export default function CreateProfile() {
  const [, setLocation] = useLocation();
  const [photos, setPhotos] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateProfileForm>({
    resolver: zodResolver(createProfileSchema),
    defaultValues: {
      interests: [],
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: CreateProfileForm) => {
      // Adicionar fotos demo se não foram carregadas
      const defaultPhotos = photos.length > 0 ? photos : [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=400&h=500&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face"
      ];
      
      const profileData = {
        ...data,
        photos: defaultPhotos,
        interests,
      };
      
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar perfil");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil criado com sucesso!",
        description: "Bem-vindo ao MIX",
      });
      setTimeout(() => {
        setLocation("/discover");
      }, 500);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar perfil",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateProfileForm) => {
    const formData = {
      ...data,
      age: Number(data.age),
      interests,
    };
    createProfileMutation.mutate(formData);
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      const updatedInterests = [...interests, newInterest.trim()];
      setInterests(updatedInterests);
      setValue("interests", updatedInterests);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    const updatedInterests = interests.filter(i => i !== interest);
    setInterests(updatedInterests);
    setValue("interests", updatedInterests);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && photos.length < 6) {
            setPhotos(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/phone-auth")}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-white">Criar Perfil</h1>
        <div className="w-10"></div>
      </div>

      {/* Logo MIX */}
      <div className="text-center mb-8 px-6">
        <img src={mixLogo} alt="MIX" className="h-16 w-auto mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold mb-2">Configure seu perfil</h2>
        <p className="text-white/70">Para encontrar conexões especiais</p>
      </div>

      {/* Form Card */}
      <div className="flex-1 px-6 pb-6">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto">
          
          {/* Profile Icon */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome e Idade */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  {...register("name")}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-gray-700 font-medium">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Sua idade"
                  {...register("age", { valueAsNumber: true })}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age.message}</p>
                )}
              </div>
            </div>

            {/* Biografia */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-700 font-medium">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                {...register("bio")}
                className="h-24 border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Profissão e Localização */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-gray-700 font-medium">Profissão</Label>
                <Input
                  id="profession"
                  type="text"
                  placeholder="Sua profissão"
                  {...register("profession")}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">Localização</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Sua cidade"
                  {...register("location")}
                  className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Fotos */}
            <div className="space-y-4">
              <Label className="text-gray-700 font-medium">Fotos (até 6)</Label>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="relative">
                    {photos[index] ? (
                      <div className="relative">
                        <img
                          src={photos[index]}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-300"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor={`photo-upload-${index}`}
                        className="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <input
                          id={`photo-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interesses */}
            <div className="space-y-4">
              <Label className="text-gray-700 font-medium">Interesses</Label>
              
              {/* Interesses pré-definidos para seleção */}
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Selecione seus interesses:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Música', 'Cinema', 'Esportes', 'Viagens',
                    'Gastronomia', 'Arte', 'Livros', 'Dança',
                    'Academia', 'Natureza', 'Tecnologia', 'Pets',
                    'Fotografia', 'Culinária', 'Moda', 'Games'
                  ].map((predefinedInterest) => (
                    <Button
                      key={predefinedInterest}
                      type="button"
                      variant={interests.includes(predefinedInterest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (interests.includes(predefinedInterest)) {
                          removeInterest(predefinedInterest);
                        } else {
                          const updatedInterests = [...interests, predefinedInterest];
                          setInterests(updatedInterests);
                          setValue("interests", updatedInterests);
                        }
                      }}
                      className={`text-xs ${
                        interests.includes(predefinedInterest)
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {predefinedInterest}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Campo para adicionar interesses customizados */}
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Adicionar interesse personalizado"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  className="flex-1 h-10 border-gray-300 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <Button
                  type="button"
                  onClick={addInterest}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  +
                </Button>
              </div>

              {/* Interesses selecionados */}
              {interests.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Seus interesses selecionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botão Criar Perfil */}
            <Button
              type="submit"
              disabled={createProfileMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold text-lg rounded-lg shadow-lg"
            >
              {createProfileMutation.isPending ? "Criando perfil..." : "CRIAR PERFIL"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
      // Add demo photos if none uploaded
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
        body: JSON.stringify(profileData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Profile creation failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Perfil criado com sucesso!",
        description: "Bem-vindo ao MIX",
      });
      setLocation("/discover");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar perfil",
        description: error.message || "Erro interno do servidor",
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
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative w-full max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/register")}
          className="absolute -top-16 left-0 text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="bg-white/95 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-3 rounded-full">
                <Heart className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Criar Perfil
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Configure seu perfil para encontrar conexões especiais
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    {...register("name")}
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age" className="text-gray-700">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Sua idade"
                    {...register("age", { valueAsNumber: true })}
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-xs">{errors.age.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-gray-700">Biografia</Label>
                <Textarea
                  id="bio"
                  placeholder="Conte um pouco sobre você..."
                  {...register("bio")}
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-gray-700">Profissão</Label>
                  <Input
                    id="profession"
                    type="text"
                    placeholder="Sua profissão"
                    {...register("profession")}
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700">Localização</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Sua cidade"
                    {...register("location")}
                    className="h-12 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <Label className="text-gray-700">Fotos (até 6)</Label>
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
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
                  ))}
                  {photos.length < 6 && (
                    <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <Upload className="h-8 w-8 text-gray-400" />
                    </label>
                  )}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <Label className="text-gray-700">Interesses</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Adicionar interesse"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    className="flex-1 h-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="hover:text-pink-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={createProfileMutation.isPending}
              >
                {createProfileMutation.isPending ? "Criando perfil..." : "Criar Perfil"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
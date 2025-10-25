import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UploadPhotos() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        if (photos.length >= 6) {
          toast({
            title: "Limite atingido",
            description: "Você pode adicionar no máximo 6 fotos",
            variant: "destructive",
          });
          break;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Formato inválido",
            description: "Apenas arquivos de imagem são permitidos",
            variant: "destructive",
          });
          continue;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Arquivo muito grande",
            description: "O arquivo deve ter no máximo 5MB",
            variant: "destructive",
          });
          continue;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPhotos(prev => [...prev, previewUrl]);

        // In a real implementation, you would upload to a cloud service like AWS S3, Cloudinary, etc.
        // For now, we'll simulate the upload process
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      toast({
        title: "Fotos carregadas!",
        description: "Suas fotos foram adicionadas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar as fotos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const newPhotos = [...prev];
      URL.revokeObjectURL(newPhotos[index]); // Clean up memory
      newPhotos.splice(index, 1);
      return newPhotos;
    });
  };

  const handleContinue = () => {
    if (photos.length === 0) {
      toast({
        title: "Adicione pelo menos uma foto",
        description: "Você precisa adicionar pelo menos uma foto para continuar",
        variant: "destructive",
      });
      return;
    }
    
    // Save photos to profile and continue
    setLocation("/discover");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white/10 border-white/20 text-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Adicionar Fotos
            </CardTitle>
            <CardDescription className="text-white/70 text-center">
              Adicione até 6 fotos ao seu perfil para aumentar suas chances de match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-3">
              {/* Existing Photos */}
              {photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Add Photo Slots */}
              {Array.from({ length: 6 - photos.length }).map((_, index) => (
                <button
                  key={`empty-${index}`}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center text-white/50 hover:border-white/50 hover:text-white/70 transition-colors"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-xs">Adicionar</span>
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Upload Button */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || photos.length >= 6}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Carregando..." : "Escolher Fotos"}
            </Button>

            {/* Tips */}
            <div className="text-sm text-white/60 space-y-2">
              <p>📸 Dicas para boas fotos:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use fotos claras e bem iluminadas</li>
                <li>Sorria! Fotos com sorriso recebem mais likes</li>
                <li>Inclua fotos de corpo inteiro e do rosto</li>
                <li>Mostre seus hobbies e interesses</li>
                <li>Evite filtros excessivos</li>
              </ul>
            </div>

            {/* Continue Button */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setLocation("/create-profile")}
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                Voltar
              </Button>
              <Button
                onClick={handleContinue}
                disabled={photos.length === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Continuar
              </Button>
            </div>

            {/* Photo Count */}
            <div className="text-center text-white/60">
              {photos.length}/6 fotos adicionadas
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
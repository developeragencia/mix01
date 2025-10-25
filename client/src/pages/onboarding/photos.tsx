import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";

export default function OnboardingPhotos() {
  const [, setLocation] = useLocation();
  const [photos, setPhotos] = useState<string[]>([]);

  const handleContinue = () => {
    if (photos.length >= 2) {
      localStorage.setItem("onboarding_photos", JSON.stringify(photos));
      setLocation("/onboarding/success");
    }
  };

  const handlePhotoUpload = (index: number) => {
    // Simular upload de foto
    const mockPhoto = `https://images.unsplash.com/photo-${1500000000000 + index}?w=400&h=600&fit=crop&face`;
    setPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[index] = mockPhoto;
      return newPhotos;
    });
  };

  const photoSlots = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-700">
        <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600" style={{ width: "95%" }}></div>
      </div>

      {/* Header */}
      <div className="p-4">
        <button onClick={() => setLocation("/onboarding/interests")} data-testid="button-back">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-6">
        <div>
          <h1 className="text-white text-3xl font-bold mb-2">
            Adicione suas fotos recentes
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Carregue 2 fotos pra começar. Adicione 4 ou mais fotos para destacar seu perfil.
          </p>
          
          <div className="grid grid-cols-3 gap-3">
            {photoSlots.map((index) => (
              <button
                key={index}
                onClick={() => handlePhotoUpload(index)}
                className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center bg-gray-800/30 overflow-hidden"
                data-testid={`button-upload-${index}`}
              >
                {photos[index] ? (
                  <img src={photos[index]} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <Plus className="w-10 h-10 text-pink-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={photos.length < 2}
          className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:text-gray-600 text-white font-bold py-6 rounded-full text-lg"
          data-testid="button-continue"
        >
          Seguinte
        </Button>
      </div>
    </div>
  );
}

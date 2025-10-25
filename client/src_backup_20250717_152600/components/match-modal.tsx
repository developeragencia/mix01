import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import type { Profile } from "@shared/schema";

interface MatchModalProps {
  profile: Profile;
  onClose: () => void;
  onSendMessage: () => void;
}

export default function MatchModal({ profile, onClose, onSendMessage }: MatchModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">É um Match!</h2>
            <p className="text-gray-600">Vocês se curtiram mutuamente</p>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Current user profile photo placeholder */}
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center">
              <span className="text-white text-xl font-bold">U</span>
            </div>
            <Heart className="w-8 h-8 text-[var(--mix-pink)] fill-current" />
            {/* Match profile photo */}
            {profile.photos[0] ? (
              <img 
                src={profile.photos[0]} 
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {profile.name[0]}
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={onSendMessage}
              className="w-full gradient-bg text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Enviar Mensagem
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Continuar Descobrindo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

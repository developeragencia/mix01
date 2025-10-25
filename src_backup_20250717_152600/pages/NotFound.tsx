import { Link } from "wouter";
import { Home, ArrowLeft, Heart } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 flex items-center justify-center p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mix-card p-8">
          {/* 404 Icon */}
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl font-bold">404</span>
          </div>

          {/* Error Message */}
          <h1 className="text-white text-3xl font-bold mb-4">
            Oops! Página não encontrada
          </h1>
          
          <p className="text-white opacity-90 text-lg mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/">
              <button className="mix-button w-full py-3 text-lg font-semibold flex items-center justify-center space-x-2">
                <Home className="w-5 h-5" />
                <span>Voltar ao início</span>
              </button>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="mix-button-secondary w-full py-3 text-lg font-semibold flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Página anterior</span>
            </button>
          </div>

          {/* Fun Message */}
          <div className="mt-8 pt-6 border-t border-white border-opacity-20">
            <div className="flex items-center justify-center space-x-2 text-white opacity-80">
              <Heart className="w-5 h-5 text-pink-300" />
              <span className="text-sm">
                Que tal encontrar seu match perfeito?
              </span>
            </div>
            <Link href="/discover">
              <button className="text-white underline text-sm mt-2 hover:text-purple-300 transition-colors">
                Descobrir pessoas
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
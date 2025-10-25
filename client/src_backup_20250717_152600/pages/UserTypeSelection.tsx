import { Link } from "wouter";
import { ArrowLeft, Heart, Users, User, Crown } from "lucide-react";

export function UserTypeSelection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <Link href="/terms">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-white text-xl font-semibold">Tipo de perfil</h1>
          <div className="w-6"></div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <div className="mix-logo text-white mb-4">MIX</div>
          <h2 className="text-white text-2xl font-bold mb-2">
            Que tipo de relacionamento você busca?
          </h2>
          <p className="text-white opacity-90 text-lg">
            Isso nos ajuda a encontrar pessoas compatíveis com você
          </p>
        </div>

        {/* User Type Options */}
        <div className="space-y-4 mb-8">
          <Link href="/cadastre-se-new">
            <div className="mix-card p-6 hover:bg-white hover:bg-opacity-20 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">Relacionamento sério</h3>
                  <p className="text-white opacity-80 text-sm">
                    Procuro algo duradouro e significativo
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/cadastre-se-new">
            <div className="mix-card p-6 hover:bg-white hover:bg-opacity-20 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">Conhecer pessoas</h3>
                  <p className="text-white opacity-80 text-sm">
                    Fazer amizades e ver no que dá
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/cadastre-se-new">
            <div className="mix-card p-6 hover:bg-white hover:bg-opacity-20 transition-all cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">Casual</h3>
                  <p className="text-white opacity-80 text-sm">
                    Algo descontraído e sem compromisso
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/cadastre-se-new">
            <div className="mix-card p-6 hover:bg-white hover:bg-opacity-20 transition-all cursor-pointer border-2 border-yellow-400 border-opacity-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">Não tenho certeza</h3>
                  <p className="text-white opacity-80 text-sm">
                    Vou descobrindo com o tempo
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white opacity-70 text-sm">
            Você pode alterar isso depois nas configurações
          </p>
        </div>
      </div>
    </div>
  );
}
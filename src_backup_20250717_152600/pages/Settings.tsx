import { Link } from "wouter";
import { ArrowLeft, Bell, Shield, User, Heart, Eye, EyeOff, MapPin, Crown, Trash2 } from "lucide-react";

export function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 pb-20">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-sm border-b border-white border-opacity-20 p-4">
        <div className="flex items-center space-x-3">
          <Link href="/profile">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-white font-bold text-xl">Configurações</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="p-4 space-y-6">
        {/* Account Settings */}
        <div className="mix-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Conta</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Editar perfil</span>
              <Link href="/edit-profile">
                <button className="text-purple-300 text-sm">Editar</button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Alterar senha</span>
              <Link href="/change-password">
                <button className="text-purple-300 text-sm">Alterar</button>
              </Link>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Plano premium</span>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-purple-300 text-sm">PREMIUM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mix-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacidade</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Modo invisível</span>
              <div className="flex items-center space-x-2">
                <EyeOff className="w-4 h-4 text-white opacity-70" />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-white bg-opacity-20 peer-focus:ring-2 peer-focus:ring-white peer-focus:ring-opacity-50 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Mostrar distância</span>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-white opacity-70" />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-white bg-opacity-20 peer-focus:ring-2 peer-focus:ring-white peer-focus:ring-opacity-50 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Perfil verificado</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-green-400 text-sm">Verificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mix-card p-6">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notificações</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Novos matches</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white bg-opacity-20 peer-focus:ring-2 peer-focus:ring-white peer-focus:ring-opacity-50 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Mensagens</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white bg-opacity-20 peer-focus:ring-2 peer-focus:ring-white peer-focus:ring-opacity-50 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-white">Likes recebidos</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white bg-opacity-20 peer-focus:ring-2 peer-focus:ring-white peer-focus:ring-opacity-50 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mix-card p-6 border-2 border-red-500 border-opacity-50">
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
            <Trash2 className="w-5 h-5 text-red-400" />
            <span>Zona de perigo</span>
          </h2>
          
          <div className="space-y-4">
            <button className="w-full py-3 bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg transition-all">
              Pausar conta
            </button>
            
            <button className="w-full py-3 bg-red-600 bg-opacity-80 hover:bg-opacity-100 text-white font-semibold rounded-lg transition-all">
              Deletar conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
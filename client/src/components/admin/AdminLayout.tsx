import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminBottomNavigation from "./AdminBottomNavigation";
import GlobalSearch from "./GlobalSearch";

// PWA Admin Panel Integration - DISABLED to prevent cache issues
const installAdminPWA = () => {
  // Service Worker disabled
  // Update theme color for admin
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor && window.location.pathname.includes('/admin')) {
    themeColor.setAttribute('content', '#1e40af');
  }
};
import { 
  Users, 
  Heart, 
  MessageSquare, 
  DollarSign, 
  Shield, 
  Settings, 
  BarChart3, 
  Flag, 
  UserCheck, 
  CreditCard,
  Bell,
  Home,
  Menu,
  X,
  LogOut,
  Activity
} from "lucide-react";
import mixLogoHorizontal from "@assets/Logo_MIX_horizontal_1750591494976.png";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const menuItems = [
  { icon: Home, label: "Painel Principal", path: "/admin/dashboard" },
  { icon: Users, label: "Usuários", path: "/admin/users" },
  { icon: Heart, label: "Matches", path: "/admin/matches" },
  { icon: MessageSquare, label: "Mensagens", path: "/admin/messages" },
  { icon: CreditCard, label: "Assinaturas", path: "/admin/subscriptions" },
  { icon: DollarSign, label: "Pagamentos", path: "/admin/payments" },
  { icon: Flag, label: "Denúncias", path: "/admin/reports" },
  { icon: UserCheck, label: "Verificações", path: "/admin/verifications" },
  { icon: Bell, label: "Notificações", path: "/admin/notifications" },
  { icon: BarChart3, label: "Métricas", path: "/admin/analytics" },
  { icon: Settings, label: "Configurações", path: "/admin/settings" }
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Initialize Admin PWA
    installAdminPWA();
    
    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      console.log('🔧 MIX Admin PWA install result:', result);
      setInstallPrompt(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin");
  };

  const isActivePage = (path: string) => {
    return location === path;
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-blue-800/90 backdrop-blur-sm border-b border-blue-700/50 p-3 flex items-center justify-between w-full">
        <img src={mixLogoHorizontal} alt="Mix Logo" className="h-8 w-auto" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-500"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      <div className="flex w-full">
        {/* Sidebar */}
        <aside className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          w-64 bg-blue-800/95 backdrop-blur-sm border-r border-blue-700/50
          transition-transform duration-300 ease-in-out
          ${isMobile ? 'pt-16' : ''}
        `}>
          {/* Desktop Logo */}
          {!isMobile && (
            <div className="p-6 border-b border-blue-700/50">
              <img src={mixLogoHorizontal} alt="Mix Logo" className="h-12 w-auto mx-auto" />
              <div className="mt-3 text-center">
                <Badge variant="secondary" className="bg-blue-700/50 text-blue-100 border-blue-600">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Panel
                </Badge>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActivePage(item.path);
              
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`
                    w-full justify-start text-left h-11
                    ${active 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border border-pink-400/50' 
                      : 'text-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-500 hover:text-white'
                    }
                    transition-all duration-200
                  `}
                  onClick={() => {
                    setLocation(item.path);
                    if (isMobile) setSidebarOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-blue-300 rounded-full" />
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400/50 text-white hover:from-pink-600 hover:to-purple-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen w-full max-w-full overflow-x-hidden">
          {/* Header */}
          <header className="bg-blue-800/90 backdrop-blur-sm border-b border-blue-700/50 p-3 md:p-4 w-full">
            <div className="flex items-center justify-between w-full gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="text-sm md:text-lg font-bold text-white truncate">{title}</h1>
                <p className="text-blue-200 mt-1 text-xs md:text-sm truncate">Painel de Administração MIX</p>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <GlobalSearch />
                <Badge variant="secondary" className="hidden md:flex bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
            </div>
          </header>

          {/* Content - PWA Nativo Responsivo */}
          <div className="p-2 pb-16 md:p-4 md:pb-6 w-full max-w-full overflow-x-hidden">
            <div className="w-full max-w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      {/* Admin Bottom Navigation - Mobile Only */}
      <AdminBottomNavigation />
    </div>
  );
}
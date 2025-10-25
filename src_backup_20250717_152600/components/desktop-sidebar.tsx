import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Flame, MessageCircle, Star, User, Crown, MapPin } from "lucide-react";

interface DesktopSidebarProps {
  currentSection: string;
}

export default function DesktopSidebar({ currentSection }: DesktopSidebarProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    { id: "discover", icon: Heart, label: "Descobrir", path: "/discover" },
    { id: "matches", icon: Flame, label: "Matches", path: "/matches" },
    { id: "messages", icon: MessageCircle, label: "Mensagens", path: "/messages" },
    { id: "likes", icon: Star, label: "Curtidas", path: "/matches" },
    { id: "profile", icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-40">
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <img 
              src="/mix-logo.png" 
              alt="MIX Logo"
              className="h-12 object-contain"
            />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setLocation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 rounded-lg transition-colors justify-start ${
                    isActive 
                      ? "text-[var(--mix-blue)] bg-blue-50" 
                      : "text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>
        
        {/* Upgrade Banner */}
        <div className="p-4 border-t">
          <Card className="gradient-bg text-white">
            <CardContent className="p-4 text-center">
              <Crown className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Premium</h3>
              <p className="text-sm opacity-90 mb-3">Recursos exclusivos</p>
              <Button 
                className="bg-white text-[var(--mix-blue)] hover:bg-gray-100 w-full"
                onClick={() => alert('Premium upgrade feature!')}
              >
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

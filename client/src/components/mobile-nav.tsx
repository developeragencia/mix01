import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Flame, MessageCircle, Star, User } from "lucide-react";
import { NeonHeart } from "@/components/NeonHeart";

interface MobileNavProps {
  currentSection: string;
}

export default function MobileNav({ currentSection }: MobileNavProps) {
  const [, setLocation] = useLocation();

  const navItems = [
    { id: "discover", icon: "neon-heart", label: "Descobrir", path: "/discover" },
    { id: "matches", icon: Flame, label: "Matches", path: "/matches" },
    { id: "messages", icon: MessageCircle, label: "Mensagens", path: "/messages", badge: 3 },
    { id: "likes", icon: Star, label: "Curtidas", path: "/matches" },
    { id: "profile", icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-2 relative ${
                isActive 
                  ? "text-[var(--mix-blue)]" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.icon === "neon-heart" ? (
                <NeonHeart className="w-6 h-6 mb-1" />
              ) : (
                (() => {
                  const Icon = item.icon as any;
                  return <Icon className="w-5 h-5 mb-1" />;
                })()
              )}
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 bg-[var(--mix-pink)] text-white text-xs flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}

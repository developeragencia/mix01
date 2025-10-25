import { Flame, Heart, MessageCircle, User } from "lucide-react";
import { useLocation } from "wouter";
import { NeonHeart } from "@/components/NeonHeart";
import { memo } from "react";

// ⚡ MEMOIZADO: Evita re-renders desnecessários
const BottomNavigation = memo(function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Flame, label: "Descobrir", path: "/location" },
    { icon: "neon-heart", label: "Curtidas", path: "/discover" },
    { icon: MessageCircle, label: "Mensagens", path: "/messages" },
    { icon: User, label: "Perfil", path: "/profile" }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900 px-6 py-4 z-[100]">
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const isActive = location === item.path;
          
          return (
            <button
              key={index}
              onClick={() => setLocation(item.path)}
              className="flex flex-col items-center transition-colors duration-200"
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              {item.icon === "neon-heart" ? (
                <NeonHeart 
                  className={`w-7 h-7 mb-2 ${
                    isActive 
                      ? "opacity-100" 
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ) : (
                (() => {
                  const Icon = item.icon as any;
                  return (
                    <Icon 
                      className={`w-6 h-6 mb-2 ${
                        isActive 
                          ? "text-white" 
                          : "text-blue-300 hover:text-white"
                      }`}
                    />
                  );
                })()
              )}
              <span className={`text-xs font-medium ${
                isActive 
                  ? "text-white" 
                  : "text-blue-300"
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default BottomNavigation;
import { useLocation } from "wouter";
import { 
  Home, 
  Users, 
  Heart, 
  MessageSquare, 
  BarChart3 
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Painel", path: "/admin/dashboard" },
  { icon: Users, label: "Usuários", path: "/admin/users" },
  { icon: Heart, label: "Matches", path: "/admin/matches" },
  { icon: MessageSquare, label: "Mensagens", path: "/admin/messages" },
  { icon: BarChart3, label: "Métricas", path: "/admin/analytics" }
];

export default function AdminBottomNavigation() {
  const [location, setLocation] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-blue-800/95 backdrop-blur-sm border-t border-blue-700/50 z-50 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`
                flex flex-col items-center justify-center p-2 min-w-0 flex-1
                ${active 
                  ? 'text-pink-400' 
                  : 'text-white/70 hover:text-white'
                }
                transition-colors duration-200
              `}
            >
              <Icon className={`w-5 h-5 mb-1 ${active ? 'text-pink-400' : ''}`} />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
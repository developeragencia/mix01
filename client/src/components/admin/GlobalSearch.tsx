import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  X, 
  Users, 
  Heart, 
  Flag, 
  Shield,
  Loader2
} from "lucide-react";

interface SearchResult {
  type: 'user' | 'match' | 'report' | 'verification';
  id: number;
  title: string;
  description: string;
  badge?: string;
  url: string;
}

export default function GlobalSearch() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const { data: results, isLoading } = useQuery<SearchResult[]>({
    queryKey: ['/api/admin/search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      const adminToken = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!res.ok) return [];
      return res.json();
    },
    enabled: searchTerm.length >= 2,
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'match':
        return <Heart className="w-4 h-4 text-pink-400" />;
      case 'report':
        return <Flag className="w-4 h-4 text-red-400" />;
      case 'verification':
        return <Shield className="w-4 h-4 text-yellow-400" />;
      default:
        return <Search className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'user':
        return 'Usuário';
      case 'match':
        return 'Match';
      case 'report':
        return 'Denúncia';
      case 'verification':
        return 'Verificação';
      default:
        return type;
    }
  };

  const handleResultClick = (url: string) => {
    setLocation(url);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-blue-800/50 border border-blue-700/50 rounded-lg text-blue-300 hover:bg-blue-700/50 transition-all"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Buscar...</span>
        <kbd className="hidden md:inline px-2 py-0.5 text-xs bg-blue-900/50 border border-blue-700/50 rounded">
          Ctrl+K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          
          {/* Search Panel */}
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50 px-4">
            <Card className="bg-blue-900/95 backdrop-blur-xl border-blue-700/50 shadow-2xl">
              {/* Search Input */}
              <div className="p-4 border-b border-blue-700/50">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar usuários, matches, denúncias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 bg-blue-800/50 border-blue-700/50 text-white placeholder:text-blue-400 h-12 text-lg"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                    <p className="text-blue-300 text-sm">Buscando...</p>
                  </div>
                ) : searchTerm.length < 2 ? (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
                    <p className="text-blue-300 text-sm">Digite pelo menos 2 caracteres para buscar</p>
                    <p className="text-blue-400 text-xs mt-2">Use Ctrl+K para abrir a busca rapidamente</p>
                  </div>
                ) : results && results.length > 0 ? (
                  <div className="p-2">
                    {results.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result.url)}
                        className="w-full p-3 flex items-start gap-3 hover:bg-blue-800/50 rounded-lg transition-colors text-left group"
                      >
                        <div className="mt-1">{getIcon(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-700/50 text-blue-200 text-xs">
                              {getTypeLabel(result.type)}
                            </Badge>
                            {result.badge && (
                              <Badge className="bg-purple-700/50 text-purple-200 text-xs">
                                {result.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-white font-medium group-hover:text-pink-300 transition-colors truncate">
                            {result.title}
                          </p>
                          <p className="text-blue-300 text-sm truncate">
                            {result.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
                    <p className="text-blue-300 text-sm">Nenhum resultado encontrado</p>
                    <p className="text-blue-400 text-xs mt-2">Tente buscar com outros termos</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-blue-700/50 flex items-center justify-between text-xs text-blue-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-0.5 bg-blue-800/50 border border-blue-700/50 rounded">↑</kbd>
                    <kbd className="px-2 py-0.5 bg-blue-800/50 border border-blue-700/50 rounded">↓</kbd>
                    para navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-0.5 bg-blue-800/50 border border-blue-700/50 rounded">Enter</kbd>
                    para selecionar
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <kbd className="px-2 py-0.5 bg-blue-800/50 border border-blue-700/50 rounded">Esc</kbd>
                  para fechar
                </span>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}


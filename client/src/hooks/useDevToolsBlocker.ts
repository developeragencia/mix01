import { useEffect } from 'react';

export function useDevToolsBlocker() {
  useEffect(() => {
    // Bloqueio simples de F12 e botão direito
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Adicionar listeners apenas em produção
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown, false);
      document.addEventListener('contextmenu', handleContextMenu, false);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('contextmenu', handleContextMenu);
      }
    };
  }, []);
}


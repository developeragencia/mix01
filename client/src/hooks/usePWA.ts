import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebAppiOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS Safari and other browsers
      if (isIOSSafari()) {
        showIOSInstallInstructions();
        return;
      }
      
      // Show generic instructions for unsupported browsers
      showGenericInstallInstructions();
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const isIOSSafari = () => {
    const userAgent = window.navigator.userAgent;
    return /iPad|iPhone|iPod/.test(userAgent) && /Safari/.test(userAgent) && !(window.navigator as any).standalone;
  };

  const showIOSInstallInstructions = () => {
    const instructions = `
Para instalar o MIX no seu iPhone/iPad:

1. Toque no ícone de compartilhar (📤) na parte inferior da tela
2. Role para baixo e toque em "Adicionar à Tela de Início"
3. Toque em "Adicionar" no canto superior direito
4. O MIX será adicionado à sua tela inicial!
    `;
    
    alert(instructions);
  };

  const showGenericInstallInstructions = () => {
    const instructions = `
Para instalar o MIX:

1. No Chrome/Edge: Clique no ícone de instalação na barra de endereços
2. No Firefox: Acesse o menu (⋮) > "Instalar este site como aplicativo"
3. No Safari: Use "Adicionar à Tela de Início"

O MIX funcionará como um aplicativo nativo!
    `;
    
    alert(instructions);
  };

  return {
    isInstallable,
    isInstalled,
    installApp,
    isIOSSafari: isIOSSafari()
  };
}
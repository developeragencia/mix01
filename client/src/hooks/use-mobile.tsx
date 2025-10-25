import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkMobile = () => {
      // Verifica user agent para dispositivos móveis reais
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Verifica se é um dispositivo móvel real OU se é um PWA instalado
      const isSmallScreen = window.innerWidth < 768;
      const isPWA = window.matchMedia('(display-mode: standalone)').matches;
      
      // Só considera móvel se for dispositivo móvel real E (tela pequena OU PWA)
      setIsMobile(isMobileDevice && (isSmallScreen || isPWA));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [])

  return isMobile
}

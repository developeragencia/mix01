import mixLogo from "@assets/Logo_MIX_horizontal_1752607947932.png";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message = "Carregando...", fullScreen = true }: LoadingSpinnerProps) {
  const containerClasses = fullScreen 
    ? "min-h-screen bg-black flex items-center justify-center"
    : "flex items-center justify-center py-20";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Spinner com logo dentro */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          {/* Círculo que roda */}
          <div className="absolute inset-0 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          {/* Logo centralizada */}
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <img 
              src={mixLogo} 
              alt="MIX" 
              className="w-full h-full object-contain"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
        {/* Mensagem */}
        <p className="text-white text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}


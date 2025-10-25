import { CheckCircle2 } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function VerifiedBadge({ size = "md", className = "" }: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} title="Perfil Verificado">
      <CheckCircle2 
        className={`${sizeClasses[size]} text-blue-500 fill-blue-500`}
        strokeWidth={2}
      />
    </div>
  );
}

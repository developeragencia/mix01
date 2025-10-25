interface NeonXProps {
  className?: string;
  style?: React.CSSProperties;
}

export const NeonX = ({ className = "", style = {} }: NeonXProps) => {
  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className={className}
        style={style}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
      <defs>
        {/* Enhanced glow effect filters */}
        <filter id="neonGlowRedX" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="outerGlowRedX" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Strong outer glow */}
      <g filter="url(#outerGlowRedX)" opacity="0.8">
        <path d="M18 6L6 18" stroke="#EF4444" strokeWidth="1" strokeLinecap="round"/>
        <path d="M6 6L18 18" stroke="#EF4444" strokeWidth="1" strokeLinecap="round"/>
      </g>
      
      {/* Main neon outline with stronger glow */}
      <g filter="url(#neonGlowRedX)">
        <path d="M18 6L6 18" stroke="#FF5555" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M6 6L18 18" stroke="#FF5555" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      
      {/* Bright inner core */}
      <g opacity="1">
        <path d="M18 6L6 18" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M6 6L18 18" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round"/>
      </g>
      </svg>
    </div>
  );
};
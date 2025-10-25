interface NeonHeartProps {
  className?: string;
  style?: React.CSSProperties;
}

export const NeonHeart = ({ className = "", style = {} }: NeonHeartProps) => {
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
        {/* Glow effect filters */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Strong outer glow */}
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="none"
        stroke="#FF1493"
        strokeWidth="1"
        filter="url(#outerGlow)"
        opacity="0.8"
      />
      
      {/* Main neon outline - enhanced */}
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="none"
        stroke="#FF69B4"
        strokeWidth="2.5"
        filter="url(#neonGlow)"
      />
      
      {/* Bright inner core */}
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        opacity="1"
      />
      </svg>
    </div>
  );
};
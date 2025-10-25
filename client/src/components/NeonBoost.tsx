export function NeonBoost({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <defs>
        <filter id="neonBoost">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="boostGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#9333ea', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#c084fc', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <polygon
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        fill="url(#boostGradient)"
        stroke="url(#boostGradient)"
        filter="url(#neonBoost)"
      />
    </svg>
  );
}

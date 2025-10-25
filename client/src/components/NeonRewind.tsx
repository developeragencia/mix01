export function NeonRewind({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
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
        <filter id="neonRewind">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="rewindGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#facc15', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#fbbf24', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <path
        d="M3 9V5L7 9L3 13V9Z M9 5C9 5 17 5 17 13C17 13 17 21 9 21"
        fill="url(#rewindGradient)"
        stroke="url(#rewindGradient)"
        filter="url(#neonRewind)"
      />
    </svg>
  );
}

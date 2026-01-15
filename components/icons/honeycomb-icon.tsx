interface HoneycombIconProps {
    className?: string
    size?: number
    filled?: boolean
  }
  
  export function HoneycombIcon({ className = "", size = 24, filled = false }: HoneycombIconProps) {
    return (
      <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none">
        <defs>
          <linearGradient id="honeycombGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--lime)" />
          </linearGradient>
        </defs>
        <polygon
          points="12,2 20,6.5 20,15.5 12,20 4,15.5 4,6.5"
          fill={filled ? "url(#honeycombGrad)" : "none"}
          fillOpacity={filled ? 0.3 : 0}
          stroke="url(#honeycombGrad)"
          strokeWidth="1.5"
        />
        <polygon
          points="12,6 16,8.5 16,13.5 12,16 8,13.5 8,8.5"
          fill={filled ? "url(#honeycombGrad)" : "none"}
          fillOpacity={filled ? 0.5 : 0}
          stroke="url(#honeycombGrad)"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
    )
  }
  
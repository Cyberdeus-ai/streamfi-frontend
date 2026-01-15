interface PollenIconProps {
    className?: string
    size?: number
  }
  
  export function PollenIcon({ className = "", size = 24 }: PollenIconProps) {
    return (
      <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none">
        <defs>
          <radialGradient id="pollenGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--lime)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </radialGradient>
        </defs>
        <circle cx="12" cy="12" r="4" fill="url(#pollenGrad)" />
        <circle cx="6" cy="8" r="2" fill="var(--lime)" opacity="0.6" />
        <circle cx="18" cy="8" r="1.5" fill="var(--gold)" opacity="0.5" />
        <circle cx="8" cy="17" r="1.5" fill="var(--cyan)" opacity="0.4" />
        <circle cx="17" cy="16" r="2" fill="var(--lime)" opacity="0.5" />
        <circle cx="4" cy="13" r="1" fill="var(--gold)" opacity="0.3" />
        <circle cx="20" cy="12" r="1" fill="var(--lime)" opacity="0.4" />
      </svg>
    )
  }
  
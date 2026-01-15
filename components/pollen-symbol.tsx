"use client"

interface PollenSymbolProps {
  className?: string
  size?: number
  animated?: boolean
}

export function PollenSymbol({ className = "", size = 24, animated = true }: PollenSymbolProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`${className} ${animated ? "transition-transform duration-300 hover:scale-110" : ""}`}
      width={size}
      height={size}
      fill="none"
    >
      <defs>
        <linearGradient id="pollenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.75 0.18 140)" />
          <stop offset="100%" stopColor="oklch(0.8 0.14 90)" />
        </linearGradient>
      </defs>

      <path d="M16 2L22 6V12L16 16L10 12V6L16 2Z" fill="url(#pollenGrad)" opacity="0.9" />
      <path d="M10 12L16 16V22L10 26L4 22V16L10 12Z" fill="url(#pollenGrad)" opacity="0.7" />
      <path d="M22 12L28 16V22L22 26L16 22V16L22 12Z" fill="url(#pollenGrad)" opacity="0.5" />
      <circle cx="16" cy="10" r="2.5" fill="oklch(0.85 0.12 90)" className={animated ? "animate-pulse" : ""} />
    </svg>
  )
}

export function PollenSymbolInline({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 32" className={className} width={size} height={size} fill="none">
      <path d="M16 2L22 6V12L16 16L10 12V6L16 2Z" fill="oklch(0.78 0.16 115)" />
      <path d="M10 12L16 16V22L10 26L4 22V16L10 12Z" fill="oklch(0.75 0.18 140)" opacity="0.8" />
      <path d="M22 12L28 16V22L22 26L16 22V16L22 12Z" fill="oklch(0.8 0.14 90)" opacity="0.6" />
      <circle cx="16" cy="10" r="2.5" fill="oklch(0.85 0.12 90)" />
    </svg>
  )
}

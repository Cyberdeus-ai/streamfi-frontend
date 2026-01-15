"use client"

import { useState } from "react"
import { PollenSymbol } from "./pollen-symbol"

export function Logo({ className = "" }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`flex items-center gap-2.5 ${className} cursor-pointer group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`transition-transform duration-300 ${isHovered ? "scale-110 rotate-6" : ""}`}>
        <PollenSymbol size={36} animated={isHovered} />
      </div>

      <span
        className={`text-xl font-bold tracking-tight transition-all duration-300 ${isHovered ? "translate-x-0.5" : ""}`}
      >
        <span className="text-foreground">Pollen</span>
        <span className="gradient-text">Fi</span>
      </span>
    </div>
  )
}

"use client"

import { memo } from "react"

export const AntiSybilWarning = memo(function AntiSybilWarning() {
  return (
    <div className="p-4 rounded-xl bg-magenta/10 border border-magenta/20 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-magenta/20 flex items-center justify-center shrink-0">
        <span className="text-magenta text-lg">⚠️</span>
      </div>
      <div>
        <p className="font-medium text-magenta">Anti-Sybil Defense Active</p>
        <p className="text-sm text-muted-foreground">
          Our system accurately detects fake engagement. Anyone trying to game the system will be permanently
          banned.
        </p>
      </div>
    </div>
  )
})


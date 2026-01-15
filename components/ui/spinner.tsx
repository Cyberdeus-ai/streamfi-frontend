"use client"

import * as React from "react"
import { useEffect } from "react"
import { createPortal } from "react-dom"

export interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
}

export function LoadingOverlay({ isLoading, message }: LoadingOverlayProps) {
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden"
      document.body.style.pointerEvents = "none"
    } else {
      document.body.style.overflow = ""
      document.body.style.pointerEvents = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.pointerEvents = ""
    }
  }, [isLoading])

  if (!mounted || !isLoading) return null

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-sm animate-fadeIn"
      style={{ background: 'rgba(0, 0, 0, 0.6)' }}
      role="status"
      aria-label="Loading"
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-muted/30 rounded-full"></div>
          <div
            className="absolute inset-0 border-4 border-transparent border-t-lime border-r-lime rounded-full spinner-rotate"
            style={{ animationDuration: '0.8s' }}
          ></div>
          <div
            className="absolute inset-2 border-4 border-transparent border-b-lime/60 border-l-lime/60 rounded-full spinner-rotate"
            style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}
          ></div>
        </div>
        {message && (
          <p className="text-foreground font-medium text-base">{message}</p>
        )}
      </div>
    </div>,
    document.body
  )
}


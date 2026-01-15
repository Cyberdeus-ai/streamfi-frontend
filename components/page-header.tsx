"use client"

import { ReactNode } from "react"
import { cn } from "./ui/utils"

interface PageHeaderProps {
  title: string | ReactNode
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl", className)}>
      <div className="px-4 sm:px-20 py-4 pl-16 lg:pl-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </header>
  )
}


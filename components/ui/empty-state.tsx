"use client"

import { ReactNode } from "react"
import { Button } from "@/components/ui/button"

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="bg-lime hover:bg-lime/90 text-background font-semibold">
          {action.label}
        </Button>
      )}
    </div>
  )
}


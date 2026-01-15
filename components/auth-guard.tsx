"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingOverlay } from "@/components/ui/spinner"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <LoadingOverlay isLoading={true} message="Verifying authentication..." />
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}


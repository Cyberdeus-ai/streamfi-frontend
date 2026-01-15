"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { setAuthToken } from "@/utils/setAuthToken"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  loadingState: (state: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const loadingState = useCallback((state: boolean) => {
    setLoading(state)
  }, [])

  const login = useCallback((userData: User, token: string) => {
    setUser(userData)
    setAuthToken(token)
    localStorage.setItem("pollenfi_user", JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setAuthToken()
    localStorage.removeItem("pollenfi_user")
    router.push("/login")
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userDataString = localStorage.getItem("pollenfi_user");
    if(!token || !userDataString) {
      return;
    }
    const decoded = jwtDecode(token)
    const userData = JSON.parse(userDataString);
    if(!decoded || decoded.exp && decoded.exp < Date.now() / 1000) {
      logout();
    } else {
      login(userData, token);
      setAuthToken(token);
    }
    setLoading(false);
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      loadingState,
    }),
    [user, loading, login, logout, loadingState]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

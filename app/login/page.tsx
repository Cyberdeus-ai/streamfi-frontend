"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BrowserProvider } from "ethers"
import { useAuth } from "@/contexts/auth-context"
import { signIn } from "@/actions/auth"
import { notifications } from "@/utils/toast"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PollenSymbol } from "@/components/pollen-symbol"
import { LogIn } from "lucide-react"
import { LoadingOverlay } from "@/components/ui/spinner"

export default function LoginPage() {
  const { login, loadingState, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const signInHandler = async () => {
    if (!window.ethereum) {
      notifications.warning("Ethereum provider is not available. Please install MetaMask or another Web3 wallet.")
      return
    }

    loadingState(true)
    setIsLoading(true)

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[]
      
      if (!accounts || accounts.length === 0) {
        notifications.warning("No accounts found. Please connect your wallet first.")
        return
      }

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      const data = await signIn(address)

      if (data.result) {
        notifications.success("Successfully signed in!")
        login(data.user, data.token)
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error: any) {
      console.log(error)  
    } finally {
      loadingState(false)
      setIsLoading(false)
    }
  }

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="Signing in..." />
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lime/8 rounded-full blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-honey/6 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Logo />
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <PollenSymbol size={32} className="opacity-70" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <PollenSymbol size={32} className="opacity-70" />
          </div>
          <p className="text-muted-foreground">Connect your wallet to sign in</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Connect your Ethereum wallet to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={signInHandler}
              className="w-full bg-lime hover:bg-lime/90 text-background font-semibold glow-lime"
              disabled={isLoading}
            >
              <LogIn className="mr-2 w-4 h-4" />
              Sign In
            </Button>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/signup" className="text-lime hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}

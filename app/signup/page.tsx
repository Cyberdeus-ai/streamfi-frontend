"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSiwe } from "@/hooks/use-siwe"
import { signUp, setAccountType } from "@/actions/auth"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PollenSymbol } from "@/components/pollen-symbol"
import { ArrowRight, Wallet, Twitter, UserCheck, CheckCircle2 } from "lucide-react"
import { LoadingOverlay } from "@/components/ui/spinner"
import { notifications } from "@/utils/toast"

export default function SignUpPage() {
  const [step, setStep] = useState(0)
  const [address, setAddress] = useState<string>("")
  const [twitterAccount, setTwitterAccount] = useState("")
  const [accountType, setAccountTypeValue] = useState<"Admin" | "Promoter" | "">("")
  const [userId, setUserId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { signInWithEthereum, isLoading } = useSiwe()
  const router = useRouter()

  const handleWalletConnect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask or another Ethereum wallet")
      return
    }

    const result = await signInWithEthereum()
    if (result.success && result.address) {
      setAddress(result.address)
      setStep(1)
    }
  }

  const handleTwitterSubmit = async () => {
    if (!twitterAccount.trim()) {
      notifications.error("Twitter account is required")
      return
    }
    if (twitterAccount.trim().length < 3) {
      notifications.error("Twitter account must be at least 3 characters")
      return
    }

    setIsSubmitting(true)
    try {
      const { userId: newUserId } = await signUp(address, twitterAccount)
      setUserId(newUserId)
      setStep(2)
    } catch (error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAccountTypeSubmit = async () => {
    if (!accountType) {
      return
    }

    setIsSubmitting(true)
    try {
      await setAccountType(userId, accountType as "Admin" | "Promoter")
      setStep(3)
    } catch (error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = () => {
    router.push("/login")
  }

  const isAnyLoading = isLoading || isSubmitting

  return (
    <>
      <LoadingOverlay isLoading={isAnyLoading} message={isLoading ? "Connecting wallet..." : "Processing..."} />
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
            <h1 className="text-3xl font-bold">Join PollenFi</h1>
            <PollenSymbol size={32} className="opacity-70" />
          </div>
          <p className="text-muted-foreground">Create your account in a few steps</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all ${
                i <= step ? "bg-lime w-8" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>
              {step === 0 && "Connect Wallet"}
              {step === 1 && "Twitter Account"}
              {step === 2 && "Account Type"}
              {step === 3 && "Success"}
            </CardTitle>
            <CardDescription>
              {step === 0 && "Connect your Ethereum wallet to get started"}
              {step === 1 && "Link your Twitter account"}
              {step === 2 && "Choose your account type"}
              {step === 3 && "Your account has been created"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 0 && (
              <div className="space-y-4">
                <Button
                  onClick={handleWalletConnect}
                  className="w-full bg-lime hover:bg-lime/90 text-background font-semibold glow-lime"
                  disabled={isLoading}
                >
                  <Wallet className="mr-2 w-4 h-4" />
                  Connect Wallet
                </Button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="twitter" className="text-sm font-medium flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter Account
                  </label>
                  <Input
                    id="twitter"
                    type="text"
                    placeholder="@username"
                    value={twitterAccount}
                    onChange={(e) => setTwitterAccount(e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <Button
                  onClick={handleTwitterSubmit}
                  className="w-full bg-lime hover:bg-lime/90 text-background font-semibold glow-lime"
                  disabled={isSubmitting || !twitterAccount.trim()}
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Select Account Type
                  </label>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setAccountTypeValue("Admin")}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                        accountType === "Admin"
                          ? "border-lime bg-lime/10"
                          : "border-border hover:border-lime/50"
                      }`}
                    >
                      <div className="font-semibold">Admin</div>
                      <div className="text-sm text-muted-foreground">Manage campaigns and settings</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountTypeValue("Promoter")}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left cursor-pointer ${
                        accountType === "Promoter"
                          ? "border-lime bg-lime/10"
                          : "border-border hover:border-lime/50"
                      }`}
                    >
                      <div className="font-semibold">Promoter</div>
                      <div className="text-sm text-muted-foreground">Promote campaigns and earn rewards</div>
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleAccountTypeSubmit}
                  className="w-full bg-lime hover:bg-lime/90 text-background font-semibold glow-lime"
                  disabled={isSubmitting || !accountType}
                >
                  Continue
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-lime/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-lime" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Account Created!</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Your account has been successfully created. You can now sign in.
                  </p>
                </div>
                <Button
                  onClick={handleComplete}
                  className="w-full bg-lime hover:bg-lime/90 text-background font-semibold glow-lime"
                >
                  Go to Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {step < 3 && (
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-lime hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            )}
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

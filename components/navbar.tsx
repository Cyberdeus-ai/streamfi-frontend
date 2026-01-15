"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, logout, user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-border/50 bg-background/90 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#how-it-works", label: "How It Works" },
              { href: "#features", label: "Features" },
              { href: "/campaigns", label: "Campaigns" },
              { href: "/leaderboard", label: "Leaderboard" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-lime group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Image
                    src={user?.avatar || "/avatar.jpg"}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </Link>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-lime hover:bg-lime/90 text-background font-semibold btn-press transition-all" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 hover:bg-card rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <Link href="#how-it-works" className="block py-2 text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#features" className="block py-2 text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/campaigns" className="block py-2 text-muted-foreground hover:text-foreground">
              Campaigns
            </Link>
            <Link href="/leaderboard" className="block py-2 text-muted-foreground hover:text-foreground">
              Leaderboard
            </Link>
            <div className="pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-2 py-2 mb-2">
                    <Image
                      src={user?.avatar || "/avatar.jpg"}
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm text-muted-foreground">@{user?.username || "user"}</span>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="w-full bg-lime text-background font-semibold" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

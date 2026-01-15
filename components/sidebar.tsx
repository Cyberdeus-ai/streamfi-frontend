"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { LayoutDashboard, Trophy, Coins, Users, Settings, Sparkles, LogOut, ChevronRight, Shield, Menu, X } from "lucide-react"
import { cn } from "./ui/utils"
import { Button } from "@/components/ui/button"
import { StreamingCounter } from "@/components/streaming-counter"
import { useAuth } from "@/contexts/auth-context"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/campaigns", icon: Sparkles, label: "Campaigns" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/referrals", icon: Users, label: "Referrals" },
  { href: "/earnings", icon: Coins, label: "Earnings" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

const adminNavItems = [
  { href: "/oversight", icon: Shield, label: "Oversight" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-sidebar border border-border text-foreground hover:bg-sidebar-accent/50 transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-sidebar flex flex-col z-50",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Logo />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      {user?.account_type !== "Admin" && (
        <div className="p-4">
          <div className="bg-gradient-to-br from-cyan/10 to-lime/10 rounded-xl p-4 border border-cyan/20">
            <p className="text-xs text-muted-foreground mb-1">Your live earnings</p>
            <div className="text-xl font-bold text-lime">
              <StreamingCounter value={127.456789} prefix="$" decimals={6} increment={0.000012} />
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-cyan">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan"></span>
              </span>
              Streaming at $0.0043/sec
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/earnings" && pathname === "/deposit" && user?.account_type === "Admin")
          const href = item.href === "/earnings" && user?.account_type === "Admin" ? "/deposit" : item.href
          const label = item.href === "/earnings" && user?.account_type === "Admin" ? "Deposit" : item.label
          return (
            <Link
              key={item.href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
              )}
            >
              <item.icon className="w-5 h-5" />
              {label}
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
        {user?.account_type === "Admin" && (
          <div className="pt-4 mt-4 border-t border-sidebar-border">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={user?.avatar || "/avatar.jpg"}
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">@{user?.username || "cryptopromoter"}</p>
            <p className="text-xs text-muted-foreground">Rank #{user?.rank || 42}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm" onClick={logout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
    </>
  )
}

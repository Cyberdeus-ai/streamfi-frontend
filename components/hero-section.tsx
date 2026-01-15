"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { StreamingCounter } from "./streaming-counter"
import { ArrowRight, Zap, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { PollenSymbol } from "@/components/pollen-symbol"

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-emerald/5 via-background to-background" />

      <div
        className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-lime/8 rounded-full blur-[100px] animate-pulse-glow"
        style={{
          transform: `translateX(${isClient ? (mousePos.x - 0.5) * 40 : 0}px)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-honey/6 rounded-full blur-[80px] animate-pulse-glow"
        style={{
          animationDelay: "1.5s",
          transform: `translateX(${isClient ? (mousePos.x - 0.5) * -30 : 0}px)`,
        }}
      />

      {isClient && (
        <div
          className="absolute top-1/4 right-1/4 animate-float opacity-30 hover:opacity-60 transition-opacity duration-500"
          style={{ animationDuration: "6s" }}
        >
          <PollenSymbol size={48} />
        </div>
      )}

      <div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center space-y-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/80 border border-lime/20 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              Streaming <span className="text-lime font-mono font-semibold">$124,847</span> to promoters now
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-foreground">Talk Tokens.</span>
              <span className="block gradient-text-shimmer">Earn Every Second.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              The SocialFi platform where genuine engagement meets real-time rewards. Post, build community, and watch
              tokens stream to your wallet.
            </p>
          </div>

          <div className="inline-flex items-center gap-6 px-8 py-5 rounded-2xl bg-card/60 border border-border backdrop-blur-sm hover:border-lime/30 transition-all duration-300 group">
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Your Stream</p>
              <div className="text-3xl sm:text-4xl font-bold text-lime">
                <StreamingCounter value={420.69} prefix="$" decimals={2} increment={0.01} interval={50} />
              </div>
            </div>
            <div className="w-px h-14 bg-border group-hover:bg-lime/30 transition-colors" />
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Monthly</p>
              <p className="text-3xl sm:text-4xl font-bold text-honey">$6,048+</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-lime hover:bg-lime/90 text-background font-semibold text-lg px-10 py-7 glow-lime btn-press transition-all duration-200 group"
              asChild
            >
              <Link href="/dashboard">
                Start Earning Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-10 py-7 bg-transparent border-border hover:border-lime/50 hover:bg-card/50 btn-press transition-all duration-200"
              asChild
            >
              <Link href="/projects">Launch a Campaign</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-16 border-t border-border/50">
            {[
              { icon: Zap, value: "$2.4M+", label: "Streamed", color: "text-lime" },
              { icon: Users, value: "12,847", label: "Promoters", color: "text-honey" },
              { icon: TrendingUp, value: "156", label: "Campaigns", color: "text-emerald" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group cursor-default">
                <stat.icon
                  className={`w-5 h-5 mx-auto mb-3 ${stat.color} opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all`}
                />
                <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { PollenSymbol } from "@/components/pollen-symbol"

export function CTASection() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden" onMouseMove={handleMouseMove}>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald/8 to-transparent" />
      <div
        className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-lime/6 rounded-full blur-[120px]"
        style={{
          transform: `translateX(${(mousePos.x - 0.5) * 20}px)`,
        }}
      />
      <div
        className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-honey/5 rounded-full blur-[100px]"
      />

      <div className="absolute top-16 right-20 opacity-20 animate-float" style={{ animationDuration: "7s" }}>
        <PollenSymbol size={40} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="mb-8 opacity-60">
          <PollenSymbol size={48} />
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
          Ready to <span className="gradient-text">Earn Every Second</span>?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
          Join thousands of promoters already streaming rewards. Connect your X account and wallet to start earning in
          under 2 minutes.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-lime hover:bg-lime/90 text-background font-semibold text-lg px-10 py-7 glow-lime btn-press transition-all group"
            asChild
          >
            <Link href="/dashboard">
              Connect & Start Earning
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto text-lg px-10 py-7 bg-transparent border-border hover:border-lime/50 hover:bg-card/50 btn-press transition-all"
            asChild
          >
            <Link href="/projects">I'm a Project</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {["Results Based", "Powered by Superfluid", "Sybil-resistant"].map((item) => (
            <div key={item} className="flex items-center gap-2 hover:text-lime transition-colors">
              <Check className="w-4 h-4 text-lime" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

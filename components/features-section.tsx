"use client"

import { Shield, Zap, Users, BarChart3, Clock, Gift } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { PollenSymbol } from "@/components/pollen-symbol"

function BeeFavicon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="14" rx="6" ry="5" fill="oklch(0.8 0.14 90)" />
      <path d="M7 13H17" stroke="oklch(0.15 0.02 145)" strokeWidth="2" />
      <path d="M7.5 15.5H16.5" stroke="oklch(0.15 0.02 145)" strokeWidth="2" />
      <circle cx="12" cy="8" r="3" fill="oklch(0.15 0.02 145)" />
      <ellipse cx="7" cy="12" rx="2.5" ry="3.5" fill="oklch(0.75 0.18 140)" fillOpacity="0.5" />
      <ellipse cx="17" cy="12" rx="2.5" ry="3.5" fill="oklch(0.75 0.18 140)" fillOpacity="0.5" />
    </svg>
  )
}

function HoneycombFavicon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3L19 7.5V16.5L12 21L5 16.5V7.5L12 3Z"
        fill="oklch(0.8 0.14 90)"
        fillOpacity="0.2"
        stroke="oklch(0.75 0.18 140)"
        strokeWidth="1.5"
      />
      <path d="M12 7L15.5 9.25V13.75L12 16L8.5 13.75V9.25L12 7Z" fill="oklch(0.8 0.14 90)" />
    </svg>
  )
}

const features = [
  {
    icon: Zap,
    title: "Real-Time Streaming",
    description:
      "Tokens flow to your wallet every second via Superfluid. No waiting, no claims — just continuous earnings.",
  },
  {
    icon: Shield,
    title: "Sybil-Resistant",
    description:
      "Our Human Score system filters bots and fake engagement. Only genuine interactions count toward your points.",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    description: "Earn 10% of your invitees' points. Build your network and multiply your income passively.",
  },
  {
    icon: BarChart3,
    title: "Live Leaderboards",
    description:
      "Track your rank in real-time. Higher positions mean higher flow rates — climb the board, boost your streams.",
  },
  {
    icon: Clock,
    title: "Daily Recalculation",
    description:
      "Flow rates update at midnight UTC based on the latest points. Stay active to maintain and grow your streams.",
  },
  {
    icon: Gift,
    title: "Campaign Perks",
    description: "Access exclusive meme templates, brand kits, and content guides from each project you promote.",
  },
]

export function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(6).fill(false))
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const newState = [...prev]
                  newState[index] = true
                  return newState
                })
              }, index * 100)
            })
          }
        })
      },
      { threshold: 0.15 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="features" className="py-28 px-4 sm:px-6 lg:px-8 bg-card/20 relative overflow-hidden">
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-lime/4 rounded-full blur-[120px]"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-honey/4 rounded-full blur-[100px]"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <PollenSymbol size={32} className="opacity-70" />
            <h2 className="text-4xl sm:text-5xl font-bold">
              Built for <span className="gradient-text">Real Promoters</span>
            </h2>
            <PollenSymbol size={32} className="opacity-70" />
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Everything you need to maximize your earnings while maintaining authenticity
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`relative bg-card border border-border rounded-2xl p-6 card-lift group transition-all duration-500
                ${visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                ${hoveredIndex === index ? "border-lime/40" : "hover:border-lime/20"}`}
              style={{ transitionDelay: `${index * 80}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-60 group-hover:scale-110 transition-all">
                <PollenSymbol size={24} animated={false} />
              </div>

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime/15 to-honey/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:from-lime/25 transition-all">
                <feature.icon className="w-6 h-6 text-lime" />
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-lime transition-colors">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

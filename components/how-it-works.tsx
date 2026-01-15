"use client"

import { useState, useEffect, useRef } from "react"
import { Twitter, Search, MessageSquare, Coins } from "lucide-react"
import { PollenSymbol } from "@/components/pollen-symbol"

function XAccountIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="oklch(0.75 0.18 140)"
        strokeWidth="1.5"
        fill="oklch(0.8 0.14 90)"
        fillOpacity="0.2"
      />
      <path d="M6 6L18 18M18 6L6 18" stroke="oklch(0.75 0.18 140)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" fill="oklch(0.8 0.14 90)" />
    </svg>
  )
}

function CampaignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 3L19 7.5V16.5L12 21L5 16.5V7.5L12 3Z"
        fill="oklch(0.8 0.14 90)"
        fillOpacity="0.2"
        stroke="oklch(0.75 0.18 140)"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" fill="oklch(0.8 0.14 90)" />
      <path d="M12 9V6" stroke="oklch(0.75 0.18 140)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18V15" stroke="oklch(0.75 0.18 140)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function EngageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12V20H12C7.58 20 4 16.42 4 12Z"
        fill="oklch(0.8 0.14 90)"
        fillOpacity="0.2"
        stroke="oklch(0.75 0.18 140)"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="12" r="1.5" fill="oklch(0.75 0.18 140)" />
      <circle cx="15" cy="12" r="1.5" fill="oklch(0.75 0.18 140)" />
      <path d="M9 15.5C10 16.5 14 16.5 15 15.5" stroke="oklch(0.75 0.18 140)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function StreamIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 18L8 13L12 16L21 7"
        stroke="oklch(0.75 0.18 140)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18L8 13L12 16L21 7"
        stroke="oklch(0.8 0.14 90)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />
      <circle cx="21" cy="7" r="3" fill="oklch(0.8 0.14 90)" />
      <circle cx="3" cy="18" r="2" fill="oklch(0.75 0.18 140)" fillOpacity="0.5" />
    </svg>
  )
}

const steps = [
  {
    icon: Twitter,
    favicon: XAccountIcon,
    title: "Connect X Account",
    description: "Link your X (Twitter) account and wallet. We verify your authenticity with our Human Score system.",
  },
  {
    icon: Search,
    favicon: CampaignIcon,
    title: "Join Campaigns",
    description: "Browse active campaigns from top crypto projects. Each has unique rewards and content templates.",
  },
  {
    icon: MessageSquare,
    favicon: EngageIcon,
    title: "Create & Engage",
    description: "Post quality content about projects. Earn points from real engagement — comments, reposts, quotes.",
  },
  {
    icon: Coins,
    favicon: StreamIcon,
    title: "Stream Rewards",
    description: "Watch tokens flow to your wallet every second via Superfluid. Higher rankings = higher flow rates.",
  },
]

export function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => {
                  const newState = [...prev]
                  newState[index] = true
                  return newState
                })
              }, index * 150)
            })
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="absolute -top-20 -right-20 w-80 h-80 bg-lime/6 rounded-full blur-[100px]"
      />
      <div
        className="absolute -bottom-20 -left-20 w-60 h-60 bg-honey/5 rounded-full blur-[80px]"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-6">
            <PollenSymbol size={32} className="opacity-70" />
            <h2 className="text-4xl sm:text-5xl font-bold">
              How <span className="gradient-text">PollenFi</span> Works
            </h2>
            <PollenSymbol size={32} className="opacity-70" />
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Four simple steps to turn your social influence into streaming income
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, index) => {
            const FaviconComponent = step.favicon
            return (
              <div
                key={step.title}
                className={`relative group transition-all duration-500 ${
                  visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-[2px] z-0 -translate-x-1/2">
                    <div className="w-full h-full timeline-connector" />
                  </div>
                )}

                <div
                  className={`relative bg-card border border-border rounded-2xl p-6 h-full card-lift
                    ${hoveredIndex === index ? "border-lime/40" : "hover:border-lime/20"}`}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center group-hover:bg-lime/20 group-hover:scale-110 transition-all">
                      <FaviconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-bold font-mono text-lime/30 group-hover:text-lime/60 transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-lime transition-colors">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-lime/0 to-transparent group-hover:via-lime/50 rounded-full transition-all duration-500" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

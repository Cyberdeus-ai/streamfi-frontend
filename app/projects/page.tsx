"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Zap, Target, BarChart3, Shield, Users, Coins } from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    icon: Target,
    title: "Targeted Reach",
    description: "Connect with authentic crypto-native promoters who understand your project and audience.",
  },
  {
    icon: Shield,
    title: "Sybil-Resistant",
    description: "Our Human Score system ensures only genuine engagement counts — no bots, no fake metrics.",
  },
  {
    icon: Zap,
    title: "Real-Time Streaming",
    description: "Pay promoters continuously via Superfluid. Rewards flow as long as engagement happens.",
  },
  {
    icon: BarChart3,
    title: "Transparent Analytics",
    description: "Track campaign performance, engagement metrics, and ROI in real-time.",
  },
  {
    icon: Users,
    title: "Community Growth",
    description: "Referral mechanics incentivize promoters to bring in more quality voices.",
  },
  {
    icon: Coins,
    title: "Flexible Budgeting",
    description: "Set monthly allocations, adjust rewards, and pause campaigns as needed.",
  },
]

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amethyst/20 via-background to-background" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-magenta/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Launch Your <span className="gradient-text">Promotion Campaign</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with thousands of authentic crypto promoters. Stream token rewards to those who genuinely spread
            your message.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-magenta to-gold text-background font-semibold text-lg px-8 py-6"
              asChild
            >
              <Link href="/projects/create">
                Create Campaign
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Projects Choose <span className="gradient-text">PollenFi</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The only promotion platform that rewards real engagement, not vanity metrics
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-magenta/10 flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-magenta" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Create Campaign",
                desc: "Set your token allocation, duration, and campaign guidelines. Add brand assets and content templates.",
              },
              {
                step: "02",
                title: "Promoters Join",
                desc: "Authenticated promoters browse and join your campaign. They create content following your guidelines.",
              },
              {
                step: "03",
                title: "Engagement Tracked",
                desc: "Our system scrapes X for comments, reposts, and quotes. Each is weighted by the engager's Human Score.",
              },
              {
                step: "04",
                title: "Rewards Stream",
                desc: "At midnight UTC, rankings update and tokens stream to promoters proportional to their points.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-magenta to-gold flex items-center justify-center text-xl font-bold text-background shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Amplify Your Project?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the projects already streaming millions in rewards to their community.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-magenta to-gold text-background font-semibold text-lg px-8 py-6"
            asChild
          >
            <Link href="/projects/create">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}

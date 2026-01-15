"use client"

import { memo, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StreamingCounter } from "@/components/streaming-counter"
import { TrendingUp, Trophy, Users, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getDashboardStats } from "@/actions/dashboard"

import { mockStats } from "@/data/mock-data"

export const StatsCards = memo(function StatsCards() {
  const [stats, setStats] = useState(mockStats)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats()
        if (data) {
          setStats([
            {
              label: "Total Earned",
              value: data.totalEarned || 1247.89,
              change: data.earnedChange || "+12.5%",
              changeType: "positive",
              icon: Coins,
              prefix: "$",
              isStreaming: true,
            },
            {
              label: "Current Rank",
              value: data.currentRank || 42,
              change: data.rankChange || "+5 positions",
              changeType: "positive",
              icon: Trophy,
              prefix: "#",
              isStreaming: false,
            },
            {
              label: "Active Points",
              value: data.activePoints || 15842,
              change: data.pointsChange || "+2.3%",
              changeType: "positive",
              icon: TrendingUp,
              isStreaming: false,
            },
            {
              label: "Referral Bonus",
              value: data.referralBonus || 156.45,
              change: data.referralChange || "+8 invites",
              changeType: "positive",
              icon: Users,
              prefix: "$",
              isStreaming: false,
            },
          ])
        }
      } catch (error) {
      }
    }
    fetchData()
  }, [])
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.changeType === "positive" ? "text-lime" : "text-destructive"
                }`}
              >
                {stat.changeType === "positive" ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">
                {stat.isStreaming ? (
                  <StreamingCounter
                    value={stat.value}
                    prefix={stat.prefix || ""}
                    decimals={2}
                    increment={0.001}
                    interval={100}
                  />
                ) : (
                  <>
                    {stat.prefix}
                    {stat.value.toLocaleString()}
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})

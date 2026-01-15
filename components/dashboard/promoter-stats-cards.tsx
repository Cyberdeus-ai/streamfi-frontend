"use client"

import { memo, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StreamingCounter } from "@/components/streaming-counter"
import { TrendingUp, Trophy, Users, Coins, ArrowUpRight } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export const PromoterStatsCards = memo(function PromoterStatsCards() {
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(typeof window !== "undefined" && typeof window.ethereum !== "undefined") {

        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [user?.id])
  
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-lime">
              <ArrowUpRight className="w-3 h-3" />
              {`+${user?.earnings_growth?.toLocaleString()}%`}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Earned</p>
            <p className="text-2xl font-bold">
              <StreamingCounter
                value={0}
                prefix="$"
                decimals={2}
                increment={0.001}
                interval={100}
              />
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-lime">
              <ArrowUpRight className="w-3 h-3" />
              {`+${user?.rank_growth?.toLocaleString()}%`}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Rank</p>
            <p className="text-2xl font-bold">
              {user?.rank || 0}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-lime">
              <ArrowUpRight className="w-3 h-3" />
              {`+${user?.points_growth?.toLocaleString()}%`}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Active Points</p>
            <p className="text-2xl font-bold">
              {user?.points || 0}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-lime">
              <ArrowUpRight className="w-3 h-3" />
              {`+${user?.referrals_growth?.toLocaleString()}%`}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Referral Bonus</p>
            <p className="text-2xl font-bold">
              {`$${user?.referrals?.toLocaleString() || 0}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})


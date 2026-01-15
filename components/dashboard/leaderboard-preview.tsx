"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Crown, Medal, Award } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

import { mockLeaders } from "@/data/mock-data"

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-4 h-4 text-[#D4AF37]" />
    case 2:
      return <Medal className="w-4 h-4 text-foreground/60" />
    case 3:
      return <Award className="w-4 h-4 text-orange-400" />
    default:
      return null
  }
}

export function LeaderboardPreview({ topPromoters }: { topPromoters: any[] }) {
  const { user } = useAuth()
  const [userRank, setUserRank] = useState<{ rank: number; points: number; flowRate: string } | null>(null)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Top Promoters</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/leaderboard">
            Full Board <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topPromoters?.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${user.rank <= 3 ? "bg-gradient-to-r from-gold/5 to-transparent" : "hover:bg-secondary/50"
                }`}
            >
              <div className="w-8 text-center font-mono text-sm font-medium text-muted-foreground">
                {getRankIcon(user.rank) || `#${user.rank}`}
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                <Image
                  src={user.avatar || "/avatar.jpg"}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">@{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.points.toLocaleString()} points</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono text-lime">${user.flow_rate.toLocaleString()}/sec</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-cyan/10 border border-cyan/20">
          <div className="flex items-center gap-3">
            <div className="w-8 text-center font-mono text-sm font-medium">#{user?.rank}</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-lime overflow-hidden">
              <Image
                src={user?.avatar || "/avatar.jpg"}
                alt={user?.username || "user"}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">You (@{user?.username || "cryptopromoter"})</p>
              <p className="text-xs text-muted-foreground">{user?.points?.toLocaleString()} points</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-cyan">${user?.flow_rate}/sec</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

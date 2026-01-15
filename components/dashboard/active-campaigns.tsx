"use client"

import { memo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Coins, TrendingUp } from "lucide-react"
import Link from "next/link"
import { calculateMonthlyRate } from "@/utils/calculate-flow-rate"

export const ActiveCampaigns = memo(function ActiveCampaigns({ campaignList }: { campaignList: any[] }) {

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Your Active Campaigns</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/campaigns">
            View All <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {campaignList?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No active campaigns</p>
          </div>
        ) : (
          campaignList?.slice(0, 5).map((campaign) => (
            <div
              key={campaign.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <img
                src={campaign.logo || "/placeholder.svg"}
                alt={campaign.name || ""}
                className="w-12 h-12 rounded-xl bg-muted"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold truncate">{campaign.name || ""}</h4>
                  <Badge variant="secondary" className="bg-lime/10 text-lime border-0">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" />
                    {calculateMonthlyRate(campaign.pool?.flow_rate, campaign.pool?.flow_rate_unit) ?? "0"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {(campaign.promoters || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Rank #{campaign?.rank}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                  <TrendingUp className="w-3 h-3 text-lime" />
                  {campaign?.points.toLocaleString()} pts
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
})

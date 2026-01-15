"use client"

import { memo } from "react"
import { PromoterStatsCards } from "./promoter-stats-cards"
import { ActiveCampaigns } from "./active-campaigns"
import { FlowChart } from "./flow-chart"
import { LeaderboardPreview } from "./leaderboard-preview"
import { RecentActivity } from "./recent-activity"
import { AntiSybilWarning } from "./anti-sybil-warning"

export const PromoterDashboard = memo(function PromoterDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <AntiSybilWarning />
      <PromoterStatsCards />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActiveCampaigns campaignList={data?.active_campaign_list} />
          <FlowChart flowRateList={data?.flow_rate_list} />
        </div>
        <div className="space-y-6">
          <LeaderboardPreview topPromoters={data?.top_promoters}/>
          <RecentActivity activities={data?.activity_list} />
        </div>
      </div>
    </div>
  )
})


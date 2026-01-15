"use client"

import { memo } from "react"
import { AdminStatsCards } from "./admin-stats-cards"
import { CampaignManagement } from "./campaign-management"
import { UserManagement } from "./user-management"

export const AdminDashboard = memo(function AdminDashboard({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <AdminStatsCards stats={data?.stats} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CampaignManagement campaignList={data?.active_campaign_list} />
        </div>
        <div className="space-y-6">
          <UserManagement users={data?.users} />
        </div>
      </div>
    </div>
  )
})


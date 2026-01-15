"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"
import { PromoterDashboard } from "@/components/dashboard/promoter-dashboard"
import { AuthGuard } from "@/components/auth-guard"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationsPanel } from "@/components/notifications/notifications-panel"
import { useAuth } from "@/contexts/auth-context"
import { getAdminDashboardData, getPromoterDashboardData } from "@/actions/dashboard"

export default function DashboardPage() {
  const { user } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [data, setData] = useState<any>(null)
  const isAdmin = user?.account_type === "Admin"

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        if (isAdmin) {
          const data = await getAdminDashboardData(user?.id)
          if (data?.result && data?.dashboard) {
            setData(data.dashboard)
          }
        } else {
          const data = await getPromoterDashboardData(user?.id)
          if (data?.result && data?.dashboard) {
            setData(data.dashboard)
          }
        }
      }
    }
    fetchData()
  }, [user?.id, isAdmin])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-0 lg:pl-64">
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="px-4 sm:px-20 py-4 pl-16 lg:pl-4 flex items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isAdmin ? "Campaign management overview" : "Welcome back! Your streams are flowing."}
                </p>
              </div>
              <div className="flex justify-end">
                <div className="relative">
                  <Button variant="ghost" size="icon" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-magenta rounded-full" />
                  </Button>
                  {showNotifications && (
                    <div className="absolute right-0 top-12 z-50">
                      <NotificationsPanel onClose={() => setShowNotifications(false)} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className="p-4 sm:p-6">
            {isAdmin ? <AdminDashboard data={data} /> : <PromoterDashboard data={data} />}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

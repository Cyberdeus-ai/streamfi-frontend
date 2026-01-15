"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Repeat2, Quote, AtSign, ArrowUpRight } from "lucide-react"
import { SkeletonList } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/ui/empty-state"

export function RecentActivity({ activities }: { activities: any[] }) {
  const [isLoading, setIsLoading] = useState(true)
  const [activityList, setActivityList] = useState<any[]>([])

  useEffect(() => {
    if (activities) {
      setActivityList(activities.map((activity) => ({
        type: activity.type,
        message: activity.type === "comment" ? `New Comment on your ${activity.company.name} post` : activity.type === "repost" ? `Your ${activity.company.name} post was reposted` : activity.type === "quote" ? `Your ${activity.company.name} post was quoted` : `Mentioned your ${activity.company.name} post`,
        time: `${(new Date().getTime() - new Date(activity.time).getTime()).toLocaleString()} ago`,
        points: activity.points.toLocaleString(),
        color: activity.type === "comment" ? "cyan" : activity.type === "repost" ? "lime" : activity.type === "quote" ? "gold" : "magenta",
        icon: activity.type === "quote" ? Quote : activity.type === "repost" ? Repeat2 : activity.type === "comment" ? MessageCircle : AtSign,
      })))
    }
    setIsLoading(false)
  }, [activities])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <SkeletonList count={3} />
        ) : activityList.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="Your activity will appear here"
          />
        ) : (
          activityList.map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `var(--${activity.color})`, opacity: 0.15 }}
              >
                <activity.icon className="w-4 h-4" style={{ color: `var(--${activity.color})` }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{activity.message}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{activity.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-lime font-medium text-sm">
                <ArrowUpRight className="w-3 h-3" />
                {activity.points}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

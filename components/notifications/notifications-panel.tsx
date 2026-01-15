"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Check, X, MessageCircle, Trophy, TrendingUp, AlertCircle } from "lucide-react"
import { getNotifications, markAsRead, markAllAsRead } from "@/actions/notifications"

import { mockNotifications } from "@/data/mock-data"

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await getNotifications()
        if (data?.notifications) {
          setNotifications(data.notifications)
        }
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id)
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch (error) {
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      setNotifications(notifications.map((n) => ({ ...n, read: true })))
    } catch (error) {
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "earnings":
        return "text-lime"
      case "rank":
        return "text-cyan"
      case "mention":
        return "text-magenta"
      case "alert":
        return "text-honey"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="bg-card border-border w-92 max-h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border">
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-magenta text-background text-xs font-semibold">
              {unreadCount}
            </span>
          )}
        </CardTitle>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="h-8 px-2 text-xs">
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0 pt-0">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No notifications</div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => {
              const Icon = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-cyan/5" : ""
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getIconColor(notification.type)}/10`}>
                      <Icon className={`w-5 h-5 ${getIconColor(notification.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleMarkAsRead(notification.id)
                            }}
                            className="p-1 hover:bg-secondary rounded"
                          >
                            <Check className="w-4 h-4 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


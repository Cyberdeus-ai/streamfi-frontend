"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Shield, Ban, Unlock, Play, Pause } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import Image from "next/image"
import { getOversightUsers, updateUserStatus } from "@/actions/oversight"
import { LoadingOverlay } from "@/components/ui/spinner"
import { notifications } from "@/utils/toast"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/page-header"

import { mockUsers } from "@/data/mock-data"

export default function OversightPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [isLoading, setIsLoading] = useState(true)
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!authLoading && user?.account_type !== "Admin") {
      router.push("/dashboard")
    }
  }, [user, router, authLoading])

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return
      if (user?.account_type !== "Admin") {
        setIsLoading(false)
        return
      }
      try {
        const data = await getOversightUsers()
        if (data?.users && Array.isArray(data.users)) {
          setUsers(data.users)
        }
      } catch (error: any) {
        setUsers(mockUsers)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user, authLoading])

  const getBotDetectionBadge = (level: string) => {
    const variants: Record<string, { variant: "outline" | "secondary" | "destructive"; className: string }> = {
      low: { variant: "outline", className: "bg-lime/10 text-lime border-lime/20" },
      medium: { variant: "outline", className: "bg-honey/10 text-honey border-honey/20" },
      high: { variant: "outline", className: "bg-destructive/10 text-destructive border-destructive/20" },
    }
    return variants[level] || variants.low
  }

  const getSockpuppetBadge = (status: string) => {
    const variants: Record<string, { variant: "outline" | "secondary" | "destructive"; className: string }> = {
      passed: { variant: "outline", className: "bg-lime/10 text-lime border-lime/20" },
      suspicious: { variant: "outline", className: "bg-honey/10 text-honey border-honey/20" },
      failed: { variant: "outline", className: "bg-destructive/10 text-destructive border-destructive/20" },
    }
    return variants[status] || variants.passed
  }

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.username?.toLowerCase() || "").includes(debouncedSearchTerm.toLowerCase()) ||
          (u.name?.toLowerCase() || "").includes(debouncedSearchTerm.toLowerCase())
      ),
    [users, debouncedSearchTerm]
  )

  if (user?.account_type !== "Admin") {
    return null
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <LoadingOverlay isLoading={true} message="Loading users..." />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />

        <main className="pl-0 lg:pl-64">
          <PageHeader
            title={
              <span className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Oversight
              </span>
            }
            description="Monitor and manage engagers' security status"
          />
          <div className="sticky top-[73px] z-30 px-4 sm:px-6 py-3 pl-16 lg:pl-4 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Engagers Management</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <EmptyState
                    icon={<Shield className="w-12 h-12 text-muted-foreground" />}
                    title={debouncedSearchTerm ? "No users found" : "No users available"}
                    description={debouncedSearchTerm ? "Try adjusting your search" : "No users to display"}
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto custom-scrollbar">
                      <div className="min-w-[1100px]">
                        <div className="grid grid-cols-11 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
                      <div>Avatar</div>
                      <div className="col-span-2">User</div>
                      <div>Created</div>
                      <div>Bot Detection</div>
                      <div>Sockpuppet</div>
                      <div>Wallet</div>
                      <div>Banned</div>
                      <div>Streaming</div>
                      <div className="col-span-2 text-right -ml-10">Actions</div>
                    </div>

                    {filteredUsers.map((userItem) => (
                    <div
                      key={userItem.id}
                      className="grid grid-cols-11 gap-4 px-4 py-3 rounded-lg items-center hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                          <Image
                            src={userItem.avatar || "/avatar.jpg"}
                            alt={userItem.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <p className="font-medium">{userItem.name}</p>
                        <p className="text-xs text-muted-foreground">@{userItem.username}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">{userItem.created_at}</div>
                      <div>
                        <Badge {...getBotDetectionBadge(userItem.bot_detection)}>
                          {userItem.bot_detection}
                        </Badge>
                      </div>
                      <div>
                        <Badge {...getSockpuppetBadge(userItem.sockpuppet_filters)}>
                          {userItem.sockpuppet_filters}
                        </Badge>
                      </div>
                      <div>
                        {userItem.wallet_status ? (
                          <Badge variant="outline" className="bg-lime/10 text-lime border-lime/20">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <div>
                        {userItem.is_ban ? (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            Banned
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-lime/10 text-lime border-lime/20">
                            Active
                          </Badge>
                        )}
                      </div>
                      <div>
                        {userItem.stream_status ? (
                          <Badge variant="outline" className="bg-cyan/10 text-cyan border-cyan/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            Paused
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2 -ml-10">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingIds.has(userItem.id)}
                          onClick={async () => {
                            if (!userItem.id) {
                              notifications.error("Invalid user ID")
                              return
                            }
                            const previousState = userItem.is_ban
                            setUpdatingIds(prev => new Set(prev).add(userItem.id))
                            setUsers(users.map(u => u.id === userItem.id ? { ...u, is_ban: !u.is_ban } : u))
                            try {
                              await updateUserStatus(userItem.id.toString(), { is_ban: !userItem.is_ban })
                              notifications.success(`User ${previousState ? "unbanned" : "banned"}`)
                            } catch (error: any) {
                              setUsers(users.map(u => u.id === userItem.id ? { ...u, is_ban: previousState } : u))
                              notifications.error(error?.response?.data?.message || "Failed to update user status")
                            } finally {
                              setUpdatingIds(prev => {
                                const next = new Set(prev)
                                next.delete(userItem.id)
                                return next
                              })
                            }
                          }}
                        >
                          {userItem.is_ban ? <Unlock className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingIds.has(userItem.id)}
                          onClick={async () => {
                            if (!userItem.id) {
                              notifications.error("Invalid user ID")
                              return
                            }
                            const previousState = userItem.stream_status
                            setUpdatingIds(prev => new Set(prev).add(userItem.id))
                            setUsers(users.map(u => u.id === userItem.id ? { ...u, stream_status: !u.stream_status } : u))
                            try {
                              await updateUserStatus(userItem.id.toString(), { stream_status: !userItem.stream_status })
                              notifications.success(`Stream ${previousState ? "paused" : "resumed"}`)
                            } catch (error: any) {
                              setUsers(users.map(u => u.id === userItem.id ? { ...u, stream_status: previousState } : u))
                              notifications.error(error?.response?.data?.message || "Failed to update stream status")
                            } finally {
                              setUpdatingIds(prev => {
                                const next = new Set(prev)
                                next.delete(userItem.id)
                                return next
                              })
                            }
                          }}
                        >
                          {userItem.stream_status ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}


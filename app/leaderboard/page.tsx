"use client"

import { useState, useEffect, useMemo } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import { Crown, Medal, Award, TrendingUp, TrendingDown, Minus, Search, Users, Trophy, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LoadingOverlay } from "@/components/ui/spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { PageHeader } from "@/components/page-header"

import { mockLeaderboardData } from "@/data/mock-data"

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-[#D4AF37]" />
    case 2:
      return <Medal className="w-5 h-5 text-foreground/60" />
    case 3:
      return <Award className="w-5 h-5 text-orange-400" />
    default:
      return <span className="font-mono text-muted-foreground">#{rank}</span>
  }
}

function getChangeIndicator(change: number) {
  if (change > 0) return <TrendingUp className="w-4 h-4 text-lime" />
  if (change < 0) return <TrendingDown className="w-4 h-4 text-destructive" />
  return <Minus className="w-4 h-4 text-muted-foreground" />
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaderboardData, setLeaderboardData] = useState(mockLeaderboardData)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const isAdmin = user?.account_type === "Admin"

  const loadLeaderboard = async (pageNum: number, append: boolean = false) => {
    if (isLoadingMore && append) return
    if (append) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      if (pageNum === 1) {
        setLeaderboardData(mockLeaderboardData)
      }
      setHasMore(false)
    } catch (error: any) {
      if (pageNum === 1 && leaderboardData.length === 0) {
        setLeaderboardData(mockLeaderboardData)
      }
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    loadLeaderboard(1, false)
  }, [])

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadLeaderboard(nextPage, true)
    }
  }

  useEffect(() => {
    if (!hasMore || isLoadingMore) return
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 300) {
        handleLoadMore()
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMore, isLoadingMore, page])

  const filteredData = useMemo(
    () => leaderboardData.filter((item) => item.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())),
    [leaderboardData, debouncedSearchTerm]
  )

  const userRank = useMemo(
    () => leaderboardData.find((item) => item.username === user?.username),
    [leaderboardData, user?.username]
  )

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <LoadingOverlay isLoading={true} message="Loading leaderboard..." />
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
            title="Leaderboard"
            description={isAdmin ? "View all engagers' rankings and analytics" : "Top promoters ranked by points across all campaigns"}
          />
          <div className="sticky top-[73px] z-30 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-end px-4 sm:px-6 py-3 pl-16 lg:pl-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1.5">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime"></span>
                  </span>
                  Live
                </Badge>
                <Badge variant="secondary">Updates at 00:00 UTC</Badge>
              </div>
            </div>
          </div>
          <div className="px-4 sm:px-6 py-4 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search promoters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>

          <div className="p-6">
            {isAdmin && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-cyan/10 flex items-center justify-center">
                        <Users className="w-6 h-6 text-cyan" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Engagers</p>
                        <p className="text-2xl font-bold">{leaderboardData.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-lime/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-lime" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Points</p>
                        <p className="text-2xl font-bold">
                          {leaderboardData.reduce((sum, u) => sum + u.points, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-honey/10 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-honey" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Points</p>
                        <p className="text-2xl font-bold">
                          {Math.round(leaderboardData.reduce((sum, u) => sum + u.points, 0) / leaderboardData.length).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {!isAdmin && leaderboardData.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="order-1 pt-8">
                <Card className="bg-card border-border text-center p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-foreground/60" />
                  <Medal className="w-8 h-8 text-foreground/60 mx-auto mb-3" />
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    <Image
                      src={leaderboardData[1].avatar || "/avatar.jpg"}
                      alt={leaderboardData[1].username}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </div>
                  <p className="font-semibold">@{leaderboardData[1].username}</p>
                  <p className="text-2xl font-bold text-lime mt-2">{leaderboardData[1].points.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                  <p className="text-sm font-mono text-cyan mt-2">${leaderboardData[1].flowRate}/sec</p>
                </Card>
              </div>

              <div className="order-2">
                <Card className="bg-gradient-to-b from-gold/10 to-card border-gold/30 text-center p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#D4AF37]" />
                  <Crown className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mx-auto mb-3 ring-2 ring-gold/30 overflow-hidden">
                    <Image
                      src={leaderboardData[0].avatar || "/avatar.jpg"}
                      alt={leaderboardData[0].username}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  </div>
                  <p className="font-semibold text-lg">@{leaderboardData[0].username}</p>
                  <p className="text-3xl font-bold text-lime mt-2">{leaderboardData[0].points.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                  <p className="text-lg font-mono text-cyan mt-2">${leaderboardData[0].flowRate}/sec</p>
                </Card>
              </div>

              <div className="order-3 pt-12">
                <Card className="bg-card border-border text-center p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-orange-400/50" />
                  <Award className="w-7 h-7 text-orange-400 mx-auto mb-3" />
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 overflow-hidden">
                    <Image
                      src={leaderboardData[2].avatar || "/avatar.jpg"}
                      alt={leaderboardData[2].username}
                      width={56}
                      height={56}
                      className="rounded-full"
                    />
                  </div>
                  <p className="font-semibold">@{leaderboardData[2].username}</p>
                  <p className="text-xl font-bold text-lime mt-2">{leaderboardData[2].points.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                  <p className="text-sm font-mono text-cyan mt-2">${leaderboardData[2].flowRate}/sec</p>
                </Card>
              </div>
            </div>
            )}

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>All Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredData.length === 0 ? (
                  <EmptyState
                    icon={<Trophy className="w-12 h-12 text-muted-foreground" />}
                    title="No results found"
                    description={debouncedSearchTerm ? "Try adjusting your search" : "No rankings available"}
                  />
                ) : (
                  <div className="overflow-x-auto custom-scrollbar">
                    <div className="space-y-2 min-w-[800px]">
                      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
                      <div className="col-span-1">Rank</div>
                      <div className="col-span-1">Δ</div>
                      <div className="col-span-1">Avatar</div>
                      <div className="col-span-3">User</div>
                      <div className="col-span-3 text-right">Points</div>
                      <div className="col-span-3 text-right">Flow Rate</div>
                    </div>

                    {filteredData.map((userItem, i) => (
                    <div
                      key={userItem.rank}
                      className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg items-center transition-colors hover:bg-secondary/50 ${userItem.username === user?.username ? "bg-cyan/10 border border-cyan/20" : ""}`}
                    >
                      <div className="col-span-1 flex items-center justify-center">{getRankIcon(userItem.rank)}</div>
                      <div className="col-span-1 flex items-center">{getChangeIndicator(userItem.change)}</div>
                      <div className="col-span-1 flex items-center justify-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${userItem.username === user?.username ? "bg-gradient-to-br from-cyan to-lime" : "bg-secondary"}`}>
                          <Image
                            src={userItem.avatar || "/avatar.jpg"}
                            alt={userItem.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      <div className="col-span-3">
                        <p className="font-medium">{userItem.username === user?.username ? "You" : (userItem as any).name || userItem.username}</p>
                        <p className="text-xs text-muted-foreground">@{userItem.username}</p>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="font-semibold">{userItem.points.toLocaleString()}</span>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="font-mono text-lime">${userItem.flowRate}/sec</span>
                      </div>
                    </div>
                    ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center items-center py-6">
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Loading more rankings...</span>
                    </div>
                  )}
                </div>

                {!isAdmin && userRank && !filteredData.find((item) => item.username === user?.username) && (
                  <div className="mt-6 p-4 rounded-xl bg-cyan/10 border border-cyan/20 overflow-x-auto custom-scrollbar">
                    <div className="grid grid-cols-12 gap-4 items-center min-w-[800px]">
                      <div className="col-span-1 flex items-center justify-center">
                        <span className="font-mono font-bold text-cyan">#{userRank.rank}</span>
                      </div>
                      <div className="col-span-1 flex items-center">
                        {getChangeIndicator(userRank.change || 0)}
                      </div>
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-lime overflow-hidden">
                          <Image
                            src={user?.avatar || "/avatar.jpg"}
                            alt={user?.username || "user"}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        </div>
                        <span className="font-medium">You (@{user?.username || "cryptopromoter"})</span>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="font-semibold">{userRank.points.toLocaleString()}</span>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className="font-mono text-cyan">${userRank.flowRate}/sec</span>
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

"use client"

import { useState, useEffect } from "react"
import { mockReferrals, mockCampaignReferrals } from "@/data/mock-data"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Users, TrendingUp, Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { LoadingOverlay } from "@/components/ui/spinner"
import { EmptyState } from "@/components/ui/empty-state"
import Image from "next/image"
import { PageHeader } from "@/components/page-header"

export default function ReferralsPage() {
  const { user } = useAuth()
  const [referrals, setReferrals] = useState(mockReferrals)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const isAdmin = user?.account_type === "Admin"
  const referralLink = `https://pollenfi.com/signup?ref=${user?.username || "user"}`

  useEffect(() => {
    const fetchData = async () => {
      
    }
    fetchData()
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalReferrals = referrals.length
  const totalPoints = referrals.reduce((sum, ref) => sum + ref.points, 0)

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <LoadingOverlay isLoading={true} message="Loading referrals..." />
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
            title="Referrals"
            description={isAdmin ? "Campaign referral analytics" : "Track your referral network and earnings"}
          />

          <div className="p-6 space-y-6">
            {isAdmin ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cyan/10 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-cyan" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Campaigns with Referrals</p>
                          <p className="text-2xl font-bold">{mockCampaignReferrals.length.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-lime/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-lime" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Referrals</p>
                          <p className="text-2xl font-bold">
                            {(mockCampaignReferrals.reduce((sum, c) => sum + c.totalReferrals, 0)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-honey/10 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-honey" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Conversion Rate</p>
                          <p className="text-2xl font-bold">
                            {(
                              mockCampaignReferrals.reduce((sum, c) => sum + parseFloat(c.conversionRate), 0) /
                              mockCampaignReferrals.length
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Campaign Referral Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="overflow-x-auto custom-scrollbar">
                        <div className="min-w-[600px]">
                          <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        <div>Campaign</div>
                        <div className="text-right">Total Referrals</div>
                        <div className="text-right">Conversion Rate</div>
                        <div className="text-right">Revenue</div>
                      </div>

                      {mockCampaignReferrals.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="grid grid-cols-4 gap-4 px-4 py-3 rounded-lg items-center hover:bg-secondary/50 transition-colors"
                        >
                          <div className="font-medium">{campaign.campaign}</div>
                          <div className="text-right font-semibold">{campaign.totalReferrals.toLocaleString()}</div>
                          <div className="text-right font-semibold text-lime">{campaign.conversionRate}</div>
                          <div className="text-right font-semibold">${(campaign.revenue.toFixed(2)).toLocaleString()}</div>
                        </div>
                      ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cyan/10 flex items-center justify-center">
                          <Users className="w-6 h-6 text-cyan" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Referrals</p>
                          <p className="text-2xl font-bold">{totalReferrals}</p>
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
                          <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-honey/10 flex items-center justify-center">
                          <ExternalLink className="w-6 h-6 text-honey" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Referral Link</p>
                          <Button variant="ghost" size="sm" onClick={handleCopy} className="mt-1">
                            <Copy className="w-4 h-4 mr-2" />
                            {copied ? "Copied!" : "Copy Link"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Your Referrals</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {referrals.length === 0 ? (
                      <EmptyState
                        icon={<Users className="w-12 h-12 text-muted-foreground" />}
                        title="No referrals yet"
                        description="Share your referral link to start earning referral bonuses!"
                      />
                    ) : (
                      <div className="space-y-4">
                        <div className="overflow-x-auto custom-scrollbar">
                          <div className="min-w-[600px]">
                            <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
                          <div>User</div>
                          <div>Joined</div>
                          <div>Status</div>
                          <div className="text-right">Points</div>
                        </div>

                        {referrals.map((referral) => (
                          <div
                            key={referral.id}
                            className="grid grid-cols-4 gap-4 px-4 py-3 rounded-lg items-center hover:bg-secondary/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                <Image
                                  src={referral.avatar || "/avatar.jpg"}
                                  alt={referral.username}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                              </div>
                              <span className="font-medium">@{referral.username}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">{referral.joinedAt}</div>
                            <div>
                              <Badge variant="outline" className="bg-lime/10 text-lime border-lime/20">
                                {referral.status}
                              </Badge>
                            </div>
                            <div className="text-right font-semibold">{referral.points.toLocaleString()}</div>
                          </div>
                        ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}


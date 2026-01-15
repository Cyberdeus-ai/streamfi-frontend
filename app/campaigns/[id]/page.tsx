"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Users,
  Coins,
  Clock,
  ExternalLink,
  Copy,
  MessageCircle,
  Repeat2,
  Quote,
  CheckCircle2,
  Twitter,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { notifications } from "@/utils/toast"
import { LoadingOverlay } from "@/components/ui/spinner"
import { useAuth } from "@/contexts/auth-context"
import { useCampaigns } from "@/contexts/campaigns-context"
import { mockCampaigns } from "@/data/mock-data"
import type { Campaign } from "@/types"
import { calculateMonthlyRate } from "@/utils/calculate-flow-rate"
import { joinCampaign } from "@/actions/join"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { getCampaignById: getCampaignFromContext } = useCampaigns()
  const [campaign, setCampaign] = useState<Campaign>(mockCampaigns[0])
  const [isLoading, setIsLoading] = useState(true)
  const [twitterReferer, setTwitterReferer] = useState<string>("")
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)
  const isAdmin = user?.account_type === "Admin"

  const monthlyPoolAmount = useMemo(() => {
    const monthlyRate = calculateMonthlyRate(campaign.pool?.flow_rate, campaign.pool?.flow_rate_unit)
    return monthlyRate.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 0 })
  }, [campaign.pool?.flow_rate, campaign.pool?.flow_rate_unit])

  const handleEditCampaign = () => {
    router.push(`/campaigns/create?edit=${params.id}`)
  }

  const handleJoinCampaign = async() => {
    
    if (twitterReferer.trim() === user?.username) {
      notifications.warning("You cannot refer yourself")
      return
    }

    try {
      setIsLoading(true)
      setIsJoinModalOpen(false)
      const data = await joinCampaign(Number(params.id), Number(user?.id), twitterReferer)
      if (data?.result) {
        notifications.success("Successfully joined campaign!")
        setTwitterReferer("")
      } else {
        notifications.warning(data?.message)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const campaignId = Number(params.id)
    const contextCampaign = getCampaignFromContext(campaignId)

    if (contextCampaign) {
      setCampaign(contextCampaign)
      setIsLoading(false)
    } else {
      setCampaign(mockCampaigns[0])
      setIsLoading(false)
    }
  }, [params.id, getCampaignFromContext])

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <LoadingOverlay isLoading={true} message="Loading campaign..." />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-0 lg:pl-64">
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
            <Link
              href="/campaigns"
              className="px-4 sm:px-20 py-4 pl-16 lg:pl-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Campaigns</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <div className="px-4 sm:px-20 pl-16 lg:pl-4 flex items-start gap-4">
              <img
                src={campaign.logo || "/placeholder.svg"}
                alt={campaign.name || ""}
                className="w-20 h-20 rounded-2xl bg-muted"
              />
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold">{campaign?.name}</h1>
                  <Badge className={campaign.end_date && new Date(campaign.end_date).getTime() > Date.now() ? "bg-lime/10 text-lime border-0" : "bg-muted text-muted-foreground border-0"}>
                    {campaign.end_date && new Date(campaign.end_date).getTime() > Date.now() ? "Active" : "Ended"}
                  </Badge>
                </div>
                {campaign?.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground">{campaign?.description}</p>
                )}
                <div className="flex-1 mt-2 sm:mt-3 lg:mt-4">
                  <div className="flex items-center gap-4">
                    {campaign.website && (
                      <a href={campaign.website} className="text-sm text-cyan hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Website
                      </a>
                    )}
                    {campaign.twitter && (
                      <a href="#" className="text-sm text-cyan hover:underline flex items-center gap-1">
                        <Twitter className="w-3.5 h-3.5" />
                        {campaign.twitter}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end px-4 sm:px-6 py-3 pl-16 lg:pl-4">
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Button onClick={handleEditCampaign} variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Edit Campaign</span>
                    <span className="sm:hidden">Edit</span>
                  </Button>
                )}
                {!isAdmin && (
                  <Button
                    className="bg-gradient-to-r from-cyan to-lime text-background font-semibold shrink-0"
                    onClick={() => setIsJoinModalOpen(true)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Join Campaign</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                )}
              </div>
            </div>
          </header>

          <div className={`px-6 py-4 border-b border-border grid gap-6 ${isAdmin ? "grid-cols-3" : "grid-cols-4"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-lg font-bold">{monthlyPoolAmount}</p>
                <p className="text-xs text-muted-foreground">Monthly Pool</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan" />
              </div>
              <div>
                <p className="text-lg font-bold">{(campaign.promoters || 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Active Promoters</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-lime" />
              </div>
              <div>
                <p className="text-lg font-bold">
                  {campaign.end_date
                    ? `${Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`
                    : "0 days"}
                </p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
            </div>
            {!isAdmin && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-magenta/10 flex items-center justify-center">
                  <span className="text-magenta font-bold">#</span>
                </div>
                <div>
                  <p className="text-lg font-bold">Not Joined</p>
                  <p className="text-xs text-muted-foreground">Your Rank</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>About This Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{campaign.about || ""}</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Content Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {(campaign.guidelines || []).map((guideline, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-lime shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Content Templates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(campaign.templates || []).map((template, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-lg bg-amethyst flex items-center justify-center text-2xl">
                        {template.type === "Thread" ? "🧵" : template.type === "Meme" ? "😂" : "📊"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {template.type}
                          </Badge>
                          <h4 className="font-medium">{template.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{template.preview}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(template.preview)
                          notifications.success("Template copied to clipboard")
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Points System</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                        <Quote className="w-4 h-4 text-cyan" />
                      </div>
                      <span className="font-medium">Quote Post</span>
                    </div>
                    <span className="text-lime font-mono font-bold">×{campaign.quote || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-cyan" />
                      </div>
                      <span className="font-medium">Comment</span>
                    </div>
                    <span className="text-lime font-mono font-bold">×{campaign.comment || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
                        <Repeat2 className="w-4 h-4 text-cyan" />
                      </div>
                      <span className="font-medium">Repost</span>
                    </div>
                    <span className="text-lime font-mono font-bold">×{campaign.repost || 0}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Points = Engagement Weight × Human Score (0-1)</p>
                </CardContent>
              </Card>

              {!isAdmin && (
                <Card className="bg-gradient-to-br from-cyan/10 to-lime/10 border-cyan/20">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Referral Bonus</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Invite others to this campaign and earn 10% of their points!
                    </p>
                    <div className="flex items-center gap-2">
                      <Input readOnly value={`pollenfi.xyz/r/${campaign.id}`} className="bg-background/50 text-sm" />
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(`pollenfi.xyz/r/${campaign.id}`)
                          notifications.success("Referral link copied to clipboard")
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isAdmin && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Campaign Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-muted-foreground">Total Engagement</span>
                      <span className="font-semibold">12,456</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-muted-foreground">Active Participants</span>
                      <span className="font-semibold">{(campaign.promoters || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-muted-foreground">Pool Utilization</span>
                      <span className="font-semibold text-lime">68.5%</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>

        <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="twitterReferer">Twitter Referer</Label>
                <Input
                  id="twitterReferer"
                  placeholder="@username"
                  value={twitterReferer}
                  onChange={(e) => setTwitterReferer(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleJoinCampaign}
                disabled={isLoading}
              >
                Skip
              </Button>
              <Button
                className="bg-gradient-to-r from-cyan to-lime text-background font-semibold"
                onClick={handleJoinCampaign}
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}

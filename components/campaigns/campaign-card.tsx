import { memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Coins, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Campaign } from "@/types"
import { calculateMonthlyRate } from "@/utils/calculate-flow-rate"

interface CampaignCardProps {
  campaign: Campaign
}

export const CampaignCard = memo(function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <img
            src={campaign.logo || "/placeholder.svg"}
            alt={campaign.name || ""}
            className="w-14 h-14 rounded-xl bg-muted"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg truncate">{campaign.name || ""}</h3>
              <Badge
                variant="secondary"
                className={`shrink-0 ${
                  campaign.end_date && new Date(campaign.end_date).getTime() > Date.now()
                    ? "bg-lime/10 text-lime border-0"
                    : campaign.start_date && new Date(campaign.start_date).getTime() > Date.now()
                      ? "bg-cyan/10 text-cyan border-0"
                      : "bg-muted text-muted-foreground border-0"
                }`}
              >
                {campaign.end_date && new Date(campaign.end_date).getTime() > Date.now()
                  ? "Active"
                  : campaign.start_date && new Date(campaign.start_date).getTime() > Date.now()
                    ? "Soon"
                    : "Ended"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description || ""}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(campaign.hashtags || []).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Coins className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold">{calculateMonthlyRate(campaign.pool?.flow_rate, campaign.pool?.flow_rate_unit).toLocaleString() ?? "0"}</p>
            <p className="text-xs text-muted-foreground">Monthly Pool</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold">{(campaign.promoters || 0).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Promoters</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold">
              {campaign.end_date
                ? `${Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d`
                : "0d"}
            </p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>

        <Button
          className="w-full group-hover:bg-gradient-to-r group-hover:from-cyan group-hover:to-lime group-hover:text-background transition-all"
          asChild
        >
          <Link href={`/campaigns/${campaign.id || 0}`}>
            View Campaign
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
})

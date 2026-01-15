"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle, Loader2, ExternalLink } from "lucide-react"
import { getTransactionStatus } from "@/actions/transactions"

export interface TransactionStatusProps {
  txHash: string
  onStatusChange?: (status: string) => void
}

export function TransactionStatus({ txHash, onStatusChange }: TransactionStatusProps) {
  const [status, setStatus] = useState<"pending" | "confirmed" | "failed">("pending")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await getTransactionStatus(txHash)
        if (data?.status) {
          setStatus(data.status)
          onStatusChange?.(data.status)
        }
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    const interval = setInterval(checkStatus, 3000)
    checkStatus()

    return () => clearInterval(interval)
  }, [txHash, onStatusChange])

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-5 h-5 text-cyan animate-spin" />
    }
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5 text-lime" />
      case "failed":
        return <XCircle className="w-5 h-5 text-destructive" />
      default:
        return <Clock className="w-5 h-5 text-honey" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-lime/10 text-lime border-lime/20">
            Confirmed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-honey/10 text-honey border-honey/20">
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="text-sm font-medium">Transaction Status</p>
              <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">{txHash}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-secondary rounded"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


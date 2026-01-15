"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coins, TrendingUp, Wallet, ArrowDownRight, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import { notifications } from "@/utils/toast"
import { LoadingOverlay } from "@/components/ui/spinner"
import { getEarnings, requestWithdrawal, getWithdrawals } from "@/actions/earnings"
import { PageHeader } from "@/components/page-header"

import { mockEarningsHistory, mockWithdrawalHistory } from "@/data/mock-data"

export default function EarningsPage() {
  const { user } = useAuth()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawToken, setWithdrawToken] = useState("USDC")
  const [isProcessing, setIsProcessing] = useState(false)
  const [earningsHistory, setEarningsHistory] = useState(mockEarningsHistory)
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [withdrawals, setWithdrawals] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const earningsData = await getEarnings()
        if (earningsData) {
          setEarningsHistory(earningsData.history || mockEarningsHistory)
          setTotalEarnings(earningsData.total || 574.90)
        }
        const withdrawalsData = await getWithdrawals()
        if (withdrawalsData?.withdrawals) {
          setWithdrawals(withdrawalsData.withdrawals)
        } else {
          setWithdrawals(mockWithdrawalHistory)
        }
      } catch (error) {
        setEarningsHistory(mockEarningsHistory)
        const calculated = mockEarningsHistory.reduce((sum, item) => sum + item.amount, 0)
        setTotalEarnings(calculated)
        setWithdrawals(mockWithdrawalHistory)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      notifications.error("Please enter a valid amount")
      return
    }

    if (parseFloat(withdrawAmount) > totalEarnings) {
      notifications.error("Insufficient balance")
      return
    }

    setIsProcessing(true)

    try {
      const result = await requestWithdrawal(withdrawAmount, withdrawToken)
      if (result) {
        setWithdrawAmount("")
        const withdrawalsData = await getWithdrawals()
        if (withdrawalsData?.withdrawals) {
          setWithdrawals(withdrawalsData.withdrawals)
        }
      }
    } catch (error: any) {
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <LoadingOverlay isLoading={true} message="Loading earnings..." />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <LoadingOverlay isLoading={isProcessing} message="Processing withdrawal..." />

        <main className="pl-0 lg:pl-64">
          <PageHeader
            title="Earnings"
            description="Track your earnings and withdraw to your wallet"
          />

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-lime/10 flex items-center justify-center">
                      <Coins className="w-6 h-6 text-lime" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold text-lime">${totalEarnings.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-cyan/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-cyan" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">This Month</p>
                      <p className="text-2xl font-bold">${earningsHistory.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-honey/10 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-honey" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Withdraw Earnings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amount</label>
                    <Input
                      type="text"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-secondary border-border"
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Max: ${totalEarnings.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Token</label>
                    <select
                      value={withdrawToken}
                      onChange={(e) => setWithdrawToken(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-foreground"
                      disabled={isProcessing}
                    >
                      <option>USDC</option>
                      <option>USDT</option>
                      <option>DAI</option>
                      <option>ETH</option>
                    </select>
                  </div>
                  <Button
                    onClick={handleWithdraw}
                    className="w-full bg-lime hover:bg-lime/90 text-background font-semibold"
                    disabled={isProcessing || !withdrawAmount || parseFloat(withdrawAmount) > totalEarnings}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="w-4 h-4 mr-2" />
                        Withdraw to Wallet
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Wallet Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Connected Wallet</p>
                      <p className="font-mono text-sm bg-secondary p-3 rounded-md break-all">
                        {user?.address || "Not connected"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Earnings History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="overflow-x-auto custom-scrollbar">
                      <div className="min-w-[600px]">
                        <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
                      <div>Date</div>
                      <div>Campaign</div>
                      <div className="text-right">Amount</div>
                      <div className="text-right">Status</div>
                    </div>

                    {earningsHistory.map((earning) => (
                      <div
                        key={earning.id}
                        className="grid grid-cols-4 gap-4 px-4 py-3 rounded-lg items-center hover:bg-secondary/50 transition-colors"
                      >
                        <div className="text-sm">{earning.date}</div>
                        <div className="font-medium">{earning.campaign}</div>
                        <div className="text-right font-semibold text-lime">+${earning.amount.toFixed(2)}</div>
                        <div className="text-right">
                          <span className="text-sm text-muted-foreground">Completed</span>
                        </div>
                      </div>
                    ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Withdrawal History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {withdrawals.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No withdrawals yet</div>
                    ) : (
                      <div className="overflow-x-auto custom-scrollbar">
                        <div className="min-w-[600px]">
                          <div className="grid grid-cols-4 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
                          <div>Date</div>
                          <div>Amount</div>
                          <div>Token</div>
                          <div className="text-right">Status</div>
                        </div>
                        {withdrawals.map((withdrawal: any) => (
                          <div
                            key={withdrawal.id}
                            className="grid grid-cols-4 gap-4 px-4 py-3 rounded-lg items-center hover:bg-secondary/50 transition-colors"
                          >
                            <div className="text-sm">{new Date(withdrawal.createdAt).toLocaleDateString()}</div>
                            <div className="font-semibold">{withdrawal.amount}</div>
                            <div>{withdrawal.token}</div>
                            <div className="text-right">
                              <span
                                className={`text-sm ${
                                  withdrawal.status === "approved" || withdrawal.status === "completed"
                                    ? "text-lime"
                                    : withdrawal.status === "pending"
                                    ? "text-honey"
                                    : "text-destructive"
                                }`}
                              >
                                {withdrawal.status === "approved"
                                  ? "Approved"
                                  : withdrawal.status === "completed"
                                  ? "Completed"
                                  : withdrawal.status === "pending"
                                  ? "Pending"
                                  : "Rejected"}
                              </span>
                            </div>
                          </div>
                        ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}


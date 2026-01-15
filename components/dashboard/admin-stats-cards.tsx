"use client"

import { memo, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Users, Coins, ArrowUpRight, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { BrowserProvider, Contract, formatUnits } from "ethers"

const TOKEN_PRICES: Record<string, number> = {
  ETH: 3000,
  USDC: 1,
  USDT: 1,
  DAI: 1,
  MATIC: 0.8,
  AVAX: 35,
  BNB: 600,
  xDAI: 1,
  CELO: 0.5,
  DEGEN: 0.001,
}

export const AdminStatsCards = memo(function AdminStatsCards({ stats }: { stats: any }) {
  const { user } = useAuth()

  const [tokenPrices, setTokenPrices] = useState<Record<string, number>>(TOKEN_PRICES)
  const [poolBalanceUSDList, setPoolBalanceUSDList] = useState<{ token: string; address: string; balance: number }[]>([])

  useEffect(() => {
    let isMounted = true

    const fetchTokenPrices = async () => {
      const prices: Record<string, number> = { ...TOKEN_PRICES }
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum,usd-coin,tether,dai,polygon,avalanche-2,binancecoin,celo&vs_currencies=usd")
        const data = await response.json()
        if (data.ethereum) prices.ETH = data.ethereum.usd
        if (data["usd-coin"]) prices.USDC = data["usd-coin"].usd
        if (data.tether) prices.USDT = data.tether.usd
        if (data.dai) prices.DAI = data.dai.usd
        if (data.polygon) prices.MATIC = data.polygon.usd
        if (data["avalanche-2"]) prices.AVAX = data["avalanche-2"].usd
        if (data.binancecoin) prices.BNB = data.binancecoin.usd
        if (data.celo) prices.CELO = data.celo.usd
      } catch (error) {
        console.error("Error fetching token prices:", error)
      }
      if (isMounted) {
        setTokenPrices(prices)
      }
    }
    fetchTokenPrices()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const calculatePoolBalanceUSD = async () => {
      try {
        if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
          return
        }

        if (!stats?.pool_list || !Array.isArray(stats?.pool_list) || stats?.pool_list?.length === 0) {
          if (isMounted) {
            setPoolBalanceUSDList([])
          }
          return
        }

        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const userAddress = await signer.getAddress()

        const SUPER_TOKEN_ABI = [
          "function balanceOf(address owner) view returns (uint256)",
          "function decimals() view returns (uint8)"
        ]

        const balancePromises = stats.pool_list.map(async (pool: any) => {
          try {
            if (!pool.super_token_address || !pool.token || !pool.address) {
              return null
            }

            const superTokenContract = new Contract(pool.super_token_address, SUPER_TOKEN_ABI, provider)
            const [superBalance, superDecimals] = await Promise.all([
              superTokenContract.balanceOf(userAddress),
              superTokenContract.decimals().catch(() => 18)
            ])
            
            const balance = formatUnits(superBalance, superDecimals)
            const tokenName = pool.token.replace('x', '').toUpperCase()
            const price = tokenPrices[tokenName] || 0
            
            return {
              token: pool.token,
              address: pool.address,
              balance: parseFloat(balance) * price
            }
          } catch (error) {
            console.error(`Error fetching balance for pool ${pool.address}:`, error)
            return null
          }
        })

        const balanceList = await Promise.all(balancePromises)
        const validBalances = balanceList.filter((item): item is { token: string; address: string; balance: number } => item !== null)

        if (isMounted) {
          setPoolBalanceUSDList(validBalances)
        }
      } catch (error) {
        console.error("Error calculating pool balance:", error)
        if (isMounted) {
          setPoolBalanceUSDList([])
        }
      }
    }

    calculatePoolBalanceUSD()

    return () => {
      isMounted = false
    }
  }, [tokenPrices, stats?.pool_list])

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div
              className="flex items-center gap-1 text-xs font-medium text-lime"
            >
              <ArrowUpRight className="w-3 h-3" />
              {`+${user?.campaigns_growth || 0} this month`}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Campaigns</p>
            <p className="text-2xl font-bold">
              {(stats?.total_campaigns || 0).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div
              className="flex items-center gap-1 text-xs font-medium text-lime"
            >
              <ArrowUpRight className="w-3 h-3" />
              {`+${stats?.promoters_growth || 0}%`}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Promoters</p>
            <p className="text-2xl font-bold">
              {(stats?.total_promoters || 0).toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Pool Balance</p>
            <p className="text-2xl font-bold">
              ${poolBalanceUSDList.reduce((sum, item) => sum + item.balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Active Campaigns</p>
            <p className="text-2xl font-bold">
              {stats?.active_campaigns || 0}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})


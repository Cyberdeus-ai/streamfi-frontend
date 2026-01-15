"use client"

import { memo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Coins, Loader2 } from "lucide-react"
import { BrowserProvider, Contract } from "ethers"
import { notifications } from "@/utils/toast"
import { getTokensForNetwork, type TokenConfig } from "@/utils/token-config"

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]

export const TokenSelector = memo(function TokenSelector({
  currentNetworkId,
  onTokenSelect,
}: {
  currentNetworkId?: string
  onTokenSelect?: (tokenAddress: string, symbol: string, decimals: number, superTokenAddress: string) => void
}) {
  const [selectedToken, setSelectedToken] = useState<string>("")
  const [tokenInfo, setTokenInfo] = useState<{ symbol: string; balance: string; decimals: number; superTokenAddress: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userAddress, setUserAddress] = useState<string>("")
  const [availableTokens, setAvailableTokens] = useState<TokenConfig[]>([])

  useEffect(() => {
    const getAddress = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setUserAddress(address)
        } catch (error) {
        }
      }
    }
    getAddress()
  }, [])

  useEffect(() => {
    if (currentNetworkId) {
      const tokens = getTokensForNetwork(currentNetworkId)
      setAvailableTokens(tokens)
      if (selectedToken && !tokens.find((t) => t.symbol === selectedToken)) {
        setSelectedToken("")
        setTokenInfo(null)
      }
    }
  }, [currentNetworkId, selectedToken])

  const loadTokenInfo = async (tokenSymbol: string) => {
    if (!tokenSymbol || !currentNetworkId || !userAddress) {
      notifications.warning("Please select a token and connect wallet")
      return
    }

    const tokenConfig = availableTokens.find((t) => t.symbol === tokenSymbol)
    if (!tokenConfig) {
      notifications.error("Token not found for current network")
      return
    }

    setIsLoading(true)
    try {
      if (typeof window.ethereum === "undefined") {
        notifications.warning("Please install MetaMask")
        return
      }

      const provider = new BrowserProvider(window.ethereum)

      if (tokenConfig.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        const balance = await provider.getBalance(userAddress)
        const formattedBalance = (Number(balance) / Math.pow(10, tokenConfig.decimals)).toLocaleString()

        setTokenInfo({
          symbol: tokenConfig.symbol,
          balance: formattedBalance,
          decimals: tokenConfig.decimals,
          superTokenAddress: tokenConfig.superTokenAddress,
        })

        setSelectedToken(tokenSymbol)
        onTokenSelect?.(tokenConfig.address, tokenConfig.symbol, tokenConfig.decimals, tokenConfig.superTokenAddress)
        notifications.success(`Token selected: ${tokenConfig.symbol}`)
      } else {
        const contract = new Contract(tokenConfig.address, ERC20_ABI, provider)

        const [symbol, decimals, balance] = await Promise.all([
          contract.symbol(),
          contract.decimals(),
          contract.balanceOf(userAddress),
        ])

        const formattedBalance = (Number(balance) / Math.pow(10, Number(decimals))).toLocaleString()

        setTokenInfo({
          symbol: symbol as string,
          balance: formattedBalance,
          decimals: Number(decimals),
          superTokenAddress: tokenConfig.superTokenAddress,
        })

        setSelectedToken(tokenSymbol)
        onTokenSelect?.(tokenConfig.address, symbol as string, Number(decimals), tokenConfig.superTokenAddress)
        notifications.success(`Token selected: ${symbol}`)
      }
    } catch (error: any) {
      notifications.error("Failed to load token info")
      setTokenInfo(null)
      setSelectedToken("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Token Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Select Token</label>
          <Select
            value={selectedToken}
            onValueChange={loadTokenInfo}
            disabled={isLoading || !currentNetworkId || availableTokens.length === 0}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder={currentNetworkId ? "Select token" : "Select network first"} />
            </SelectTrigger>
            <SelectContent>
              {availableTokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading token info...
          </div>
        )}
        {tokenInfo && (
          <div className="p-3 rounded-lg bg-secondary/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Symbol:</span>
              <span className="font-medium">{tokenInfo.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-medium">{tokenInfo.balance}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Decimals:</span>
              <span className="font-medium">{tokenInfo.decimals}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Super Token:</span>
              <span className="font-medium font-mono text-xs">{tokenInfo.symbol}x</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})


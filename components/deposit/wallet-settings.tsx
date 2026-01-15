"use client"

import { memo, useState, useEffect } from "react"
import { TokenSelector } from "@/components/deposit/token-selector"
import { TokenWrapper } from "@/components/deposit/token-wrapper"
import { PoolCreator } from "@/components/deposit/pool-creator"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { usePools } from "@/contexts/pools-context"
import { BrowserProvider } from "ethers"

export const WalletSettings = memo(function WalletSettings() {
  const { addPool } = usePools()
  const [currentNetworkId, setCurrentNetworkId] = useState<string>("")
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("")
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>("")
  const [selectedSuperTokenAddress, setSelectedSuperTokenAddress] = useState<string>("")
  const [selectedSuperTokenSymbol, setSelectedSuperTokenSymbol] = useState<string>("")
  const [selectedTokenDecimals, setSelectedTokenDecimals] = useState<number>(18)
  const [poolAddress, setPoolAddress] = useState<string>("")

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new BrowserProvider(window.ethereum)
          const network = await provider.getNetwork()
          setCurrentNetworkId(network.chainId.toString())
        } catch (error) {
        }
      }
    }
    checkNetwork()
  }, [])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Wallet & Token Management</CardTitle>
        <CardDescription>Manage network, tokens, and pool settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <TokenSelector
          currentNetworkId={currentNetworkId}
          onTokenSelect={(address, symbol, decimals, superTokenAddress) => {
            setSelectedTokenAddress(address)
            setSelectedTokenSymbol(symbol)
            setSelectedTokenDecimals(decimals)
            setSelectedSuperTokenAddress(superTokenAddress)
            setSelectedSuperTokenSymbol(`${symbol}x`)
          }}
        />
        <TokenWrapper
          erc20Address={selectedTokenAddress}
          superTokenAddress={selectedSuperTokenAddress}
          tokenSymbol={selectedTokenSymbol}
          superTokenSymbol={selectedSuperTokenSymbol}
          decimals={selectedTokenDecimals}
          onWrapped={(amount) => {
          }}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium">Super Token Address</label>
          <Input
            value={selectedSuperTokenAddress}
            onChange={(e) => {
              setSelectedSuperTokenAddress(e.target.value)
            }}
            placeholder="0x..."
            className="bg-secondary border-border font-mono text-sm"
          />
        </div>
        <PoolCreator
          superTokenAddress={selectedSuperTokenAddress}
          onPoolCreated={(address) => {
            setPoolAddress(address)
            if (currentNetworkId && selectedSuperTokenSymbol) {
              addPool({
                address,
                superTokenAddress: selectedSuperTokenAddress,
                superTokenSymbol: selectedSuperTokenSymbol,
                networkId: currentNetworkId,
                createdAt: Date.now(),
              })
            }
          }}
        />
        {poolAddress && (
          <div className="p-3 rounded-lg bg-lime/10 border border-lime/20">
            <div className="text-sm font-medium text-lime mb-1">Pool Created</div>
            <div className="text-xs text-muted-foreground font-mono break-all">{poolAddress}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
})


"use client"

import { memo, useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Network, Loader2 } from "lucide-react"
import { BrowserProvider } from "ethers"
import { notifications } from "@/utils/toast"
import { NETWORK_CONFIGS, type NetworkConfig } from "@/utils/token-config"
import { cn } from "@/components/ui/utils"

const NetworkIcon = memo(function NetworkIcon({ config }: { config: NetworkConfig }) {
  const [imageError, setImageError] = useState(false)

  if (config.isTestnet || !config.iconPath || imageError) {
    return (
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0", config.iconColor)}>
        {config.iconLetter}
      </div>
    )
  }

  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-secondary/50 p-1 overflow-hidden">
      <img
        src={config.iconPath}
        alt={config.name}
        className="w-full h-full object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  )
})

export const NetworkSwitcher = memo(function NetworkSwitcher({
  onNetworkChange,
}: {
  onNetworkChange?: (chainId: string) => void
}) {
  const [currentChainId, setCurrentChainId] = useState<string>("")
  const [isSwitching, setIsSwitching] = useState(false)
  const [activeTab, setActiveTab] = useState<"mainnets" | "testnets">("mainnets")

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new BrowserProvider(window.ethereum)
          const network = await provider.getNetwork()
          const chainIdStr = network.chainId.toString()
          setCurrentChainId(chainIdStr)
          const networkConfig = NETWORK_CONFIGS[chainIdStr]
          if (networkConfig) {
            setActiveTab(networkConfig.isTestnet ? "testnets" : "mainnets")
          }
        } catch (error) {
        }
      }
    }
    checkNetwork()

    const ethereum = typeof window !== "undefined" ? window.ethereum : null
    if (ethereum && typeof ethereum.on === "function") {
      ethereum.on("chainChanged", () => {
        checkNetwork()
      })

      return () => {
        if (ethereum && typeof ethereum.removeListener === "function") {
          ethereum.removeListener("chainChanged", checkNetwork)
        }
      }
    }
  }, [])

  const switchNetwork = async (targetChainId: string) => {
    if (typeof window.ethereum === "undefined") {
      notifications.warning("Please install MetaMask or another Web3 wallet")
      return
    }

    setIsSwitching(true)
    try {
      const networkConfig = NETWORK_CONFIGS[targetChainId as keyof typeof NETWORK_CONFIGS]
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: networkConfig?.chainId || `0x${parseInt(targetChainId).toString(16)}` }],
      })
      setCurrentChainId(targetChainId)
      onNetworkChange?.(targetChainId)
      notifications.success("Network switched successfully")
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          const network = NETWORK_CONFIGS[targetChainId as keyof typeof NETWORK_CONFIGS]
          if (network) {
            const nativeCurrency = {
              name: network.name.includes("Ethereum") || network.name.includes("Sepolia") || network.name.includes("Arbitrum") || network.name.includes("Optimism") || network.name.includes("OP") || network.name.includes("Base") || network.name.includes("Scroll") ? "ETH" : network.name.includes("Polygon") || network.name.includes("Mumbai") ? "MATIC" : network.name.includes("Avalanche") || network.name.includes("Fuji") ? "AVAX" : network.name.includes("BNB") ? "BNB" : network.name.includes("Gnosis") ? "xDAI" : network.name.includes("Celo") ? "CELO" : network.name.includes("Degen") ? "DEGEN" : "ETH",
              symbol: network.name.includes("Ethereum") || network.name.includes("Sepolia") || network.name.includes("Arbitrum") || network.name.includes("Optimism") || network.name.includes("OP") || network.name.includes("Base") || network.name.includes("Scroll") ? "ETH" : network.name.includes("Polygon") || network.name.includes("Mumbai") ? "MATIC" : network.name.includes("Avalanche") || network.name.includes("Fuji") ? "AVAX" : network.name.includes("BNB") ? "BNB" : network.name.includes("Gnosis") ? "xDAI" : network.name.includes("Celo") ? "CELO" : network.name.includes("Degen") ? "DEGEN" : "ETH",
              decimals: 18,
            }

            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: network.chainId,
                  chainName: network.name,
                  rpcUrls: [network.rpcUrl],
                  nativeCurrency,
                  blockExplorerUrls: network.isTestnet ? ["https://sepolia.etherscan.io"] : [],
                },
              ],
            })
            setCurrentChainId(targetChainId)
            onNetworkChange?.(targetChainId)
            notifications.success("Network added and switched")
          }
        } catch (addError) {
          notifications.error("Failed to add network")
        }
      } else {
        notifications.error("Failed to switch network")
      }
    } finally {
      setIsSwitching(false)
    }
  }

  const mainnets = Object.entries(NETWORK_CONFIGS).filter(([_, config]) => !config.isTestnet)
  const testnets = Object.entries(NETWORK_CONFIGS).filter(([_, config]) => config.isTestnet)
  const displayedNetworks = activeTab === "mainnets" ? mainnets : testnets

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Network</h3>
          </div>
          {isSwitching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Switching network...
            </div>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="p-2 space-y-1">
            {displayedNetworks.map(([chainId, config]) => {
              const isSelected = currentChainId === chainId
              return (
                <button
                  key={chainId}
                  onClick={() => switchNetwork(chainId)}
                  disabled={isSwitching || typeof window.ethereum === "undefined"}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    isSelected
                      ? "bg-cyan/20 border border-cyan/30 text-foreground"
                      : "hover:bg-secondary/50 text-foreground/70 hover:text-foreground"
                  )}
                >
                  <NetworkIcon config={config} />
                  <span className="flex-1 font-medium text-sm">{config.name}</span>
                </button>
              )
            })}
          </div>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "mainnets" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("mainnets")}
              className={cn(
                "flex-1",
                activeTab === "mainnets"
                  ? "bg-secondary border border-border text-foreground"
                  : "bg-transparent border-border text-muted-foreground hover:text-foreground"
              )}
            >
              Mainnets
            </Button>
            <Button
              variant={activeTab === "testnets" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("testnets")}
              className={cn(
                "flex-1",
                activeTab === "testnets"
                  ? "bg-secondary border border-border text-foreground"
                  : "bg-transparent border-border text-muted-foreground hover:text-foreground"
              )}
            >
              Testnets
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

"use client"

import { memo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Database, Loader2 } from "lucide-react"
import { BrowserProvider, Contract, id, getAddress } from "ethers"
import type { Log } from "ethers"
import { notifications } from "@/utils/toast"
import { useAuth } from "@/contexts/auth-context"
import { GDAv1ForwarderAddress } from "@/utils/constants"

const forwarderAddress = GDAv1ForwarderAddress

const forwarderABI = [
  "function createPool(address superToken, address admin, tuple(uint256 transferabilityForUnitsOwner, bool distributionFromAnyAddress) config) external returns (address)",
]

export const PoolCreator = memo(function PoolCreator({
  superTokenAddress,
  onPoolCreated,
}: {
  superTokenAddress?: string
  onPoolCreated?: (poolAddress: string) => void
}) {
  const { isAuthenticated } = useAuth()
  const [isCreating, setIsCreating] = useState(false)

  const createPool = async () => {
    if (!isAuthenticated) {
      notifications.warning("Wallet not connected. Please connect your wallet first.")
      return
    }

    if (typeof window.ethereum === "undefined") {
      notifications.warning("Please install MetaMask")
      return
    }

    if (!superTokenAddress) {
      notifications.warning("Please provide super token address")
      return
    }

    if (!forwarderAddress) {
      notifications.warning("Please provide forwarder contract address")
      return
    }

    setIsCreating(true)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()

      if (network.chainId.toString() !== "11155111") {
        notifications.warning(`MetaMask is not connected to Sepolia. Current ChainId: ${network.chainId}`)
        return
      }

      const poolCreateEvent = "PoolCreated(address,address,address)"
      const hash = id(poolCreateEvent)
      const contract = new Contract(forwarderAddress, forwarderABI, signer)

      const adminAddress = await signer.getAddress()
      const config = {
        transferabilityForUnitsOwner: 0,
        distributionFromAnyAddress: false,
      }

      const tx = await contract.createPool(superTokenAddress, adminAddress, config)
      const receipt = await tx.wait()

      const poolLog = receipt.logs.find((log: Log) => hash === log.topics[0])

      if (poolLog) {
        const poolAddress = getAddress("0x" + poolLog.data.slice(26))
        onPoolCreated?.(poolAddress)
        notifications.success("Pool created successfully!")
      } else {
        notifications.error("Pool created but address not found in logs")
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create pool"
      notifications.error(`Failed to create pool: ${errorMessage}`, {
        action: {
          label: "Retry",
          onClick: () => createPool(),
        },
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Database className="w-5 h-5" />
          Create Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {superTokenAddress && (
          <div className="p-3 rounded-lg bg-secondary/50 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Super Token:</span>
              <span className="font-mono">{superTokenAddress.slice(0, 6)}...{superTokenAddress.slice(-4)}</span>
            </div>
          </div>
        )}
        <Button onClick={createPool} disabled={isCreating || !superTokenAddress || !forwarderAddress} className="w-full">
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Pool...
            </>
          ) : (
            "Create Pool"
          )}
        </Button>
      </CardContent>
    </Card>
  )
})


"use client"

import { memo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"
import { BrowserProvider, Contract } from "ethers"
import { notifications } from "@/utils/toast"

const ERC20_ABI = ["function approve(address spender, uint256 amount) public returns (bool)"]
const SUPER_TOKEN_ABI = ["function upgrade(uint256 amount) external"]

export const TokenWrapper = memo(function TokenWrapper({
  erc20Address,
  superTokenAddress,
  tokenSymbol,
  superTokenSymbol,
  decimals,
  onWrapped,
}: {
  erc20Address?: string
  superTokenAddress?: string
  tokenSymbol?: string
  superTokenSymbol?: string
  decimals?: number
  onWrapped?: (amount: string) => void
}) {
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState("")
  const [isWrapping, setIsWrapping] = useState(false)

  const wrapTokens = async () => {
    if (typeof window.ethereum === "undefined") {
      notifications.warning("Please install MetaMask")
      return
    }

    if (!erc20Address || !superTokenAddress) {
      notifications.warning("Please select token first")
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      notifications.warning("Please enter a valid amount")
      return
    }

    setIsWrapping(true)
    setStatus("")
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const tokenDecimals = decimals || 18
      const amountWei = BigInt(Math.floor(parseFloat(amount) * Math.pow(10, tokenDecimals)))

      if (erc20Address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        setStatus("Wrapping native token...")
        const superTokenContract = new Contract(superTokenAddress, SUPER_TOKEN_ABI, signer)
        const upgradeTx = await superTokenContract.upgrade(amountWei, { value: amountWei })
        await upgradeTx.wait()
      } else {
        const erc20Contract = new Contract(erc20Address, ERC20_ABI, signer)
        const superTokenContract = new Contract(superTokenAddress, SUPER_TOKEN_ABI, signer)

        setStatus("Approving token...")
        const approveTx = await erc20Contract.approve(superTokenAddress, amountWei)
        await approveTx.wait()

        setStatus("Wrapping tokens...")
        const upgradeTx = await superTokenContract.upgrade(amountWei)
        await upgradeTx.wait()
      }

      setStatus("Tokens wrapped successfully!")
      notifications.success(`Successfully wrapped ${amount} ${tokenSymbol || ""} to ${superTokenSymbol || ""}`)
      onWrapped?.(amount)
      setAmount("")
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to wrap tokens"
      setStatus(`Error: ${errorMessage}`)
      notifications.error(errorMessage)
    } finally {
      setIsWrapping(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <RefreshCw className="w-5 h-5" />
          Wrap to Super Token
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Amount to Wrap ({tokenSymbol || "Token"})
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="bg-secondary border-border"
            disabled={isWrapping || !erc20Address || !superTokenAddress}
          />
        </div>
        {tokenSymbol && superTokenSymbol && (
          <div className="p-3 rounded-lg bg-secondary/50 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token:</span>
              <span className="font-medium">{tokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Super Token:</span>
              <span className="font-medium">{superTokenSymbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-mono text-xs break-all">{superTokenAddress?.slice(0, 10)}...{superTokenAddress?.slice(-8)}</span>
            </div>
          </div>
        )}
        <Button onClick={wrapTokens} disabled={isWrapping || !amount || !erc20Address || !superTokenAddress} className="w-full">
          {isWrapping ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Wrapping...
            </>
          ) : (
            `Wrap ${tokenSymbol || "Token"} to ${superTokenSymbol || "Super Token"}`
          )}
        </Button>
        {status && (
          <div className={`text-sm p-2 rounded ${status.includes("Error") ? "text-destructive bg-destructive/10" : "text-lime bg-lime/10"}`}>
            {status}
          </div>
        )}
      </CardContent>
    </Card>
  )
})


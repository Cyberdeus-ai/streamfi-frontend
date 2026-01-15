"use client"

import { memo, useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, Loader2, AlertCircle } from "lucide-react"
import { BrowserProvider, Contract, formatUnits, parseUnits } from "ethers"
import { notifications } from "@/utils/toast"
import { NETWORK_CONFIGS, type TokenConfig, type NetworkConfig, getTokensForNetwork } from "@/utils/token-config"
import { cn } from "@/components/ui/utils"
import Image from "next/image"

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]

const SUPER_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function upgrade(uint256 amount) external",
  "function downgrade(uint256 amount) external",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
]

const NetworkIcon = memo(function NetworkIcon({ config }: { config: NetworkConfig }) {
  const [imageError, setImageError] = useState(false)

  if (config.isTestnet || !config.iconPath || imageError) {
    return (
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm shrink-0", config.iconColor)}>
        {config.iconLetter}
      </div>
    )
  }

  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-secondary/50 p-1 overflow-hidden border border-border">
      <Image
        src={config.iconPath}
        alt={config.name}
        width={32}
        height={32}
        className="w-full h-full object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  )
})

export const WrapUnwrap = memo(function WrapUnwrap() {
  const [mode, setMode] = useState<"wrap" | "unwrap">("wrap")
  const [currentNetworkId, setCurrentNetworkId] = useState<string>("")
  const [userAddress, setUserAddress] = useState<string>("")
  const [availableTokens, setAvailableTokens] = useState<TokenConfig[]>([])
  const [token, setToken] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [tokenBalance, setTokenBalance] = useState("0")
  const [superTokenBalance, setSuperTokenBalance] = useState("0")
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showGasWarning, setShowGasWarning] = useState(false)
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false)
  const [tokenPrice, setTokenPrice] = useState<number>(0)

  useEffect(() => {
    const checkNetwork = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new BrowserProvider(window.ethereum)
          const network = await provider.getNetwork()
          setCurrentNetworkId(network.chainId.toString())
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setUserAddress(address)
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
      ethereum.on("accountsChanged", () => {
        checkNetwork()
      })

      return () => {
        if (ethereum && typeof ethereum.removeListener === "function") {
          ethereum.removeListener("chainChanged", checkNetwork)
          ethereum.removeListener("accountsChanged", checkNetwork)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (currentNetworkId) {
      const tokens = getTokensForNetwork(currentNetworkId);
      setAvailableTokens(tokens);
      setToken(tokens[0].symbol)
      setTokenBalance("0")
      setSuperTokenBalance("0")
      setAmount("")
      setShowGasWarning(false)
      setShowInsufficientBalance(false)
      setTokenPrice(0)
    }
  }, [currentNetworkId])

  const loadBalances = useCallback(async () => {
    if (!currentNetworkId || !userAddress || !token || typeof window.ethereum === "undefined") {
      setIsLoadingBalances(false)
      return
    }

    setIsLoadingBalances(true)
    try {
      const provider = new BrowserProvider(window.ethereum)

      const tokenConfig = availableTokens.find((t) => t.symbol === token)
      if (!tokenConfig) {
        setIsLoadingBalances(false)
        return
      }

      if (tokenConfig.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        const balance = await provider.getBalance(userAddress)
        setTokenBalance(formatUnits(balance, tokenConfig.decimals))
      } else {
        const contract = new Contract(tokenConfig.address, ERC20_ABI, provider)
        const balance = await contract.balanceOf(userAddress)
        setTokenBalance(formatUnits(balance, tokenConfig.decimals))
      }

      const superTokenContract = new Contract(tokenConfig.superTokenAddress, SUPER_TOKEN_ABI, provider)
      const superBalance = await superTokenContract.balanceOf(userAddress)
      const superDecimals = await superTokenContract.decimals()
      setSuperTokenBalance(formatUnits(superBalance, superDecimals))
    } catch (error) {
    } finally {
      setIsLoadingBalances(false)
    }
  }, [currentNetworkId, userAddress, token, availableTokens])

  useEffect(() => {
    loadBalances()
  }, [loadBalances])

  useEffect(() => {
    const fetchTokenPrice = async () => {
      if (token) {
        try {
          const tokenId = token.toLowerCase()
          const coinGeckoIds: Record<string, string> = {
            eth: "ethereum",
            bnb: "binancecoin",
            matic: "matic-network",
            usdc: "usd-coin",
            usdt: "tether",
            dai: "dai",
            avax: "avalanche-2",
            xdai: "xdai",
            celo: "celo",
            degen: "degen-base",
          }
          const id = coinGeckoIds[tokenId] || "ethereum"
          const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
          const data = await response.json()
          setTokenPrice(data[id]?.usd || 0)
        } catch (error) {
          const defaultPrices: Record<string, number> = {
            ETH: 3100,
            BNB: 600,
            MATIC: 0.8,
            USDC: 1,
            USDT: 1,
            DAI: 1,
            AVAX: 35,
            xDAI: 1,
            CELO: 0.5,
            DEGEN: 0.01,
          }
          setTokenPrice(defaultPrices[token] || 3100)
        }
      }
    }
    fetchTokenPrice()
  }, [token])

  useEffect(() => {
    if (amount && token) {
      let balance = 0.00;
      if (mode === "wrap") {
        balance = parseFloat(tokenBalance);
      } else {
        balance = parseFloat(superTokenBalance);
      }

      if (!isNaN(parseFloat(amount))) {
        setAmount(amount)
        if (parseFloat(amount) > balance) {
          setShowInsufficientBalance(true)
        } else {
          setShowInsufficientBalance(false)
        }
      } else {
        setAmount("")
        setShowInsufficientBalance(false)
      }
    } else {
      setAmount("")
      setShowInsufficientBalance(false)
    }
  }, [amount])

  const handleMax = () => {
    if (mode === "wrap") {
      setAmount(tokenBalance)
    } else {
      setAmount(superTokenBalance)
    }
    setShowGasWarning(true)
  }

  const handleWrap = async () => {
    if (typeof window.ethereum === "undefined") {
      notifications.warning("Please install MetaMask")
      return
    }

    if (!token || !amount || parseFloat(amount) <= 0) {
      notifications.warning("Please enter a valid amount")
      return
    }

    setIsProcessing(true)
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const tokenConfig = availableTokens.find((t) => t.symbol === token)
      if (!tokenConfig) {
        notifications.error("Token not found")
        return
      }

      const amountWei = parseUnits(amount, tokenConfig.decimals)

      if (tokenConfig.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
        const superTokenContract = new Contract(tokenConfig.superTokenAddress, SUPER_TOKEN_ABI, signer)
        const tx = await superTokenContract.upgrade(amountWei, { value: amountWei })
        await tx.wait()
      } else {
        const erc20Contract = new Contract(tokenConfig.address, ERC20_ABI, signer)
        const superTokenContract = new Contract(tokenConfig.superTokenAddress, SUPER_TOKEN_ABI, signer)

        const approveTx = await erc20Contract.approve(tokenConfig.superTokenAddress, amountWei)
        await approveTx.wait()

        const upgradeTx = await superTokenContract.upgrade(amountWei)
        await upgradeTx.wait()
      }

      notifications.success(`Successfully wrapped ${amount} ${token} to ${token}x`)
      setAmount("")
      loadBalances()
    } catch (error: any) {
      notifications.error("Failed to wrap tokens")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnwrap = async () => {
    if (typeof window.ethereum === "undefined") {
      notifications.warning("Please install MetaMask")
      return
    }

    if (!token || !amount || parseFloat(amount) <= 0) {
      notifications.warning("Please enter a valid amount")
      return
    }

    setIsProcessing(true)
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const baseSymbol = token.replace("x", "")
      const baseTokenConfig = availableTokens.find((t) => t.symbol === baseSymbol)
      if (!baseTokenConfig) {
        notifications.error("Token not found")
        return
      }

      const superTokenContract = new Contract(baseTokenConfig.superTokenAddress, SUPER_TOKEN_ABI, signer)
      const superDecimals = await superTokenContract.decimals()
      const amountWei = parseUnits(amount, superDecimals)

      const downgradeTx = await superTokenContract.downgrade(amountWei)
      await downgradeTx.wait()

      notifications.success(`Successfully unwrapped ${amount} ${token}x to ${token}`)
      setAmount("")
      loadBalances()
    } catch (error: any) {
      notifications.error("Failed to unwrap tokens")
    } finally {
      setIsProcessing(false)
    }
  }

  const currentNetwork = currentNetworkId ? NETWORK_CONFIGS[currentNetworkId] : null

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-0">
        <div className="relative">
          <div className="absolute top-4 right-4 z-10">
            {currentNetwork ? (
              <NetworkIcon config={currentNetwork} />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center border border-border">
                <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold">E</div>
              </div>
            )}
          </div>

          <div className="p-4 border-b border-border flex gap-2">
            <button
              onClick={() => setMode("wrap")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                mode === "wrap"
                  ? "bg-secondary border border-border text-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Wrap
            </button>
            <button
              onClick={() => setMode("unwrap")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                mode === "unwrap"
                  ? "bg-secondary border border-border text-foreground"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Unwrap
            </button>
          </div>

          <div className="p-4 space-y-4">
            {showGasWarning && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">
                  You are wrapping out of native asset used for gas. You need to leave some gas tokens for the transaction to succeed.
                </p>
              </div>
            )}
            {showInsufficientBalance && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">
                  Balance is not enough. You don't have sufficient tokens to complete this transaction.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <div className="relative bg-secondary/50 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center min-w-0">
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => {
                          setAmount(e.target.value)
                          setShowGasWarning(false)
                        }}
                        placeholder="0.0"
                        style={{ outline: "none" }}
                        className="w-full text-2xl font-semibold bg-transparent p-0 h-auto"
                      />
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ${amount && !isNaN(parseFloat(amount)) ? (parseFloat(amount) * tokenPrice).toFixed(2) : "0.00"}
                    </div>
                  </div>
                  <div>
                    <Select
                      value={token}
                      onValueChange={(value) => {
                        setToken(value)
                        setTokenBalance("0")
                        setSuperTokenBalance("0")
                        setAmount("")
                      }}
                    >
                      <SelectTrigger className="w-[120px] bg-secondary border border-border rounded-lg h-auto py-1">
                        <div className="flex items-center gap-2">
                          {mode === "unwrap" ? (
                            <div className="rotating-border w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
                              <div className="w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full bg-lime/20 flex items-center justify-center relative z-10">
                                {token?.[0] || "E"}
                              </div>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center text-xs font-semibold">
                              {token?.[0] || "E"}
                            </div>
                          )}
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {availableTokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            {mode === "wrap" ? token.symbol : `${token.symbol}x`}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span className="text-muted-foreground">Balance: {isLoadingBalances ? (
                    <Loader2 className="w-3 h-3 inline-block animate-spin ml-1" />
                  ) : (
                    parseFloat(mode === "wrap" ? tokenBalance : superTokenBalance).toFixed(6)
                  )}</span>
                  <button
                    onClick={handleMax}
                    className="text-lime hover:text-lime/80 font-medium"
                    disabled={(mode === "wrap" && parseFloat(tokenBalance) === 0) || (mode === "unwrap") && parseFloat(superTokenBalance) === 0}
                  >
                    MAX
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center relative z-10 -mt-6 -mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-secondary/50 transition-colors">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative bg-secondary/50 border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="text-2xl font-semibold text-muted-foreground">
                      {amount || "0.0"}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      ${amount && !isNaN(parseFloat(amount)) ? (parseFloat(amount) * tokenPrice).toFixed(2) : "0.00"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary border border-border">
                      {mode === "wrap" ? (
                        <div className="rotating-border w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
                          <div className="w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full bg-lime/20 flex items-center justify-center relative z-10">
                            {token?.[0] || "E"}
                          </div>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-lime/20 flex items-center justify-center text-xs font-semibold">
                          {token?.[0] || "E"}
                        </div>
                      )}
                      <span className="text-sm font-medium">{mode === "unwrap" ? token : `${token}x`}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm">
                  <span className="text-muted-foreground">Balance: {isLoadingBalances ? (
                    <Loader2 className="w-3 h-3 inline-block animate-spin ml-1" />
                  ) : (
                    parseFloat(mode === "unwrap" ? tokenBalance : superTokenBalance).toFixed(6)
                  )}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground py-2">
              1 {token} = 1 {token}x (${tokenPrice > 0 ? tokenPrice.toFixed(2) : "0.00"})
            </div>

            <Button
              onClick={mode === "wrap" ? handleWrap : handleUnwrap}
              disabled={isProcessing || !amount || parseFloat(amount) <= 0 || !token}
              className="w-full bg-secondary hover:bg-secondary/80 text-foreground font-semibold h-12"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === "wrap" ? "Wrapping..." : "Unwrapping..."}
                </>
              ) : (
                mode === "wrap" ? "Wrap" : "Unwrap"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})


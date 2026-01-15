"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Database, Loader2, Copy, CheckCircle2, Edit } from "lucide-react"
import { useState, useEffect } from "react"
import { notifications } from "@/utils/toast"
import { LoadingOverlay } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPendingWithdrawals, approveWithdrawal, rejectWithdrawal } from "@/actions/earnings"
import { WrapUnwrap } from "@/components/deposit/wrap-unwrap"
import { NetworkDropdown } from "@/components/deposit/network-dropdown"
import { BrowserProvider, Contract, formatUnits, id, getAddress } from "ethers"
import type { Log } from "ethers"
import { GDAv1ForwarderAddress, GDAv1ForwarderABI } from "@/utils/constants"
import { getTokensForNetwork, type TokenConfig } from "@/utils/token-config"
import { PageHeader } from "@/components/page-header"

import { mockPendingWithdrawals } from "@/data/mock-data"
import { getPoolList, createPool, checkPoolExists } from "@/actions/pool"
import { useAuth } from "@/contexts/auth-context"
import { EditPoolModal } from "@/components/deposit/edit-pool-modal"

const SUPER_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
]


export default function DepositPage() {
  const [flowrate, setFlowrate] = useState("")
  const [flowrateUnit, setFlowrateUnit] = useState("month")
  const [superTokenAddress, setSuperTokenAddress] = useState("")
  const [superTokenBalance, setSuperTokenBalance] = useState("0")
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)
  const [poolAddress, setPoolAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([])
  const [currentNetworkId, setCurrentNetworkId] = useState<string>("")
  const [userAddress, setUserAddress] = useState<string>("")
  const [availableTokens, setAvailableTokens] = useState<TokenConfig[]>([])
  const [token, setToken] = useState<string>("")
  const [tokenPrice, setTokenPrice] = useState(0)
  const [pools, setPools] = useState<any[]>([])
  const [selectedPool, setSelectedPool] = useState<any | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { user } = useAuth()

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
    const fetchData = async () => {
      try {
        const data = await getPoolList(user?.id ? Number(user.id) : 0)
        if (data?.result && Array.isArray(data.pools)) {
          setPools(data.pools)
        }
        const pendingData = await getPendingWithdrawals()
        if (pendingData?.withdrawals) {
          setPendingWithdrawals(pendingData.withdrawals)
        } else {
          setPendingWithdrawals(mockPendingWithdrawals)
        }
      } catch (error) {
        setPendingWithdrawals(mockPendingWithdrawals)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (currentNetworkId) {
      const tokens = getTokensForNetwork(currentNetworkId)
      setAvailableTokens(tokens)
      if (tokens.length > 0) {
        setSuperTokenAddress(tokens[0].superTokenAddress)
        setToken(tokens[0].symbol)
      }
    }
  }, [currentNetworkId])

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
    const loadSuperTokenBalance = async () => {
      if (!currentNetworkId || !userAddress || !superTokenAddress || typeof window.ethereum === "undefined") {
        setSuperTokenBalance("0")
        setIsLoadingBalance(false)
        return
      }

      setIsLoadingBalance(true)
      try {
        const provider = new BrowserProvider(window.ethereum)
        const superTokenContract = new Contract(superTokenAddress, SUPER_TOKEN_ABI, provider)
        const balance = await superTokenContract.balanceOf(userAddress)
        const decimals = await superTokenContract.decimals()
        setSuperTokenBalance(formatUnits(balance, decimals))
      } catch (error) {
        setSuperTokenBalance("0")
      } finally {
        setIsLoadingBalance(false)
      }
    }
    loadSuperTokenBalance()
  }, [currentNetworkId, userAddress, superTokenAddress])

  const handleCreatePool = async () => {
    const exist = await checkPoolExists(superTokenAddress, user?.id ? Number(user.id) : 0)

    if (exist) {
      notifications.error("Pool already exists");
      return;
    }
    
    if (!flowrate || parseFloat(flowrate) <= 0) {
      notifications.error("Please enter a valid flowrate")
      return
    }

    if (!superTokenAddress) {
      notifications.error("Please select a super token")
      return
    }

    if (typeof window.ethereum === "undefined") {
      notifications.warning("Please install MetaMask")
      return
    }

    setIsProcessing(true)

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const adminAddress = await signer.getAddress()

      const forwarderAddress = GDAv1ForwarderAddress
      if (!forwarderAddress) {
        notifications.error("Forwarder address not configured")
        return
      }

      const forwarderABI = GDAv1ForwarderABI
      if (!forwarderABI) {
        notifications.error("Forwarder ABI not configured")
        return
      }

      const poolCreateEvent = 'PoolCreated(address,address,address)'
      const hash = id(poolCreateEvent);

      const contract = new Contract(forwarderAddress, forwarderABI, signer);

      const config = {
        transferabilityForUnitsOwner: 0,
        distributionFromAnyAddress: false
      };

      const tx = await contract.createPool(superTokenAddress, adminAddress, config);
      const receipt = await tx.wait();

      const poolLog = receipt.logs.find((log: Log) => hash === log.topics[0]);

      if (poolLog) {
        const poolAddress = getAddress('0x' + poolLog.data.slice(26));
        setPoolAddress(poolAddress)
        notifications.success('Pool created successfully!');
        await createPool({
          super_token_address: superTokenAddress,
          address: poolAddress,
          flow_rate: parseFloat(flowrate),
          flow_rate_unit: flowrateUnit,
          token: token,
          user: {
            id: user?.id ? Number(user.id) : 0,
          }
        } as any);
      }
    } catch (error: any) {
      console.error("Error creating pool:", error)
      let errorMessage = "Failed to create pool"
      if (error?.code === "CALL_EXCEPTION" || error?.message?.includes("missing revert data") || error?.message?.includes("execution reverted")) {
        errorMessage = "Pool creation failed. The pool may already exist for this token and admin, or the super token address is invalid."
      } else if (error?.data?.message) {
        errorMessage = error.data.message
      } else if (error?.reason) {
        errorMessage = error.reason
      } else if (error?.message) {
        errorMessage = error.message
      }
      notifications.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyPoolAddress = () => {
    if (poolAddress) {
      navigator.clipboard.writeText(poolAddress)
      notifications.success("Pool address copied to clipboard")
    }
  }

  const handlePoolUpdateSuccess = async (flowRate: number, flowRateUnit: string) => {
    let temp = [...pools]
    const index = temp.findIndex((pool: any) => pool.id === selectedPool?.id);
    if (index !== -1) {
      temp[index] = {
        ...temp[index],
        flow_rate: flowRate,
        flow_rate_unit: flowRateUnit,
      }
    }
    setPools(temp)
    setIsEditModalOpen(false)
    setSelectedPool(null)
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <LoadingOverlay isLoading={true} message="Loading..." />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <LoadingOverlay isLoading={isProcessing} message="Creating pool..." />

        <main className="pl-0 lg:pl-64">
          <PageHeader
            title="Deposit"
            description="Create a new pool with flowrate and super token"
          />
          <div className="sticky top-[73px] z-30 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex items-center justify-end px-4 sm:px-6 py-3 pl-16 lg:pl-4">
              <NetworkDropdown />
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WrapUnwrap />

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Create Pool
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Flowrate</label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="0.00"
                        value={flowrate}
                        onChange={(e) => setFlowrate(e.target.value)}
                        className="bg-secondary border-border flex-1"
                        disabled={isProcessing}
                      />
                      <select
                        value={flowrateUnit}
                        onChange={(e) => setFlowrateUnit(e.target.value)}
                        className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground w-32"
                        disabled={isProcessing}
                      >
                        <option value="sec">/second</option>
                        <option value="min">/minute</option>
                        <option value="hour">/hour</option>
                        <option value="day">/day</option>
                        <option value="week">/week</option>
                        <option value="month">/month</option>
                        <option value="year">/year</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="relative bg-secondary/50 border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="text-2xl font-semibold text-muted-foreground">
                            {superTokenBalance || "0.0"}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            ${superTokenBalance && !isNaN(parseFloat(superTokenBalance)) ? (parseFloat(superTokenBalance) * tokenPrice).toFixed(2) : "0.00"}
                          </div>
                        </div>
                        <div>
                          <Select
                            value={token}
                            onValueChange={(value) => {
                              setToken(value)
                              setSuperTokenAddress(availableTokens.find((token) => token.symbol === value)?.superTokenAddress || "")
                            }}
                          >
                            <SelectTrigger className="w-[120px] bg-secondary border border-border rounded-lg h-auto py-1">
                              <div className="flex items-center gap-2">
                                <div className="rotating-border w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold">
                                  <div className="w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full bg-lime/20 flex items-center justify-center relative z-10">
                                    {token?.[0] || "E"}
                                  </div>
                                </div>
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {availableTokens.map((token) => {
                                const superSymbol = `${token.symbol}x`
                                return (
                                  <SelectItem key={superSymbol} value={token.symbol}>
                                    {superSymbol}
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2 text-sm">
                        <span className="text-muted-foreground">Balance: {isLoadingBalance ? (
                          <Loader2 className="w-3 h-3 inline-block animate-spin ml-1" />
                        ) : (
                          parseFloat(superTokenBalance).toFixed(6)
                        )}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleCreatePool}
                    className="w-full bg-lime hover:bg-lime/90 text-background font-semibold"
                    disabled={isProcessing || !flowrate || !superTokenAddress}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Database className="w-4 h-4 mr-2" />
                        Create Pool
                      </>
                    )}
                  </Button>
                  <div className="space-y-4">
                    {poolAddress ? (
                      <>
                        <div className="p-3 rounded-lg bg-lime/10 border border-lime/20">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-lime" />
                            <span className="text-sm font-medium text-lime">Pool Created Successfully</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-mono text-sm break-all text-foreground">{poolAddress}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleCopyPoolAddress}
                              className="shrink-0 hover:bg-lime/20"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No pool created yet</p>
                        <p className="text-xs mt-1">Create a pool to see the address here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Pools Created By You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pools.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No created pools</div>
                  ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                      <div className="min-w-[700px]">
                        <div className="grid grid-cols-5 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
                          <div>Token</div>
                          <div>Address</div>
                          <div>Flow rate</div>
                          <div>Unit</div>
                          <div className="text-right">Actions</div>
                        </div>
                        {pools.map((pool: any) => (
                          <div
                            key={pool.id}
                            className="grid grid-cols-5 gap-4 px-4 py-3 rounded-lg items-center hover:bg-secondary/50 transition-colors"
                          >
                            <div className="font-medium">{pool.token}</div>
                            <div className="font-semibold">{pool.address.slice(0, 6)}...{pool.address.slice(-4)}</div>
                            <div>{pool.flow_rate}</div>
                            <div>{pool.flow_rate_unit}</div>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPool(pool)
                                  setIsEditModalOpen(true)
                                }}
                                className="bg-lime/10 text-lime border-lime/20 hover:bg-lime/20"
                              >
                                <Edit /> Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Pending Withdrawal Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingWithdrawals.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No pending withdrawals</div>
                  ) : (
                    <div className="overflow-x-auto custom-scrollbar">
                      <div className="min-w-[700px]">
                        <div className="grid grid-cols-6 gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border">
                          <div className="col-span-2">User</div>
                          <div>Amount</div>
                          <div>Token</div>
                          <div>Date</div>
                          <div className="text-right ml-4">Actions</div>
                        </div>
                        {pendingWithdrawals.map((withdrawal: any) => (
                          <div
                            key={withdrawal.id}
                            className="grid grid-cols-6 gap-4 px-4 py-3 rounded-lg items-center hover:bg-secondary/50 transition-colors"
                          >
                            <div className="col-span-2">
                              <p className="font-medium">{(withdrawal as any).name || withdrawal.username || "user"}</p>
                              <p className="text-xs text-muted-foreground">@{withdrawal.username || "user"}</p>
                            </div>
                            <div className="font-semibold">{withdrawal.amount}</div>
                            <div>{withdrawal.token}</div>
                            <div className="text-sm text-muted-foreground">{new Date(withdrawal.createdAt).toLocaleDateString()}</div>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  const result = await approveWithdrawal(withdrawal.id)
                                  if (result) {
                                    const pendingData = await getPendingWithdrawals()
                                    if (pendingData?.withdrawals) {
                                      setPendingWithdrawals(pendingData.withdrawals)
                                    }
                                  }
                                }}
                                className="bg-lime/10 text-lime border-lime/20 hover:bg-lime/20"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  const result = await rejectWithdrawal(withdrawal.id)
                                  if (result) {
                                    const pendingData = await getPendingWithdrawals()
                                    if (pendingData?.withdrawals) {
                                      setPendingWithdrawals(pendingData.withdrawals)
                                    }
                                  }
                                }}
                                className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                              >
                                Reject
                              </Button>
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
        </main>
      </div>
      <EditPoolModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        pool={selectedPool}
        onSuccess={handlePoolUpdateSuccess}
      />
    </AuthGuard>
  )
}


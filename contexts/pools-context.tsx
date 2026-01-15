"use client"

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"

interface Pool {
  address: string
  superTokenAddress: string
  superTokenSymbol: string
  networkId: string
  createdAt: number
}

interface PoolsContextType {
  pools: Pool[]
  addPool: (pool: Pool) => void
  removePool: (address: string) => void
  getPoolsByNetwork: (networkId: string) => Pool[]
}

const PoolsContext = createContext<PoolsContextType | undefined>(undefined)

export function PoolsProvider({ children }: { children: ReactNode }) {
  const [pools, setPools] = useState<Pool[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("pollenfi_pools")
    if (stored) {
      try {
        setPools(JSON.parse(stored))
      } catch (error) {
      }
    }
  }, [])

  const addPool = useCallback((pool: Pool) => {
    setPools((prev) => {
      const updated = [...prev, pool]
      localStorage.setItem("pollenfi_pools", JSON.stringify(updated))
      return updated
    })
  }, [])

  const removePool = useCallback((address: string) => {
    setPools((prev) => {
      const updated = prev.filter((p) => p.address !== address)
      localStorage.setItem("pollenfi_pools", JSON.stringify(updated))
      return updated
    })
  }, [])

  const getPoolsByNetwork = useCallback(
    (networkId: string) => {
      return pools.filter((p) => p.networkId === networkId)
    },
    [pools]
  )

  const value = useMemo(
    () => ({
      pools,
      addPool,
      removePool,
      getPoolsByNetwork,
    }),
    [pools, addPool, removePool, getPoolsByNetwork]
  )

  return <PoolsContext.Provider value={value}>{children}</PoolsContext.Provider>
}

export function usePools() {
  const context = useContext(PoolsContext)
  if (context === undefined) {
    throw new Error("usePools must be used within a PoolsProvider")
  }
  return context
}


"use client"

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"
import type { Campaign } from "@/types"

interface CampaignsContextType {
  campaigns: Campaign[]
  setCampaigns: (campaigns: Campaign[] | ((prev: Campaign[]) => Campaign[])) => void
  addCampaign: (campaign: Campaign) => void
  updateCampaign: (id: number, campaign: Campaign) => void
  removeCampaign: (id: number) => void
  getCampaignById: (id: number) => Campaign | null
}

const CampaignsContext = createContext<CampaignsContextType | undefined>(undefined)

export function CampaignsProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaignsState] = useState<Campaign[]>([])

  const setCampaigns = useCallback((value: Campaign[] | ((prev: Campaign[]) => Campaign[])) => {
    if (typeof value === "function") {
      setCampaignsState(value)
    } else {
      setCampaignsState(value)
    }
  }, [])

  const addCampaign = useCallback((campaign: Campaign) => {
    setCampaignsState((prev) => [...prev, campaign])
  }, [])

  const updateCampaign = useCallback((id: number, campaign: Campaign) => {
    setCampaignsState((prev) => prev.map((c) => (c.id === id ? campaign : c)))
  }, [])

  const removeCampaign = useCallback((id: number) => {
    setCampaignsState((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const getCampaignById = useCallback(
    (id: number) => {
      return campaigns.find((c) => c.id === id) || null
    },
    [campaigns]
  )

  const value = useMemo(
    () => ({
      campaigns,
      setCampaigns,
      addCampaign,
      updateCampaign,
      removeCampaign,
      getCampaignById,
    }),
    [campaigns, addCampaign, updateCampaign, removeCampaign, getCampaignById]
  )

  return <CampaignsContext.Provider value={value}>{children}</CampaignsContext.Provider>
}

export function useCampaigns() {
  const context = useContext(CampaignsContext)
  if (context === undefined) {
    throw new Error("useCampaigns must be used within a CampaignsProvider")
  }
  return context
}


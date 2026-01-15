"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { CampaignCard } from "@/components/campaigns/campaign-card"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, SlidersHorizontal, Plus, Loader2 } from "lucide-react"
import { LoadingOverlay } from "@/components/ui/spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCampaigns } from "@/contexts/campaigns-context"
import { mockCampaigns } from "@/data/mock-data"
import type { Campaign } from "@/types"
import Link from "next/link"
import { getCampaignList } from "@/actions/campaigns"
import { useDebounce } from "@/hooks/use-debounce"

export default function CampaignsPage() {
  const { loading, user } = useAuth()
  const { campaigns, setCampaigns } = useCampaigns()
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const isAdmin = user?.account_type === "Admin"

  const loadCampaigns = async (pageNum: number, append: boolean = false) => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    try {
      const data = await getCampaignList(pageNum, 12)
      if (data.result && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
        const filtered = data.campaigns.filter((item: Campaign) => item != null && item !== undefined && item.id != null && item.name != null)
        if (append) {
          setCampaigns((prev) => [...prev, ...filtered])
        } else {
          setCampaigns(filtered)
        }
        if (data.pagination) {
          setHasMore(pageNum < data.pagination.totalPages)
        } else {
          setHasMore(false)
        }
      } else {
        setCampaigns(mockCampaigns)
        setHasMore(false)
      }
    } catch (error) {
      if (pageNum === 1 && campaigns.length === 0) {
        setCampaigns(mockCampaigns)
        setHasMore(false)
      }
    } finally {
      setIsLoadingMore(false)
      setIsInitialLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns(1, false)
  }, [])

  useEffect(() => {
    if (debouncedSearchTerm) {
      const searchCampaigns = async () => {
        setIsSearching(true)
        setIsLoadingMore(true)
        try {
          const data = await getCampaignList(1, 12, debouncedSearchTerm)
          if (data.result && Array.isArray(data.campaigns)) {
            const filtered = data.campaigns.filter((item: Campaign) => item != null && item !== undefined && item.id != null && item.name != null)
            setCampaigns(filtered)
            setHasMore(false)
          }
        } catch (error) {
        } finally {
          setIsLoadingMore(false)
          setIsSearching(false)
        }
      }
      searchCampaigns()
    } else {
      setIsSearching(false)
      loadCampaigns(1, false)
    }
  }, [debouncedSearchTerm])

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadCampaigns(nextPage, true)
    }
  }

  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedHandleScroll = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 300) {
        handleLoadMore()
      }
    }, 100)
  }, [hasMore, isLoadingMore, page])

  useEffect(() => {
    if (!hasMore || isLoadingMore) return
    window.addEventListener('scroll', debouncedHandleScroll)
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [hasMore, isLoadingMore, debouncedHandleScroll])

  if (loading || isInitialLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Sidebar />
          <LoadingOverlay isLoading={true} message="Loading campaigns..." />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Sidebar />

        <main className="pl-0 lg:pl-64">
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="px-4 sm:px-20 py-4 pl-16 lg:pl-4 flex items-start justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Campaigns</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {loading ? "Loading..." : isAdmin ? "Manage your campaigns" : "Browse and join active promotion campaigns"}
                </p>
              </div>
              {isAdmin && (
                <div className="flex justify-end">
                  <div className="relative">
                    <Button asChild className="bg-gradient-to-r from-cyan to-lime text-background">
                      <Link href="/campaigns/create">
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Create Campaign</span>
                        <span className="sm:hidden">Create</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </header>
          <div className="px-4 sm:px-6 py-4 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                {isSearching ? (
                  <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                )}
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-6">
            {campaigns.length === 0 ? (
              <EmptyState
                icon={<Sparkles className="w-12 h-12 text-muted-foreground" />}
                title={debouncedSearchTerm ? "No campaigns found" : "No campaigns available"}
                description={debouncedSearchTerm ? "Try adjusting your search terms" : "Check back later for new campaigns"}
              />
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id}>
                      <CampaignCard campaign={campaign} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center py-8">
                  {isLoadingMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm">Loading more campaigns...</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}

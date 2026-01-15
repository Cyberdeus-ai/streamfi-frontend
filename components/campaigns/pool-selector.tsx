"use client"

import { memo, useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Database } from "lucide-react"
import { getPoolList } from "@/actions/pool"
import { useAuth } from "@/contexts/auth-context"

export const PoolSelector = memo(function PoolSelector({
  onPoolSelect,
}: {
  onPoolSelect?: (poolId: number) => void
}) {
  const { user } = useAuth()
  const [pools, setPools] = useState<{ id: number; token: string; address: string }[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPoolList(Number(user?.id))
      if (data.result && Array.isArray(data.pools)) setPools(data.pools.map((pool: any) => ({ id: pool.id, address: pool.address, token: pool.token })))
    }
    fetchData()
  }, [user?.id])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Database className="w-5 h-5" />
          Pool Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Select Pool</label>
          <Select
            onValueChange={(value) => {
              onPoolSelect?.(Number(value))
            }}
            disabled={pools.length === 0}
          >
            <SelectTrigger className="bg-secondary border-border">
              <SelectValue placeholder={pools.length === 0 ? "No pools available" : "Select a pool"} />
            </SelectTrigger>
            <SelectContent>
              {pools.map((pool) => (
                <SelectItem key={pool.id} value={pool.id.toString()}>
                  <div className="flex items-center gap-2">
                    <span>{pool.token}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      ({pool.address.slice(0, 6)}...{pool.address.slice(-4)})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {pools.length === 0 && (
          <div className="text-sm text-muted-foreground p-3 rounded-lg bg-secondary/50">
            No pools found for this network. Create a pool in Settings.
          </div>
        )}
      </CardContent>
    </Card>
  )
})


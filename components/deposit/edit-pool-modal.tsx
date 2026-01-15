"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { updatePool } from "@/actions/pool"
import { notifications } from "@/utils/toast"

interface EditPoolModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pool: {
    id: number
    flow_rate: number
    flow_rate_unit: string
  } | null
  onSuccess: (flowrate: number, flowrateUnit: string) => void
}

export function EditPoolModal({ open, onOpenChange, pool, onSuccess }: EditPoolModalProps) {
  const [flowrate, setFlowrate] = useState("")
  const [flowrateUnit, setFlowrateUnit] = useState("month")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (pool) {
      setFlowrate(pool.flow_rate?.toString() || "")
      setFlowrateUnit(pool.flow_rate_unit || "month")
    }
  }, [pool])

  const handleUpdate = async () => {
    if (!pool) return

    if (!flowrate || parseFloat(flowrate) <= 0) {
      notifications.error("Please enter a valid flowrate")
      return
    }

    setIsUpdating(true)

    try {
      const data = await updatePool(pool.id, {
        flowRate: parseFloat(flowrate),
        flowRateUnit: flowrateUnit
      } as any)

      if (data?.result) {
        notifications.success("Pool updated successfully")
        onSuccess(parseFloat(flowrate), flowrateUnit)
        onOpenChange(false)
      }
    } catch (error: any) {
      notifications.error(error.message || "Failed to update pool")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Edit Pool Flow Rate</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Flowrate</label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="0.00"
                value={flowrate}
                onChange={(e) => setFlowrate(e.target.value)}
                className="bg-secondary border-border flex-1"
                disabled={isUpdating}
              />
              <select
                value={flowrateUnit}
                onChange={(e) => setFlowrateUnit(e.target.value)}
                className="px-3 py-2 rounded-md bg-secondary border border-border text-foreground w-32"
                disabled={isUpdating}
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
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
            className="bg-secondary border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || !flowrate}
            className="bg-lime hover:bg-lime/90 text-background font-semibold"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


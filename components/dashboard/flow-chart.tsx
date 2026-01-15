"use client"

import { memo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { time: "00:00", flow: 0.018 },
  { time: "04:00", flow: 0.021 },
  { time: "08:00", flow: 0.024 },
  { time: "12:00", flow: 0.028 },
  { time: "16:00", flow: 0.032 },
  { time: "20:00", flow: 0.035 },
  { time: "Now", flow: 0.0276 },
]

export const FlowChart = memo(function FlowChart({ flowRateList }: { flowRateList: { time: string, flow: number }[] }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Flow Rate (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={flowRateList}>
              <defs>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.85 0.18 195)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.85 0.18 195)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0.02 280)", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "oklch(0.65 0.02 280)", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.15 0.06 280)",
                  border: "1px solid oklch(0.25 0.06 280)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "oklch(0.95 0.01 280)" }}
                itemStyle={{ color: "oklch(0.85 0.18 195)" }}
                formatter={(value: number) => [`$${value}/sec`, "Flow Rate"]}
              />
              <Area
                type="monotone"
                dataKey="flow"
                stroke="oklch(0.85 0.18 195)"
                strokeWidth={2}
                fill="url(#flowGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Next recalculation</p>
            <p className="text-lg font-mono font-semibold">04:23:17</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Until midnight UTC</p>
            <p className="text-xs text-cyan">Flow rates update daily</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

"use client"

import { useEffect, useState, memo } from "react"

interface StreamingCounterProps {
  value: number
  prefix?: string
  decimals?: number
  increment?: number
  interval?: number
}

export const StreamingCounter = memo(function StreamingCounter({
  value,
  prefix = "",
  decimals = 2,
  increment = 0.01,
  interval = 50,
}: StreamingCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    setDisplayValue(value)
  }, [value])

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayValue((prev) => prev + increment)
    }, interval)

    return () => clearInterval(timer)
  }, [increment, interval])

  return (
    <>
      {prefix}
      {displayValue.toFixed(decimals)}
    </>
  )
})


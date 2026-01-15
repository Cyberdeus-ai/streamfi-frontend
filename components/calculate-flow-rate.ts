export const calculateMonthlyRate = (flowRate: number | undefined, unit: string | undefined): number => {
    if (!flowRate || !unit) return 0

    const unitLower = unit.toLowerCase()
    const secondsPerMonth = 30 * 24 * 60 * 60

    if (unitLower === "second") {
        return flowRate * secondsPerMonth
    } else if (unitLower === "minute") {
        return flowRate * 43200
    } else if (unitLower === "hour") {
        return flowRate * 720
    } else if (unitLower === "day") {
        return flowRate * 30
    } else if (unitLower === "week") {
        return flowRate * 4.2857
    } else if (unitLower === "month") {
        return flowRate
    } else if (unitLower === "year") {
        return flowRate / 12
    }

    return 0
}

export const calculateRealTimeFlow = (flowRate: number | undefined, unit: string | undefined, elapsedSeconds: number): number => {
    if (!flowRate || !unit) return 0
    
    const unitLower = unit.toLowerCase()
    let perSecond = 0
    
    if (unitLower === "second" || unitLower === "sec" || unitLower === "seconds") {
        perSecond = flowRate
    } else if (unitLower === "minute" || unitLower === "min" || unitLower === "minutes") {
        perSecond = flowRate / 60
    } else if (unitLower === "hour" || unitLower === "hr" || unitLower === "hours") {
        perSecond = flowRate / 3600
    } else if (unitLower === "day" || unitLower === "days") {
        perSecond = flowRate / 86400
    } else if (unitLower === "month" || unitLower === "mo" || unitLower === "months") {
        perSecond = flowRate / (30 * 24 * 60 * 60)
    } else if (unitLower === "week" || unitLower === "weeks") {
        perSecond = flowRate / (7 * 24 * 60 * 60)
    } else if (unitLower === "year" || unitLower === "years") {
        perSecond = flowRate / (365 * 24 * 60 * 60)
    }
    
    return perSecond * elapsedSeconds
}
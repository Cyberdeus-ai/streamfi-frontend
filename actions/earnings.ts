import api from "@/utils/api"

export const getEarnings = async () => {
  const response = await api.get("/earnings")
  return { 
    result: response.data.result, 
    earnings: response.data.earnings || [],
    history: response.data.history || [],
    total: response.data.total || 0
  }
}

export const getPoolBalance = async () => {
  const response = await api.get("/earnings/pool")
  return { 
    result: response.data.result, 
    total: response.data.total || 0,
    available: response.data.available || 0,
    locked: response.data.locked || 0
  }
}

export const deposit = async (amount: string | number, token: string) => {
  const response = await api.post("/earnings/deposit", { amount, token })
  return { result: response.data.result }
}

export const requestWithdrawal = async (amount: string | number, token: string) => {
  const response = await api.post("/earnings/withdrawal/request", { amount, token })
  return { result: response.data.result }
}

export const getWithdrawals = async () => {
  const response = await api.get("/earnings/withdrawals")
  return { result: response.data.result, withdrawals: response.data.withdrawals || [] }
}

export const getPendingWithdrawals = async () => {
  const response = await api.get("/earnings/withdrawals/pending")
  return { result: response.data.result, withdrawals: response.data.withdrawals || [] }
}

export const approveWithdrawal = async (id: string) => {
  const response = await api.post(`/earnings/withdrawals/${id}/approve`)
  return { result: response.data.result }
}

export const rejectWithdrawal = async (id: string) => {
  const response = await api.post(`/earnings/withdrawals/${id}/reject`)
  return { result: response.data.result }
}


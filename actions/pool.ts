import api from "@/utils/api"

export async function getPoolList(userId: number) {
  const response = await api.get(`/pool/${userId}`)
  return response.data
}

export async function checkPoolExists(superTokenAddress: string, userId: number) {
  const response = await api.post("/pool/check", {
    superTokenAddress: superTokenAddress,
    userId: userId
  })
  return response.data.result
}

export async function createPool(data: { address: string, flow_rate: number, flow_rate_unit: string, token: string }) {
  const response = await api.post("/pool", data)
  return response.data
}

export async function updatePool(id: number, data: { flow_rate: number, flow_rate_unit: string }) {
  const response = await api.put(`/pool/${id}`, data)
  return response.data
}


import api from "@/utils/api"

export async function getAdminDashboardData(userId: number) {
  const response = await api.get(`/dashboard/admin/${userId}`)
  return response.data
}

export async function getPromoterDashboardData(userId: number) {
  const response = await api.get(`/dashboard/promoter/${userId}`)
  return response.data
}
import api from "@/utils/api"

export const getReferrals = async (userId: number) => {
  const response = await api.get(`/referrals/${userId}`)
  return response.data
}
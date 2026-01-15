import api from "@/utils/api"

export const getReferrals = async (userId: number) => {
  const response = await api.get(`/referrals/promoter/${userId}`)
  return response.data
}

export const getCampaignReferrals = async (userId: number) => {
  const response = await api.get(`/referrals/admin/${userId}`)
  return response.data
}
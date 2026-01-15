import api from "@/utils/api"

export const joinCampaign = async (campaignId: number, userId: number, twitterReferer: string) => {
  const response = await api.post("/join", {
    campaign_id: campaignId,
    user_id: userId,
    twitter_referer: twitterReferer
  })
  return response.data
}

export const getOversightUsers = async () => {
  const response = await api.get("/oversight/users")
  return response.data
}

export const updateUserStatus = async (userId: number, data: any) => {
  const response = await api.put(`/oversight/users/${userId}`, data)
  return response.data
}
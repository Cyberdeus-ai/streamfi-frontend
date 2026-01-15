import api from "@/utils/api"

export const joinCampaign = async (campaignId: number, userId: number, twitterReferer: string) => {
  const response = await api.post("/join", {
    campaign_id: campaignId,
    user_id: userId,
    twitter_referer: twitterReferer
  })
  return response.data
}
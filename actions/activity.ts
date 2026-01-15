import api from "@/utils/api"

export const getActivityFeed = async (page?: number, limit?: number) => {
  const response = await api.get("/activity/feed", { params: { page, limit } })
  return { result: response.data.result, activities: response.data.activities || [] }
}


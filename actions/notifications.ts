import api from "@/utils/api"

export const getNotifications = async () => {
  const response = await api.get("/notifications")
  return { result: response.data.result, notifications: response.data.notifications || [] }
}

export const markAsRead = async (id: string | number) => {
  const response = await api.post(`/notifications/${id}/read`)
  return { result: response.data.result }
}

export const markAllAsRead = async () => {
  const response = await api.post("/notifications/read-all")
  return { result: response.data.result }
}


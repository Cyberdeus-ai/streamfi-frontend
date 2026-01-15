import api from "@/utils/api"

export const updateProfile = async (profile: any) => {
  const response = await api.put("/profile", profile)
  return { result: response.data.result, user: response.data.user, token: response.data.token }
}

export const deleteAccount = async () => {
  const response = await api.delete("/profile")
  return { result: response.data.result }
}


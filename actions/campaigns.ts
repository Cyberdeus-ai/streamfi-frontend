import api from "@/utils/api"
import type { Campaign } from "@/types"

export async function getCampaignList(page: number = 1, limit: number = 12, search: string = "") {
  const response = await api.get("/campaign", { params: { page, limit, search } })
  return response.data
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  const response = await api.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data.imageUrl
}

export async function createCampaign(data: Partial<Campaign>) {
  const response = await api.post("/campaign", data)
  return response.data
}

export async function updateCampaign(id: number, data: Partial<Campaign>) {
  const response = await api.put(`/campaign/${id}`, data)
  return response.data
}

export async function deleteCampaign(id: number) {
  const response = await api.delete(`/campaign/${id}`)
  return response.data
}

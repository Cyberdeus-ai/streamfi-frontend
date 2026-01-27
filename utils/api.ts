import axios from "axios"
import { setApiInstance } from "./setAuthToken"
import { notifications } from "./toast"

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
})

setApiInstance(api)

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const message = error.response?.data.error

    if (status === 401) {
      notifications.error("Session expired. Please sign in again.")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("pollenfi_user")
      window.location.href = "/login"
    }

    if (status === 429) {
      notifications.error("Too many requests. Please try again later.")
    } else if (status === 400) {
      notifications.error(message || "Bad Request")
    } else if (status === 403) {
      notifications.error(message || "Access forbidden")
    } else if (status === 404) {
      notifications.error(message || "Not Found")
    } else if (status === 409) {
      notifications.error(message || "Conflict")
    } else if (status === 500) {
      notifications.error("Server error. Please try again later.")
    } else if (error.code === "NETWORK_ERROR" || !error.response) {
      notifications.error("Network error. Please check your connection.")
    }

    return Promise.reject(error)
  }
)

export default api


let apiInstance: any = null

export function setApiInstance(api: any) {
  apiInstance = api
}

export function setAuthToken(token?: string) {
  if (token) {
    if (apiInstance) {
      apiInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }
    localStorage.setItem("accessToken", token)
  } else {
    if (apiInstance) {
      delete apiInstance.defaults.headers.common["Authorization"]
    }
    localStorage.removeItem("accessToken")
  }
}


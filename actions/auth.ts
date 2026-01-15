import api from "@/utils/api"

export async function getNonce() {
  const response = await api.get("/auth/nonce")
  return response.data
}

export async function verify(message: string, signature: string, nonce: string, address: string) {
  const response = await api.post("/auth/verify", { message, signature, nonce, address })
  return response.data
}

export async function signUp(address: string, twitterAccount: string) {
  const response = await api.post("/auth/signup", { address, twitterAccount })
  return { result: response.data.result, userId: response.data.userId }
}

export async function setAccountType(userId: string, accountType: "Admin" | "Promoter") {
  const response = await api.post("/auth/accounttype", { userId, accountType })
  return response.data
}

export async function signIn(address: string) {
  const response = await api.post("/auth/signin", { address })
  return { result: response.data.result, user: response.data.user, token: response.data.token }
}

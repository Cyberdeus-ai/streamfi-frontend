"use client"

import { useState, useCallback } from "react"
import { BrowserProvider } from "ethers"
import { SiweMessage } from "siwe"
import { getNonce, verify } from "@/actions/auth"
import { notifications } from "@/utils/toast"

export function useSiwe() {
  const [isLoading, setIsLoading] = useState(false)
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const scheme: string = typeof window !== 'undefined' ? window.location.protocol.slice(0, -1) : ''
  const domain: string = typeof window !== 'undefined' ? window.location.host : ''
  const origin: string = typeof window !== 'undefined' ? window.location.origin : ''

  const createSiweMessage = async (
    address: string,
    statement: string
  ): Promise<{ message: string; nonce: string } | null> => {
    const data = await getNonce()
    if (data?.result) {
      const message = new SiweMessage({
        scheme,
        domain,
        address,
        statement,
        uri: origin,
        version: '1',
        chainId: 1,
        nonce: data.nonce,
      })
      return {
        message: message.prepareMessage(),
        nonce: data.nonce as string,
      }
    }
    return null
  }

  const signInWithEthereum = async (): Promise<{ success: boolean; address?: string }> => {
    setIsLoading(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask or another Ethereum wallet is required")
      }

      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[]
      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      const siwe = await createSiweMessage(
        address,
        'Sign up with wallet to the app.'
      )

      if (!siwe) {
        setError('Failed to create SIWE message.')
        notifications.error('Failed to create SIWE message.')
        return { success: false }
      }

      const { message, nonce } = siwe

      const signature = await signer.signMessage(message)

      const data = await verify(message, signature, nonce, address)

      if (data.result) {
        setAccount(address)
        return { success: true, address }
      }

      throw new Error("Verification failed")
    } catch (err: any) {
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    account,
    error,
    signInWithEthereum,
  }
}
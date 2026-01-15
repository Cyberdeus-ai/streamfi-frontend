import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "@/contexts/auth-context"
import { CampaignsProvider } from "@/contexts/campaigns-context"
import { PoolsProvider } from "@/contexts/pools-context"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "PollenFi - Talk Tokens. Earn Every Second.",
  description:
    "The SocialFi platform that rewards promoters with streamed crypto for genuine X engagement. Turn every authentic conversation into instant, shared value.",
  generator: "v0.app",
}

export const viewport = {
  themeColor: "#0F0F1A",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <CampaignsProvider>
            <PoolsProvider>
          {children}
            </PoolsProvider>
          </CampaignsProvider>
        </AuthProvider>
        <Toaster position="top-right" containerStyle={{ top: 80 }} />
        <Analytics />
      </body>
    </html>
  )
}

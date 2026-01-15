export type User = {
  id?: number
  name?: string
  username?: string
  email?: string
  address?: string
  avatar?: string
  rank?: number
  rank_growth?: number
  points?: number
  points_growth?: number
  referrals?: number
  referrals_growth?: number
  earnings_growth?: number
  flow_rate?: number
  account_type?: "Admin" | "Promoter"
  campaigns_growth?: number
}

export type Pool = {
  id?: number,
  token?: string,
  address?: string,
  flow_rate?: number,
  flow_rate_unit?: string
}

export type Campaign = {
  id?: number
  name?: string
  description?: string
  logo?: string
  website?: string
  twitter?: string
  about?: string
  guidelines?: string[]
  templates?: { type: string; title: string; preview: string }[]
  quote?: number
  comment?: number
  repost?: number
  start_date?: Date | string
  end_date?: Date | string
  hashtags?: string[]
  tickers?: string[]
  big_accounts?: string[]
  promoters?: number
  user: { id: number }
  pool: Pool
  created_at?: Date | string
  updated_at?: Date | string
}

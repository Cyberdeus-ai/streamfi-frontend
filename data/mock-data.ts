import type { Campaign } from "@/types"
import { MessageCircle, Repeat2, Quote, Trophy, TrendingUp, AlertCircle, Coins, Users, Sparkles, AtSign } from "lucide-react"

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Aave Protocol",
    logo: "/aave-defi-protocol-logo.jpg",
    description:
      "Aave is a decentralized non-custodial liquidity protocol where users can participate as suppliers or borrowers. Promote Aave's V3 features, GHO stablecoin, and governance proposals to earn streamed AAVE tokens.",
    promoters: 2847,
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    website: "https://aave.com",
    twitter: "@aaborrowss",
    hashtags: ["#Aave", "#DeFi", "#Lending"],
    tickers: ["AAVE"],
    about: `Aave is a decentralized money market protocol where users can lend and borrow crypto assets. 

    Key talking points:
    • Aave V3 brings capital efficiency with E-Mode and Portal
    • GHO is Aave's decentralized stablecoin
    • Aave DAO governs all protocol parameters
    • Multi-chain deployment on Ethereum, Arbitrum, Optimism, and more`,
    guidelines: [
      "Focus on V3 features and benefits",
      "Highlight GHO stablecoin utility",
      "Share governance participation stories",
      "Use official brand assets only",
      "Always disclose promotional relationship",
    ],
    quote: 6,
    comment: 5,
    repost: 4,
    templates: [
      {
        type: "Thread",
        title: "Why Aave V3 is a game changer",
        preview: "🧵 Thread: 5 reasons Aave V3 is revolutionizing DeFi lending...",
      },
      {
        type: "Meme",
        title: "GHO vs other stablecoins",
        preview: "Comparison meme template ready to customize...",
      },
      {
        type: "Infographic",
        title: "Aave by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      },
    ],
    big_accounts: ["eth_believer", "defi_queen", "nft_maxi"],
    pool: { id: 1, token: "AAVE", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", flow_rate: 50000, flow_rate_unit: "month" },
    user: { id: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Uniswap Protocol",
    description: "Uniswap is a decentralized exchange (DEX) that enables users to swap, trade, and provide liquidity for various cryptocurrencies without relying on a centralized authority.",
    logo: "/uniswap-dex-logo-pink.jpg",
    website: "https://uniswap.org",
    twitter: "@uniswap",
    about: `Uniswap revolutionizes crypto trading by enabling decentralized, peer-to-peer exchanges without intermediaries. 

    Key talking points:
    • Decentralized exchange (DEX) on Ethereum for seamless crypto trading.
    • Facilitates peer-to-peer trading through smart contracts.
    • Users can provide liquidity and earn fees by participating in liquidity pools.
    • Known for its Automated Market Maker (AMM) system, eliminating traditional order books.`,
    guidelines: [
      "Ensure you're using a secure Ethereum wallet to interact with Uniswap.",
      "Always check the liquidity pool's details before providing liquidity.",
      "Be aware of gas fees when executing transactions on the Ethereum network.",
      "Confirm token contract addresses to avoid scams or fake tokens.",
      "Understand the risks of impermanent loss before adding liquidity to a pool.",
    ],
    templates: [
      {
        type: "Thread",
        title: "Why Uniswap V3 is a game changer",
        preview: "🧵 Thread: 5 reasons Uniswap V3 is revolutionizing DeFi...",
      },
      {
        type: "Meme",
        title: "GHO vs other stablecoins",
        preview: "Comparison meme template ready to customize...",
      },
      {
        type: "Infographic",
        title: "Uniswap by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      }
    ],
    hashtags: ["#Uniswap", "#DEX", "#DeFi"],
    tickers: ["UNI"],
    pool: { id: 2, token: "UNI", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", flow_rate: 25000, flow_rate_unit: "month" },
    start_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
    quote: 6,
    comment: 5,
    repost: 4,
    promoters: 5621,
    big_accounts: ["uniswap_trader", "defi_king", "dex_master"],
    user: { id: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Chainlink Protocol",
    description: "Chainlink is a decentralized oracle network that provides secure and reliable data feeds to smart contracts. Promote Chainlink's V3 features, LINK token, and governance proposals to earn streamed LINK tokens.",
    logo: "/chainlink-oracle-logo-blue.jpg",
    website: "https://chainlink.org",
    twitter: "@chainlink",
    about: "Chainlink is a decentralized oracle network that provides secure and reliable data feeds to smart contracts. Promote Chainlink's V3 features, LINK token, and governance proposals to earn streamed LINK tokens.",
    guidelines: [
      "Focus on V3 features and benefits",
      "Highlight LINK token utility",
      "Share governance participation stories",
      "Use official brand assets only",
      "Always disclose promotional relationship",
    ],
    templates: [
      {
        type: "Thread",
        title: "Why Chainlink is the future of decentralized finance",
        preview: "🧵 Thread: 5 reasons Chainlink is revolutionizing DeFi...",
      },
      {
        type: "Meme",
        title: "Chainlink by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      },
      {
        type: "Infographic",
        title: "Chainlink by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      }
    ],
    hashtags: ["#Chainlink", "#Oracle", "#Infrastructure"],
    tickers: ["LINK"],
    pool: { id: 3, token: "LINK", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", flow_rate: 30000, flow_rate_unit: "month" },
    start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    quote: 6,
    comment: 5,
    repost: 4,
    promoters: 1523,
    big_accounts: ["chainlink_dev", "oracle_expert", "smart_contract_builder"],
    user: { id: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Arbitrum Protocol",
    description: "Arbitrum is a Layer 2 scaling solution for Ethereum that allows users to transact faster and cheaper. Promote Arbitrum's V3 features, ARB token, and governance proposals to earn streamed ARB tokens.",
    logo: "/arbitrum-layer2-logo-blue.jpg",
    website: "https://arbitrum.org",
    twitter: "@arbitrum",
    about: "Arbitrum is a Layer 2 scaling solution for Ethereum that allows users to transact faster and cheaper. Promote Arbitrum's V3 features, ARB token, and governance proposals to earn streamed ARB tokens.",
    guidelines: [
      "Focus on V3 features and benefits",
      "Highlight ARB token utility",
      "Share governance participation stories",
      "Use official brand assets only",
      "Always disclose promotional relationship",
    ],
    templates: [
      {
        type: "Thread",
        title: "Why Arbitrum is the future of Ethereum scaling",
        preview: "🧵 Thread: 5 reasons Arbitrum is revolutionizing Ethereum scaling...",
      },
      {
        type: "Meme",
        title: "Arbitrum by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      },
      {
        type: "Infographic",
        title: "Arbitrum by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      }
    ],
    hashtags: ["#Arbitrum", "#Layer2", "#Ethereum"],
    tickers: ["ARB"],
    pool: { id: 4, token: "ARB", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", flow_rate: 40000, flow_rate_unit: "month" },
    start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    quote: 6,
    comment: 5,
    repost: 4,
    promoters: 3421,
    big_accounts: ["arbitrum_dev", "layer2_expert", "ethereum_builder"],
    user: { id: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Lido Finance",
    description: "Lido Finance is a liquid staking solution for Ethereum that allows users to stake their ETH and earn staking rewards. Promote Lido Finance's V3 features, LDO token, and governance proposals to earn streamed LDO tokens.",
    logo: "/lido-finance-staking-logo.jpg",
    website: "https://lido.fi",
    twitter: "@lido_finance",
    about: "Lido Finance is a liquid staking solution for Ethereum that allows users to stake their ETH and earn staking rewards. Promote Lido Finance's V3 features, LDO token, and governance proposals to earn streamed LDO tokens.",
    guidelines: [
      "Focus on V3 features and benefits",
      "Highlight LDO token utility",
      "Share governance participation stories",
      "Use official brand assets only",
      "Always disclose promotional relationship",
    ],
    templates: [
      {
        type: "Thread",
        title: "Why Lido Finance is the future of Ethereum staking",
        preview: "🧵 Thread: 5 reasons Lido Finance is revolutionizing Ethereum staking...",
      },
      {
        type: "Meme",
        title: "Lido Finance by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      },
      {
        type: "Infographic",
        title: "Lido Finance by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      }
    ],
    hashtags: ["#Lido", "#Staking", "#LiquidStaking"],
    tickers: ["LDO"],
    pool: { id: 5, token: "LDO", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", flow_rate: 10000, flow_rate_unit: "month" },
    start_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    quote: 6,
    comment: 5,
    repost: 4,
    promoters: 1892,
    big_accounts: ["lido_staking", "ethereum_staker", "liquid_staker"],
    user: { id: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Optimism Protocol",
    description: "Optimism is a Layer 2 scaling solution for Ethereum that allows users to transact faster and cheaper. Promote Optimism's V3 features, OP token, and governance proposals to earn streamed OP tokens.",
    logo: "/optimism-layer2-logo-red.jpg",
    website: "https://optimism.io",
    twitter: "@optimism",
    about: "Optimism is a Layer 2 scaling solution for Ethereum that allows users to transact faster and cheaper. Promote Optimism's V3 features, OP token, and governance proposals to earn streamed OP tokens.",
    guidelines: [
      "Focus on V3 features and benefits",
      "Highlight OP token utility",
      "Share governance participation stories",
      "Use official brand assets only",
      "Always disclose promotional relationship",
    ],
    templates: [
      {
        type: "Thread",
        title: "Why Optimism is the future of Ethereum scaling",
        preview: "🧵 Thread: 5 reasons Optimism is revolutionizing Ethereum scaling...",
      },
      {
        type: "Meme",
        title: "Optimism by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      },
      {
        type: "Infographic",
        title: "Optimism by the numbers",
        preview: "Stats infographic with latest TVL and user data...",
      }
    ],
    hashtags: ["#Optimism", "#Layer2", "#PublicGoods"],
    tickers: ["OP"],
    pool: { id: 6, token: "OP", address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", flow_rate: 15000, flow_rate_unit: "month" },
    start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    quote: 6,
    comment: 5,
    repost: 4,
    promoters: 2156,
    big_accounts: ["optimism_dev", "layer2_expert", "ethereum_builder"],
    user: { id: 0 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockActiveCampaigns = [
  {
    id: 1,
    name: "Aave Protocol",
    description: "Aave is a decentralized lending protocol that allows users to lend and borrow assets. Promote Aave's V3 features, AAVE token, and governance proposals to earn streamed AAVE tokens.",
    logo: "/aave-protocol-logo-blue.jpg",
    website: "https://aave.com",
    twitter: "@aave",
  },
  {
    id: 2,
    name: "Uniswap Protocol",
    description: "Uniswap is a decentralized exchange protocol that allows users to swap tokens without intermediaries. Promote Uniswap's V3 features, UNI token, and governance proposals to earn streamed UNI tokens.",
    logo: "/uniswap-dex-logo-pink.jpg",
    website: "https://uniswap.org",
    twitter: "@uniswap",
  },
  {
    id: 3,
    name: "Chainlink Protocol",
    description: "Chainlink is a decentralized oracle network that provides secure and reliable data feeds to smart contracts. Promote Chainlink's V3 features, LINK token, and governance proposals to earn streamed LINK tokens.",
    logo: "/chainlink-oracle-logo-blue.jpg",
    website: "https://chainlink.org",
    twitter: "@chainlink",
  }
]

export const mockEarningsHistory = [
  { id: 1, date: "2024-03-15", campaign: "Aave Protocol", amount: 125.50, type: "earned" },
  { id: 2, date: "2024-03-14", campaign: "Uniswap", amount: 89.25, type: "earned" },
  { id: 3, date: "2024-03-13", campaign: "Chainlink", amount: 156.75, type: "earned" },
  { id: 4, date: "2024-03-12", campaign: "Arbitrum", amount: 203.40, type: "earned" },
]

export const mockPendingWithdrawals = [
  { id: 1, username: "crypto_enthusiast", amount: "125.50", token: "USDC", createdAt: "2024-03-15T10:30:00Z" },
  { id: 2, username: "defi_trader", amount: "89.25", token: "USDT", createdAt: "2024-03-15T09:15:00Z" },
  { id: 3, username: "nft_collector", amount: "156.75", token: "DAI", createdAt: "2024-03-15T08:45:00Z" },
  { id: 4, username: "web3_builder", amount: "203.40", token: "USDC", createdAt: "2024-03-15T07:20:00Z" },
]

export const mockWithdrawalHistory = [
  { id: 1, amount: "125.50", token: "USDC", status: "approved", createdAt: "2024-03-15T10:30:00Z" },
  { id: 2, amount: "89.25", token: "USDT", status: "approved", createdAt: "2024-03-12T14:20:00Z" },
  { id: 3, amount: "156.75", token: "DAI", status: "pending", createdAt: "2024-03-10T09:15:00Z" },
  { id: 4, amount: "203.40", token: "USDC", status: "approved", createdAt: "2024-03-08T16:45:00Z" },
  { id: 5, amount: "50.00", token: "ETH", status: "rejected", createdAt: "2024-03-05T11:30:00Z" },
  { id: 6, amount: "75.25", token: "USDC", status: "approved", createdAt: "2024-03-01T08:20:00Z" },
]

export const mockLeaderboardData = [
  { rank: 1, prevRank: 1, username: "whale_promoter", avatar: null, points: 48592, flowRate: "0.0847", change: 0 },
  { rank: 2, prevRank: 3, username: "crypto_chad", avatar: null, points: 42187, flowRate: "0.0734", change: 1 },
  { rank: 3, prevRank: 2, username: "defi_queen", avatar: null, points: 38456, flowRate: "0.0669", change: -1 },
  { rank: 4, prevRank: 4, username: "nft_maxi", avatar: null, points: 31247, flowRate: "0.0544", change: 0 },
  { rank: 5, prevRank: 7, username: "eth_believer", avatar: null, points: 28934, flowRate: "0.0503", change: 2 },
  { rank: 6, prevRank: 5, username: "sol_degen", avatar: null, points: 27156, flowRate: "0.0472", change: -1 },
  { rank: 7, prevRank: 6, username: "layer2_lover", avatar: null, points: 25823, flowRate: "0.0449", change: -1 },
  { rank: 8, prevRank: 10, username: "airdrop_hunter", avatar: null, points: 24198, flowRate: "0.0421", change: 2 },
  { rank: 9, prevRank: 8, username: "governance_guru", avatar: null, points: 22876, flowRate: "0.0398", change: -1 },
  { rank: 10, prevRank: 9, username: "yield_farmer", avatar: null, points: 21543, flowRate: "0.0375", change: -1 },
  { rank: 11, prevRank: 12, username: "meme_lord", avatar: null, points: 19872, flowRate: "0.0346", change: 1 },
  { rank: 12, prevRank: 11, username: "alpha_seeker", avatar: null, points: 18654, flowRate: "0.0324", change: -1 },
]

export const mockLeaders = [
  { rank: 1, username: "whale_promoter", avatar: null, points: 48592, flowRate: "0.0847" },
  { rank: 2, username: "crypto_chad", avatar: null, points: 42187, flowRate: "0.0734" },
  { rank: 3, username: "defi_queen", avatar: null, points: 38456, flowRate: "0.0669" },
  { rank: 4, username: "nft_maxi", avatar: null, points: 31247, flowRate: "0.0544" },
  { rank: 5, username: "eth_believer", avatar: null, points: 28934, flowRate: "0.0503" },
]

export const mockReferrals = [
  { id: 1, username: "crypto_enthusiast", avatar: null, joinedAt: "2024-01-15", status: "active", points: 5420 },
  { id: 2, username: "defi_trader", avatar: null, joinedAt: "2024-01-20", status: "active", points: 3890 },
  { id: 3, username: "nft_collector", avatar: null, joinedAt: "2024-02-01", status: "active", points: 2150 },
  { id: 4, username: "web3_builder", avatar: null, joinedAt: "2024-02-10", status: "active", points: 1280 },
]

export const mockCampaignReferrals = [
  { id: 1, campaign: "Aave Protocol", totalReferrals: 234, conversionRate: "12.5%", revenue: 1250.50 },
  { id: 2, campaign: "Uniswap", totalReferrals: 189, conversionRate: "15.2%", revenue: 980.25 },
  { id: 3, campaign: "Chainlink", totalReferrals: 156, conversionRate: "10.8%", revenue: 750.40 },
]

export const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    username: "crypto_enthusiast",
    avatar: null,
    created_at: "2024-01-15",
    bot_detection: "low",
    sockpuppet_filters: "passed",
    wallet_status: true,
    is_ban: false,
    stream_status: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "defi_trader",
    avatar: null,
    created_at: "2024-01-20",
    bot_detection: "medium",
    sockpuppet_filters: "suspicious",
    wallet_status: true,
    is_ban: false,
    stream_status: true,
  },
  {
    id: 3,
    name: "Bob Wilson",
    username: "nft_collector",
    avatar: null,
    created_at: "2024-02-01",
    bot_detection: "high",
    sockpuppet_filters: "failed",
    wallet_status: false,
    is_ban: true,
    stream_status: false,
  },
]

export const mockStats = [
  {
    label: "Total Earned",
    value: 1247.89,
    change: "+12.5%",
    changeType: "positive",
    icon: Coins,
    prefix: "$",
    isStreaming: true,
  },
  {
    label: "Current Rank",
    value: 42,
    change: "+5 positions",
    changeType: "positive",
    icon: Trophy,
    prefix: "#",
    isStreaming: false,
  },
  {
    label: "Active Points",
    value: 15842,
    change: "+2.3%",
    changeType: "positive",
    icon: TrendingUp,
    isStreaming: false,
  },
  {
    label: "Referral Bonus",
    value: 156.45,
    change: "+8 invites",
    changeType: "positive",
    icon: Users,
    prefix: "$",
    isStreaming: false,
  },
]

export const mockRecentActivities = [
  {
    type: "comment",
    icon: MessageCircle,
    message: "New comment on your Aave post",
    points: "+28",
    humanScore: "0.87",
    time: "2 min ago",
    color: "cyan",
  },
  {
    type: "repost",
    icon: Repeat2,
    message: "Your Uniswap post was reposted",
    points: "+22",
    humanScore: "0.92",
    time: "5 min ago",
    color: "lime",
  },
  {
    type: "quote",
    icon: Quote,
    message: "Quote post from @defi_whale",
    points: "+35",
    humanScore: "0.95",
    time: "12 min ago",
    color: "gold",
  },
  {
    type: "mention",
    icon: AtSign,
    message: "Mentioned in discussion thread",
    points: "+12",
    humanScore: "0.78",
    time: "18 min ago",
    color: "magenta",
  },
  {
    type: "repost",
    icon: Repeat2,
    message: "Chainlink post gained traction",
    points: "+45",
    humanScore: "0.91",
    time: "25 min ago",
    color: "lime",
  },
]

export const mockActivityFeed = [
  {
    id: 1,
    type: "comment",
    icon: MessageCircle,
    message: "New comment on your Aave post",
    points: 28,
    humanScore: 0.87,
    time: "2 min ago",
    color: "cyan",
  },
  {
    id: 2,
    type: "repost",
    icon: Repeat2,
    message: "Your Uniswap post was reposted",
    points: 22,
    humanScore: 0.92,
    time: "5 min ago",
    color: "lime",
  },
  {
    id: 3,
    type: "quote",
    icon: Quote,
    message: "Quote post from @defi_whale",
    points: 35,
    humanScore: 0.95,
    time: "12 min ago",
    color: "gold",
  },
]

export const mockNotifications = [
  {
    id: 1,
    type: "earnings",
    title: "New Earnings",
    message: "You earned 125.50 points from Aave Protocol",
    time: "2 minutes ago",
    read: false,
    icon: Trophy,
  },
  {
    id: 2,
    type: "rank",
    title: "Rank Update",
    message: "You moved up 5 positions in the leaderboard",
    time: "1 hour ago",
    read: false,
    icon: TrendingUp,
  },
  {
    id: 3,
    type: "mention",
    title: "Mention",
    message: "@crypto_whale mentioned you in a post",
    time: "3 hours ago",
    read: true,
    icon: MessageCircle,
  },
  {
    id: 4,
    type: "alert",
    title: "Campaign Ending",
    message: "Aave Protocol campaign ends in 2 days",
    time: "5 hours ago",
    read: true,
    icon: AlertCircle,
  },
]


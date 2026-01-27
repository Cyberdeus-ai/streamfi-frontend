export interface TokenConfig {
  symbol: string
  address: string
  superTokenAddress: string
  decimals: number
}

export interface NetworkTokens {
  [networkId: string]: TokenConfig[]
}

export interface NetworkConfig {
  name: string
  chainId: string
  rpcUrl: string
  iconColor: string
  iconLetter: string
  isTestnet: boolean
  iconPath?: string
}

export const NETWORK_CONFIGS: { [key: string]: NetworkConfig } = {
  "1": {
    name: "Ethereum",
    chainId: "0x1",
    rpcUrl: "https://mainnet.infura.io/v3/",
    iconColor: "bg-blue-400",
    iconLetter: "E",
    isTestnet: false,
    iconPath: "/ethereum.svg",
  },
  "10": {
    name: "OP Mainnet",
    chainId: "0xa",
    rpcUrl: "https://mainnet.optimism.io",
    iconColor: "bg-red-600",
    iconLetter: "O",
    isTestnet: false,
    iconPath: "/optimism.svg",
  },
  "56": {
    name: "BNB Smart Chain",
    chainId: "0x38",
    rpcUrl: "https://bsc-dataseed.binance.org",
    iconColor: "bg-yellow-500",
    iconLetter: "B",
    isTestnet: false,
    iconPath: "/bnb.svg",
  },
  "100": {
    name: "Gnosis",
    chainId: "0x64",
    rpcUrl: "https://rpc.gnosischain.com",
    iconColor: "bg-green-500",
    iconLetter: "G",
    isTestnet: false,
    iconPath: "/gnosis.svg",
  },
  "137": {
    name: "Polygon",
    chainId: "0x89",
    rpcUrl: "https://polygon-rpc.com",
    iconColor: "bg-purple-600",
    iconLetter: "P",
    isTestnet: false,
    iconPath: "/polygon.svg",
  },
  "8453": {
    name: "Base",
    chainId: "0x2105",
    rpcUrl: "https://mainnet.base.org",
    iconColor: "bg-blue-500",
    iconLetter: "B",
    isTestnet: false,
    iconPath: "/base.svg",
  },
  "42161": {
    name: "Arbitrum One",
    chainId: "0xa4b1",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    iconColor: "bg-blue-800",
    iconLetter: "A",
    isTestnet: false,
    iconPath: "/arbitrum.svg",
  },
  "42220": {
    name: "Celo",
    chainId: "0xa4ec",
    rpcUrl: "https://forno.celo.org",
    iconColor: "bg-yellow-400",
    iconLetter: "C",
    isTestnet: false,
    iconPath: "/celo-mainnet.svg",
  },
  "43114": {
    name: "Avalanche",
    chainId: "0xa86a",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
    iconColor: "bg-red-600",
    iconLetter: "A",
    isTestnet: false,
    iconPath: "/avalanche.svg",
  },
  "534352": {
    name: "Scroll",
    chainId: "0x82750",
    rpcUrl: "https://rpc.scroll.io",
    iconColor: "bg-amber-200",
    iconLetter: "S",
    isTestnet: false,
    iconPath: "/scroll.svg",
  },
  "666666666": {
    name: "Degen",
    chainId: "0x27bc86aa",
    rpcUrl: "https://rpc.degen.tips",
    iconColor: "bg-purple-600",
    iconLetter: "D",
    isTestnet: false,
    iconPath: "/degen.svg",
  },
  "43113": {
    name: "Avalanche Fuji",
    chainId: "0xa869",
    rpcUrl: "https://api.avax-test.network/ext/bc/C/rpc",
    iconColor: "bg-red-600",
    iconLetter: "A",
    isTestnet: true,
    iconPath: "/avalanche.svg",
  },
  "84532": {
    name: "Base Sepolia",
    chainId: "0x14a34",
    rpcUrl: "https://sepolia.base.org",
    iconColor: "bg-blue-500",
    iconLetter: "B",
    isTestnet: true,
    iconPath: "/base.svg",
  },
  "534351": {
    name: "Scroll Sepolia",
    chainId: "0x8274f",
    rpcUrl: "https://sepolia-rpc.scroll.io",
    iconColor: "bg-amber-200",
    iconLetter: "S",
    isTestnet: true,
    iconPath: "/scroll.svg",
  },
  "11155111": {
    name: "Sepolia",
    chainId: "0xaa36a7",
    rpcUrl: "https://sepolia.infura.io/v3/",
    iconColor: "bg-blue-500",
    iconLetter: "S",
    isTestnet: true,
    iconPath: "/ethereum.svg",
  },
  "11155420": {
    name: "OP Sepolia",
    chainId: "0xaa37dc",
    rpcUrl: "https://sepolia.optimism.io",
    iconColor: "bg-red-600",
    iconLetter: "O",
    isTestnet: true,
    iconPath: "/optimism.svg",
  },
}

export const TOKEN_CONFIGS: NetworkTokens = {
  "1": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0xC22BeA0Be9872d8B7B3933CEc70Ece4D53A900da",
      decimals: 18,
    },
    {
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      superTokenAddress: "0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a",
      decimals: 6,
    },
    {
      symbol: "DAI",
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      superTokenAddress: "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
      decimals: 18,
    },
  ],
  "11155111": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x30a6933Ca9230361972E413a15dC8114c952414e",
      decimals: 18,
    },
    {
      symbol: "USDC",
      address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
      superTokenAddress: "0x59e9C0e6a4b29fC0d0B7a0c5c4d7Bd2C2bF3B2b8",
      decimals: 6,
    },
  ],
  "137": [
    {
      symbol: "MATIC",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x3aD736904E9e65189c3000c7DD2c8AC8bB7c4B22",
      decimals: 18,
    },
    {
      symbol: "USDC",
      address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      superTokenAddress: "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
      decimals: 6,
    },
    {
      symbol: "DAI",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      superTokenAddress: "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
      decimals: 18,
    },
  ],
  "80001": [
    {
      symbol: "MATIC",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0xA3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
      decimals: 18,
    },
  ],
  "42161": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36",
      decimals: 18,
    },
    {
      symbol: "USDC",
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      superTokenAddress: "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
      decimals: 6,
    },
    {
      symbol: "DAI",
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      superTokenAddress: "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
      decimals: 18,
    },
  ],
  "421614": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      decimals: 18,
    },
  ],
  "10": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36",
      decimals: 18,
    },
    {
      symbol: "USDC",
      address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      superTokenAddress: "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
      decimals: 6,
    },
    {
      symbol: "DAI",
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      superTokenAddress: "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
      decimals: 18,
    },
  ],
  "11155420": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      decimals: 18,
    },
  ],
  "43114": [
    {
      symbol: "AVAX",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x57F1c63497AEe0bE305B8852b354CEc793da37bB",
      decimals: 18,
    },
    {
      symbol: "USDC",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      superTokenAddress: "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
      decimals: 6,
    },
    {
      symbol: "DAI",
      address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      superTokenAddress: "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
      decimals: 18,
    },
  ],
  "43113": [
    {
      symbol: "AVAX",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0xC5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
      decimals: 18,
    },
  ],
  "56": [
    {
      symbol: "BNB",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
      decimals: 18,
    },
    {
      symbol: "USDT",
      address: "0x55d398326f99059fF775485246999027B3197955",
      superTokenAddress: "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
      decimals: 18,
    },
    {
      symbol: "USDC",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      superTokenAddress: "0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a",
      decimals: 18,
    },
  ],
  "97": [
    {
      symbol: "BNB",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0xB4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
      decimals: 18,
    },
  ],
  "8453": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x46fd5cfB4c12D87acD3a13e92BAa53240C661D93",
      decimals: 18,
    },
    {
      symbol: "USDC",
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      superTokenAddress: "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
      decimals: 6,
    },
    {
      symbol: "DAI",
      address: "0x50c5725949A6F0c72E6C4a641F24049A917E0eB6",
      superTokenAddress: "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
      decimals: 18,
    },
  ],
  "84532": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      decimals: 18,
    },
  ],
  "100": [
    {
      symbol: "xDAI",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x59988e47A3503AaFaA0368b3aFf9C8E4651d6fC6",
      decimals: 18,
    },
  ],
  "42220": [
    {
      symbol: "CELO",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c5A",
      decimals: 18,
    },
  ],
  "534352": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36",
      decimals: 18,
    },
  ],
  "534351": [
    {
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      decimals: 18,
    },
  ],
  "666666666": [
    {
      symbol: "DEGEN",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      superTokenAddress: "0x4ed4E862860beD51a9570b96d89aF5E1b0Efefed",
      decimals: 18,
    },
  ],
}

export function getTokensForNetwork(networkId: string): TokenConfig[] {
  return TOKEN_CONFIGS[networkId] || []
}

export function getSuperTokenName(baseToken: string): string {
  if (baseToken.endsWith("x")) return baseToken
  return `${baseToken}x`
}


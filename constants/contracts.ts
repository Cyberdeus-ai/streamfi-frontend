export const GDAv1ForwarderAddress = "0x0000000000000000000000000000000000000000"

export const GDAv1ForwarderABI = [
  "function createPool(address superToken, address admin, tuple(uint256 transferabilityForUnitsOwner, bool distributionFromAnyAddress) config) returns (address pool)",
  "event PoolCreated(address indexed superToken, address indexed admin, address indexed pool)",
]

export const ETHxAddress = "0x30a6933Ca9230361972E413a15dC8114c952414e"

export const ETHxABI = [
  "function upgradeByETH() payable returns (uint256 amount)",
]

export const SEPOLIA_CHAIN_ID = "11155111"


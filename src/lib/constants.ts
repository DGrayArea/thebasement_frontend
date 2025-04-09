export const APP_NAME = "The Basement";
export const APP_DESCRIPTION = "Solana-based yield generation protocol";
export const APP_VERSION = "0.1.0 (Beta)";

// Pool constants
export const POOL_TYPES = {
  CONSERVATIVE: "Conservative",
  AGGRESSIVE: "Aggressive",
};

// Mock whitelisted addresses for beta
export const WHITELISTED_ADDRESSES = [
  "8YLKoCr5Nz5RgzPHjYwsNnKEZNKKcNoWmUAKVuBsZmW6",
  "6PEFnCnrK4dYTRAKTFHRxeQMoDvBw5jnF4XMmAwANgTZ",
  "HhJpBhRRn4g56VsyUBb9HXcWRMJGiX1KrNGM3EQues8o",
];

// Mock pool addresses
export const MOCK_POOL_ADDRESSES: Record<string, string> = {
  "1": "8JUjWjAyXTMB4ZXcV7nk3p6Gg1fWAAoSck4b5tqNfY7Z",
  "2": "DuXVnR4LR2Ck76fa63NgGYkKUvCZVKU6iNBGNUvTmKPp",
  "3": "HY6Eqbn8oNgCW487UaZkuJDcfwvQ6dGeVQugSUH3xHd5",
};

export const poolAccount = "5sRZz8J2cKs8AaNRyecwsoE2sALGuH3MPF2F5tYMkfxd";

// Mock data for UI development
export const MOCK_POOLS = [
  {
    id: "pool-1",
    name: POOL_TYPES.CONSERVATIVE,
    description: "Low-risk strategy focused on stable returns",
    apy: 5.2,
    tvl: 125000,
    depositToken: "USDC",
    strategyDescription: "Lending + Liquidity provision on stable pairs",
    minDeposit: 50,
    depositCap: 250000,
  },
  {
    id: "pool-2",
    name: POOL_TYPES.AGGRESSIVE,
    description: "Higher-risk strategy aimed at maximizing returns",
    apy: 12.8,
    tvl: 75000,
    depositToken: "SOL",
    strategyDescription:
      "Yield farming + Trading strategies on volatile assets",
    minDeposit: 1,
    depositCap: 100000,
  },
];

export const MOCK_TRANSACTIONS = [
  {
    id: "tx-1",
    type: "Deposit",
    amount: 100,
    token: "USDC",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: "Completed",
    txHash: "5UaYAH2uBiQKouP6y9dQy63XaGaQ9JJWTgJS7WN8LS8Y",
  },
  {
    id: "tx-2",
    type: "Yield Distribution",
    amount: 0.42,
    token: "USDC",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    status: "Completed",
    txHash: "4x62jCBgzxLMVPxhESbxcGfjXmw61AvDEqSG6fJjLXYD",
  },
  {
    id: "tx-3",
    type: "Deposit",
    amount: 5,
    token: "SOL",
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    status: "Completed",
    txHash: "3vX5RzKRS8RnkP5G7jYu9X5VuvS9WKLEtF8h5qVwVVxn",
  },
];

export const MOCK_YIELD_DATA = [
  { date: "Jan", conservative: 0.4, aggressive: 0.7 },
  { date: "Feb", conservative: 0.5, aggressive: 1.0 },
  { date: "Mar", conservative: 0.3, aggressive: 0.5 },
  { date: "Apr", conservative: 0.6, aggressive: 1.2 },
  { date: "May", conservative: 0.4, aggressive: 0.9 },
  { date: "Jun", conservative: 0.5, aggressive: 1.1 },
  { date: "Jul", conservative: 0.4, aggressive: 0.8 },
];

// Wallet configuration
export const WALLET_CONFIG = {
  network: "devnet",
  rpcEndpoint:
    "https://devnet.helius-rpc.com/?api-key=cd0d7cb0-2f17-4ec3-b4c6-bd6d359bca0c",
  //"https://api.devnet.solana.com",
};

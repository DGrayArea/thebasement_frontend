import { PublicKey } from '@solana/web3.js';

export interface Pool {
  id: string;
  name: string;
  description: string;
  apy: number;
  tvl: number;
  depositToken: string;
  minDeposit: number;
  depositCap: number;
  lockupPeriod: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  token: string;
  timestamp: string;
  status: string;
  txHash: string;
  sender?: PublicKey;
  receiver?: PublicKey;
}

export interface YieldDataPoint {
  date: string;
  conservative: number;
  aggressive: number;
}

export interface WalletAdapter {
  publicKey: string | null;
  connected: boolean;
  connecting: boolean;
  disconnect: () => Promise<void>;
  connect: () => Promise<void>;
}

export interface DepositFormData {
  amount: number;
  token: string;
  poolId: string;
  poolAddress: PublicKey;
  tokenMint: PublicKey;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface PoolState {
  totalDeposits: number;
  totalYield: number;
  lastDistribution: Date;
  depositTokenBalance: number;
  yieldTokenBalance: number;
  depositTokenMint: PublicKey;
  yieldTokenMint: PublicKey;
  authority: PublicKey;
  isLocked: boolean;
}

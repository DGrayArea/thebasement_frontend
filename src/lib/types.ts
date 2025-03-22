
export interface Pool {
  id: string;
  name: string;
  description: string;
  apy: number;
  tvl: number;
  depositToken: string;
  strategyDescription: string;
  minDeposit: number;
  depositCap: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  token: string;
  timestamp: string;
  status: string;
  txHash: string;
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
}

export interface ChartData {
  name: string;
  value: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Buffer as BufferType } from "buffer";

declare global {
  interface Window {
    Buffer: typeof BufferType;
    activePolls?: Record<string, NodeJS.Timeout>;
  }
}

export interface TransactionResult {
  success: boolean;
  hash?: string;
  txId?: string;
  error?: string;
}

export interface TransactionStatus {
  status: "pending" | "completed" | "failed";
  result?: any;
  error?: string;
}

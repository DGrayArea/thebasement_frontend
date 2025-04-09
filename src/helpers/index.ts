/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiUrl } from "@/config/config";
import { TransactionResult } from "@/global";
import { poolAccount } from "@/lib/constants";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import axios from "axios";

export const submitStakeTransaction = async (
  amount: number,
  userPublicKey: string,
  decimals: number
): Promise<TransactionResult> => {
  try {
    const response = await axios.post(`${apiUrl}dlmm/stake`, {
      amount,
      userPublicKey,
      decimals,
    });

    const data = await response.data;

    if (response.status === 202) {
      return { success: true, txId: data.txId };
    } else {
      console.error("Error initiating transaction:", data.error);
      return { success: false, error: data.error };
    }
  } catch (error: any) {
    console.error("Error:", error);
    return { success: false, error: error.message };
  }
};

export const monitorTransaction = (
  txId: string,
  onComplete: (result: any) => void,
  onFail: (error: string) => void
): NodeJS.Timeout => {
  const checkStatus = async (): Promise<void> => {
    try {
      const response = await axios.get(`${apiUrl}dlmm/transaction/${txId}`);
      const data = await response.data;

      if (response.status === 200) {
        if (data.status === "completed") {
          clearInterval(pollInterval);
          onComplete(data.result);
        } else if (data.status === "failed") {
          clearInterval(pollInterval);
          onFail(data.error);
        }
      } else if (response.status === 404) {
        clearInterval(pollInterval);
        onFail("Transaction not found");
      } else {
        clearInterval(pollInterval);
        onFail("Error checking transaction status");
      }
    } catch (error: any) {
      console.error("Error polling transaction status:", error);
    }
  };

  const pollInterval = setInterval(checkStatus, 3000);

  if (!window.activePolls) window.activePolls = {};
  window.activePolls[txId] = pollInterval;

  return pollInterval;
};

export const sendFundsTransaction = async (
  amount: number,
  publicKey: PublicKey,
  sendTransaction: any,
  connection: Connection
): Promise<TransactionResult> => {
  try {
    const latestBlockhash = await connection.getLatestBlockhash("finalized");
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(poolAccount),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(
      {
        signature: signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      "finalized"
    );
    await connection.confirmTransaction(signature, "finalized");

    return {
      success: true,
      hash: signature,
    };
  } catch (error: any) {
    console.error("Transfer error:", error);
    return {
      success: false,
      error: error.message || "Transaction failed",
    };
  }
};

export const cleanupPolls = (): void => {
  if (window.activePolls) {
    Object.entries(window.activePolls).forEach(([_, interval]) => {
      clearInterval(interval);
    });
    window.activePolls = {};
  }
};

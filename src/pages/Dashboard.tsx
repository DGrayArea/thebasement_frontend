/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Lock } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
// import { toast } from "@/components/ui/use-toast";
import {
  WALLET_CONFIG,
  MOCK_POOL_ADDRESSES,
  poolAccount,
} from "@/lib/constants";
import { Pool } from "@/lib/types";
import { useTheme } from "@/contexts/ThemeContext";
import WalletGuard from "@/components/WalletGuard";
import SEO from "@/components/SEO";
import Loader from "@/components/Loader";
import { apiUrl, poolCreationFeeNGas } from "@/config/config";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  cleanupPolls,
  monitorTransaction,
  sendFundsTransaction,
  submitStakeTransaction,
} from "@/helpers";

const mockPools: Pool[] = [
  {
    id: "1",
    name: "Solana Staking Pool",
    description: "Low-risk Solana staking pool",
    apy: 8.5,
    tvl: 250000,
    depositToken: "SOL",
    minDeposit: 0.1,
    depositCap: 2,
    lockupPeriod: 7,
  },
  {
    id: "2",
    name: "Yield Farming Alpha",
    description: "High-yield Solana farming pool",
    apy: 18.2,
    tvl: 150000,
    depositToken: "SOL",
    minDeposit: 0.5,
    depositCap: 50,
    lockupPeriod: 14,
  },
];

const Dashboard: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawPercentage, setWithdrawPercentage] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  interface PoolData {
    pool: {
      totalSOL: number;
      totalTokens: number;
      totalSharePoints: number;
      currentPrice: number;
      poolValue: number;
    };
    user: {
      walletAddress: string;
      sharePoints: number;
      ownershipPercent: number;
      estimatedValueInSOL: number;
      totalDeposited: number;
      entryPrice: number;
      depositHistory: number;
      withdrawHistory: unknown[];
      totalWithdrawnSOL: number;
      totalWithdrawnTokens: number;
    };
  }

  const [userData, setUserData] = useState<PoolData | null>(null);

  const { publicKey, connected, sendTransaction } = useWallet();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const connection = new Connection(WALLET_CONFIG.rpcEndpoint);
          const balance = await connection.getBalance(publicKey);
          setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);
    return () => clearInterval(interval);
  }, [publicKey]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          const response = await axios.get(`${apiUrl}dlmm/user/${publicKey}`);
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [publicKey]);

  useEffect(() => {
    return () => {
      cleanupPolls();
    };
  }, []);

  const handleDeposit = async () => {
    if (!publicKey || !selectedPool || !depositAmount) return;

    const amount = Number(depositAmount);
    const depositValue = Number(
      Number(depositAmount) + Number(poolCreationFeeNGas)
    );
    if (isNaN(amount) || amount <= 0) {
      toast.error(
        "Invalid amount. \n Please enter a valid amount to deposit.",
        {
          style: {
            background: "#f87171",
            color: "#fff",
          },
          icon: "❌",
        }
      );
      return;
    }

    if (amount < selectedPool.minDeposit) {
      toast.error(
        `Deposit too low. \n Minimum deposit is ${selectedPool.minDeposit} ${selectedPool.depositToken}.`,
        {
          style: {
            background: "#f87171",
            color: "#fff",
          },
          icon: "⚠️",
        }
      );
      return;
    }

    if (amount > selectedPool.depositCap) {
      toast.error(
        `Deposit too high. \n Maximum deposit is ${selectedPool.depositCap} ${selectedPool.depositToken}.`,
        {
          style: {
            background: "#f87171",
            color: "#fff",
          },
          icon: "⚠️",
        }
      );
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Deposit Loading...");

      const connection = new Connection(WALLET_CONFIG.rpcEndpoint);
      const poolAddress = MOCK_POOL_ADDRESSES[selectedPool.id];

      if (!poolAddress) {
        throw new Error("Pool address not found");
      }

      const sendTx = await sendFundsTransaction(
        depositValue,
        publicKey,
        sendTransaction,
        connection
      );

      if (!sendTx.success) {
        toast.error("Transaction failed", { id: toastId });
        return;
      }

      const stakeResult = await submitStakeTransaction(
        amount,
        publicKey.toBase58(),
        6
      );

      if (stakeResult.success && stakeResult.txId) {
        toast.loading(`Processing stake transaction...`, {
          id: toastId,
        });

        const onComplete = (result: any): void => {
          toast.success(
            `Deposit successful.\n You have deposited ${amount} ${selectedPool.depositToken} to ${selectedPool.name}`,
            {
              id: toastId,
            }
          );
        };

        const onFail = (error: string): void => {
          toast.error(`Staking failed: ${error}`, {
            id: toastId,
          });
        };

        monitorTransaction(stakeResult.txId, onComplete, onFail);
      } else {
        toast.error(`Failed to initiate staking: ${stakeResult.error}`, {
          id: toastId,
        });
      }

      setDepositAmount("");
      setSelectedPool(null);

      const newBalance = await connection.getBalance(publicKey);
      setBalance(newBalance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error depositing:", error);
      toast.error(
        "There was an error processing your deposit. \n Please try again.",
        {
          style: {
            background: "#f87171",
            color: "#fff",
          },
          icon: "❌",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!publicKey || !selectedPool) return;
    const connection = new Connection(WALLET_CONFIG.rpcEndpoint);
    if (withdrawPercentage <= 0) {
      toast.error("Please select a valid withdrawal percentage.", {
        style: {
          background: "#f87171",
          color: "#fff",
        },
        icon: "⚠️",
      });
      return;
    }
    if (withdrawPercentage > 100) {
      toast.error("Withdrawal percentage cannot exceed 100%.", {
        style: {
          background: "#f87171",
          color: "#fff",
        },
        icon: "⚠️",
      });
      return;
    }

    try {
      setLoading(true);
      const toastId = toast.loading("Withdrawal requested...");

      const sendTx = await sendFundsTransaction(
        0.001,
        publicKey,
        sendTransaction,
        connection
      );

      if (!sendTx.success) {
        toast.error("Transaction failed", { id: toastId });
        return;
      }

      const axiosWithdrawResponse = await axios.post(apiUrl + "dlmm/unstake", {
        userPublicKey: publicKey.toBase58(),
        unstakePercentage: withdrawPercentage,
      });

      const data = axiosWithdrawResponse.data;

      if (axiosWithdrawResponse.status === 202 && data.txId) {
        toast.loading("Processing withdrawal transaction...", { id: toastId });

        const onComplete = (result: any): void => {
          toast.success(
            `Withdrawal successful.\n You have withdrawn ${withdrawPercentage}% of your stake from ${selectedPool.name}`,
            {
              id: toastId,
            }
          );
        };

        const onFail = (error: string): void => {
          toast.error(`Withdrawal failed: ${error}`, {
            id: toastId,
          });
        };

        monitorTransaction(data.txId, onComplete, onFail);
      } else {
        toast.error(`Withdrawal failed: ${data.error || "Unknown error"}`, {
          id: toastId,
        });
      }

      setWithdrawPercentage(0);
    } catch (error) {
      console.error("Error withdrawing:", error);
      toast.error(
        "There was an error processing your withdrawal. \n Please try again.",
        {
          style: {
            background: "#f87171",
            color: "#fff",
          },
          icon: "❌",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // 🧪 Simulate
  // const pool = new PoolClass();

  // pool.deposit("Alice.sol", 10);
  // pool.deposit("Bob.sol", 5);
  // pool.autoCompound();
  // pool.withdraw("Bob.sol", pool.users["Bob.sol"].shares / 2); // Partial
  // pool.deposit("Charlie.sol", 8);
  // pool.withdraw("Charlie.sol", pool.users["Charlie.sol"].shares / 2); // Partial
  // pool.deposit("Charlie.sol", 4); // Second deposit
  // pool.autoCompound();
  // pool.withdraw("Charlie.sol", pool.users["Charlie.sol"].shares); // Full

  return (
    <>
      <SEO
        title="Dashboard | The Basement"
        description="View your Solana portfolio and yield farming positions in The Basement protocol."
      />
      <div className="min-h-screen text-white">
        <main className="container mx-auto pt-24 px-4 pb-16">
          {/* Hero Image Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8"
          >
            <img
              src="/IMG_20250322_191655_012.jpg"
              alt="Dashboard Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D47A1]/80 to-[#4A1D96]/80 backdrop-blur-sm"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                  Welcome to The Basement
                </h1>
                <p
                  className={`text-lg font-bold ${theme === "dark" ? "text-white/70" : "text-gray-200"}`}
                >
                  Your gateway to decentralized yield generation
                </p>
              </div>
            </div>
          </motion.div>

          <WalletGuard>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <Card
                className={`backdrop-blur-sm border ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-blue-400" />
                      <span
                        className={`text-sm font-bold ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}
                      >
                        SOL Balance
                      </span>
                    </div>
                    <span className="text-2xl font-extrabold">
                      {balance.toFixed(4)} SOL
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`backdrop-blur-sm border ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      <span
                        className={`text-sm font-bold ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}
                      >
                        Total Earnings
                      </span>
                    </div>
                    <span className="text-2xl font-extrabold">Coming Soon</span>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`backdrop-blur-sm border ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10"
                    : "bg-white border-gray-200"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-blue-400" />
                      <span
                        className={`text-sm font-bold ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}
                      >
                        Locked Value
                      </span>
                    </div>
                    <span className="text-2xl font-extrabold">Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2
                  className={`text-2xl font-extrabold mb-6 ${theme === "dark" ? "text-white" : "text-black"}`}
                >
                  Available Pools
                </h2>
                <div className="space-y-4">
                  {mockPools.map((pool) => (
                    <Card
                      key={pool.id}
                      className={`backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10"
                          : "bg-white border-gray-200"
                      } ${selectedPool?.id === pool.id ? "ring-2 ring-blue-400" : ""}`}
                      onClick={() => setSelectedPool(pool)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3
                              className={`font-extrabold ${theme === "dark" ? "text-white" : "text-black"}`}
                            >
                              {pool.name}
                            </h3>
                            <p
                              className={`text-sm font-bold ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}
                            >
                              Min: {pool.minDeposit} | Max: {pool.depositCap}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-extrabold">
                              {pool.apy}% APY
                            </p>
                            <p
                              className={`text-sm font-bold ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}
                            >
                              TVL: ${pool.tvl.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2
                  className={`text-2xl font-extrabold mb-6 ${theme === "dark" ? "text-white" : "text-black"}`}
                >
                  Deposit
                </h2>
                {selectedPool ? (
                  <>
                    <Card
                      className={`backdrop-blur-sm border ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <label
                              className={`text-sm mb-2 block ${
                                theme === "dark"
                                  ? "text-white/60"
                                  : "text-gray-600"
                              }`}
                            >
                              Amount to Deposit
                            </label>
                            <Input
                              type="number"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              placeholder={`Enter amount (${selectedPool.minDeposit} - ${selectedPool.depositCap})`}
                              className={`${
                                theme === "dark"
                                  ? "bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                  : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                              }`}
                              min={selectedPool.minDeposit}
                              max={selectedPool.depositCap}
                              step="0.000001"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-white/60"
                                    : "text-gray-600"
                                }
                              >
                                Min Deposit
                              </span>
                              <span>
                                {selectedPool.minDeposit}{" "}
                                {selectedPool.depositToken}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-white/60"
                                    : "text-gray-600"
                                }
                              >
                                Max Deposit
                              </span>
                              <span>
                                {selectedPool.depositCap}{" "}
                                {selectedPool.depositToken}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-white/60"
                                    : "text-gray-600"
                                }
                              >
                                Lockup Period
                              </span>
                              <span>{selectedPool.lockupPeriod} days</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span
                                className={
                                  theme === "dark"
                                    ? "text-white/60"
                                    : "text-gray-600"
                                }
                              >
                                Expected APY
                              </span>
                              <span className="text-blue-400 font-semibold">
                                {selectedPool.apy}%
                              </span>
                            </div>
                          </div>
                          <Button
                            onClick={handleDeposit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <Loader size="sm" text="" /> Processing...
                              </div>
                            ) : (
                              "Deposit"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card
                      className={`backdrop-blur-sm border mt-6 ${
                        theme === "dark"
                          ? "bg-white/5 border-white/10"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {/* User Staking Info */}
                          <div>
                            <h3
                              className={`text-lg font-bold ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              Staking Information
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-white/60"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Total SOL in Pool
                                </span>
                                <span>{userData?.pool.totalSOL} SOL</span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-white/60"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Your Share Points
                                </span>
                                <span>{userData?.user.sharePoints}</span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-white/60"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Ownership Percentage
                                </span>
                                <span>{userData?.user.ownershipPercent}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-white/60"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Estimated Value in SOL
                                </span>
                                <span>
                                  {userData?.user.estimatedValueInSOL * 10} SOL
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span
                                  className={`${
                                    theme === "dark"
                                      ? "text-white/60"
                                      : "text-gray-600"
                                  }`}
                                >
                                  Total Deposited
                                </span>
                                <span>
                                  {userData?.user.totalDeposited * 2} SOL
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Slider for Withdrawal */}
                          <div>
                            <label
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-white/60"
                                  : "text-gray-600"
                              }`}
                            >
                              Withdrawal Percentage
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={withdrawPercentage}
                              onChange={(e) =>
                                setWithdrawPercentage(Number(e.target.value))
                              }
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm mt-1">
                              <span
                                className={`${
                                  theme === "dark"
                                    ? "text-white/60"
                                    : "text-gray-600"
                                }`}
                              >
                                0%
                              </span>
                              <span
                                className={`${
                                  theme === "dark"
                                    ? "text-white/60"
                                    : "text-gray-600"
                                }`}
                              >
                                {withdrawPercentage}%
                              </span>
                              <span
                                className={`${
                                  theme === "dark"
                                    ? "text-white/60"
                                    : "text-gray-600"
                                }`}
                              >
                                100%
                              </span>
                            </div>
                          </div>

                          {/* Withdraw Button */}
                          <Button
                            onClick={handleWithdraw}
                            disabled={loading || withdrawPercentage === 0}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                          >
                            {loading ? (
                              <div className="flex items-center gap-2">
                                <Loader size="sm" text="" /> Processing...
                              </div>
                            ) : (
                              `Withdraw ${withdrawPercentage}%`
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card
                    className={`backdrop-blur-sm border ${
                      theme === "dark"
                        ? "bg-white/5 border-white/10"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
                      <p
                        className={
                          theme === "dark" ? "text-white/60" : "text-gray-600"
                        }
                      >
                        Select a pool to deposit funds
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </WalletGuard>
        </main>
      </div>
    </>
  );
};

export default Dashboard;

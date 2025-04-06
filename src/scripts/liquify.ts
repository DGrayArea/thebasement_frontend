import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";

// Initialize connection
// const connection = new Connection("https://api.mainnet-beta.solana.com");
// Use Devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Devnet token mints (examples - replace with actual Devnet mints you want to test)
const DEVNET_SOL_MINT = "So11111111111111111111111111111111111111112"; // SOL is same
const DEVNET_USDC_MINT = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"; // Example Devnet USDC
const wallet = new Wallet(/* your wallet provider */);

// Referral account details (create this beforehand via Jupiter API)
const REFERRAL_ACCOUNT = {
  pubkey: "YOUR_REFERRAL_ACCOUNT_PUBKEY",
  feeBps: 100, // 1% fee
  feeShareBps: 10000, // 100% to referrer (adjust as needed)
};

async function swapWithFee(tokenAMint, tokenBMint, amount) {
  try {
    // Step 1: Get swap quote with 1% fee
    const quoteResponse = await (
      await fetch(
        `https://api.jup.ag/v1/quote?inputMint=${tokenAMint}&outputMint=${tokenBMint}&amount=${amount}&slippageBps=50&feeBps=100`
      )
    ).json();

    // Step 2: Prepare swap transaction
    const swapResponse = await (
      await fetch("https://api.jup.ag/v1/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: wallet.publicKey.toBase58(),
          // The line you asked about identifies the referring user
          // In production, replace with actual user's wallet
          referralAccount: REFERRAL_ACCOUNT.pubkey,
          feeBps: REFERRAL_ACCOUNT.feeBps,
          feeShareBps: REFERRAL_ACCOUNT.feeShareBps,
        }),
      })
    ).json();

    // Step 3: Execute swap
    const swapTransaction = Transaction.from(
      Buffer.from(swapResponse.swapTransaction, "base64")
    );
    const signedTx = await wallet.signTransaction(swapTransaction);
    const txid = await connection.sendRawTransaction(signedTx.serialize());
    await connection.confirmTransaction(txid);

    // Step 4: Stake 50% of tokenB
    const tokenBAmount = quoteResponse.outAmount * 0.5;
    await stakeTokens(tokenAMint, tokenBMint, tokenBAmount);

    return txid;
  } catch (error) {
    console.error("Swap failed:", error);
    throw error;
  }
}

async function stakeTokens(tokenAMint, tokenBMint, amount) {
  // Implement your staking logic here
  console.log(`Staking ${amount} of token ${tokenBMint} with ${tokenAMint}`);
  // This would interact with your staking program
}

async function unstakeAndSwap(tokenAMint, tokenBMint, amount) {
  try {
    // Step 1: Unstake tokens
    await unstakeTokens(tokenAMint, tokenBMint, amount);

    // Step 2: Swap tokenB back to tokenA with 1% fee
    const quoteResponse = await (
      await fetch(
        `https://api.jup.ag/v1/quote?inputMint=${tokenBMint}&outputMint=${tokenAMint}&amount=${amount}&slippageBps=50&feeBps=100`
      )
    ).json();

    const swapResponse = await (
      await fetch("https://api.jup.ag/v1/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: wallet.publicKey.toBase58(),
          referralAccount: REFERRAL_ACCOUNT.pubkey,
          feeBps: REFERRAL_ACCOUNT.feeBps,
          feeShareBps: REFERRAL_ACCOUNT.feeShareBps,
        }),
      })
    ).json();

    const swapTransaction = Transaction.from(
      Buffer.from(swapResponse.swapTransaction, "base64")
    );
    const signedTx = await wallet.signTransaction(swapTransaction);
    const txid = await connection.sendRawTransaction(signedTx.serialize());

    return txid;
  } catch (error) {
    console.error("Unstake and swap failed:", error);
    throw error;
  }
}

async function unstakeTokens(tokenAMint, tokenBMint, amount) {
  // Implement your unstaking logic here
  console.log(`Unstaking ${amount} of token ${tokenBMint} from ${tokenAMint}`);
  // This would interact with your staking program
}

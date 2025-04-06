class PoolClass {
  constructor() {
    this.sol = 0;
    this.tokens = 0;
    this.totalShares = 0;
    this.pendingFees = { sol: 0, tokens: 0 };
    this.users = {};
    this.swapPrice = 100.0; // Initial: 1 SOL = 100 tokens
  }

  deposit(user, solAmount) {
    const swapAmount = solAmount / 2;
    const feeRate = 0.003; // 0.3% fee
    const tokenPrice = this.swapPrice;

    const tokensOutBeforeFee = swapAmount * tokenPrice;
    const tokenFee = tokensOutBeforeFee * feeRate;
    const tokensReceived = tokensOutBeforeFee - tokenFee;

    const liquidityAdded = swapAmount + tokensReceived / tokenPrice;
    const poolValue = this.getPoolValue();
    const newShares =
      this.totalShares === 0
        ? liquidityAdded
        : (liquidityAdded / poolValue) * this.totalShares;

    this.sol += swapAmount;
    this.tokens += tokensReceived;
    this.totalShares += newShares;
    this.pendingFees.tokens += tokenFee;

    if (!this.users[user]) this.users[user] = { shares: 0, deposited: 0 };
    this.users[user].shares += newShares;
    this.users[user].deposited += solAmount;

    console.log(`📥 [DEPOSIT] ${user} added ${solAmount.toFixed(2)} SOL`);
    console.log(
      `  • Swap: ${swapAmount.toFixed(2)} SOL → ${tokensReceived.toFixed(2)} tokens (Price: ${tokenPrice.toFixed(2)}, Fee: ${tokenFee.toFixed(2)} tokens)`
    );
    console.log(`  • Received ${newShares.toFixed(2)} shares`);
    this.printPoolState();
  }

  withdraw(user, sharesToWithdraw) {
    if (!this.users[user] || this.users[user].shares < sharesToWithdraw) {
      console.error(`❌ Withdrawal failed for ${user}: insufficient shares`);
      return;
    }

    const shareRatio = sharesToWithdraw / this.totalShares;
    const solOut = this.sol * shareRatio;
    const tokensOut = this.tokens * shareRatio;
    const fee = 0.002; // 0.2% fee per token

    const solFee = solOut * fee;
    const solAfterFee = solOut - solFee;

    this.sol -= solOut;
    this.tokens -= tokensOut;
    this.totalShares -= sharesToWithdraw;
    this.users[user].shares -= sharesToWithdraw;

    this.pendingFees.sol += solFee;

    const withdrawnValue = solOut + tokensOut / this.swapPrice;
    const deposited =
      this.users[user].deposited *
      (sharesToWithdraw / (this.users[user].shares + sharesToWithdraw));
    const profit = withdrawnValue - deposited;
    const roi = (profit / deposited) * 100;
    const symbol = profit >= 0 ? "🟢" : "🔴";

    console.log(
      `📤 [WITHDRAW] ${user} withdrew ${sharesToWithdraw.toFixed(2)} shares`
    );
    console.log(
      `  • Received ${solAfterFee.toFixed(2)} SOL (Before fees: ${solOut.toFixed(2)} SOL)`
    );
    console.log(`  • Fees paid: ${solFee.toFixed(4)} SOL`);
    console.log(
      `  • Profit/Loss: ${symbol} ${profit.toFixed(2)} SOL (ROI: ${roi.toFixed(2)}%)`
    );
    this.printPoolState();
  }

  autoCompound() {
    const addedSol = this.pendingFees.sol;
    const addedTokens = this.pendingFees.tokens;

    this.sol += addedSol;
    this.tokens += addedTokens;
    this.pendingFees = { sol: 0, tokens: 0 };

    const totalValue = this.getPoolValue();
    const newPrice = this.tokens / this.sol;

    console.log(
      `💰 [AUTO-COMPOUND] Added ${addedSol.toFixed(4)} SOL + ${addedTokens.toFixed(2)} tokens to LP`
    );
    this.swapPrice = newPrice;
    this.printPoolState();
  }

  getPoolValue() {
    return this.sol + this.tokens / this.swapPrice;
  }

  printPoolState() {
    console.log(
      `📊 [POOL STATE] Price: 1 SOL = ${this.swapPrice.toFixed(2)} tokens`
    );
    console.log(
      `  • Liquidity: ${this.sol.toFixed(2)} SOL + ${this.tokens.toFixed(2)} tokens = ${this.getPoolValue().toFixed(2)} SOL value`
    );
    console.log(`  • Shares: ${this.totalShares.toFixed(2)} total`);
    console.log(
      `  • Pending fees: ${this.pendingFees.sol.toFixed(4)} SOL + ${this.pendingFees.tokens.toFixed(2)} tokens`
    );
    console.log(`  • Current users:`);
    for (const [user, data] of Object.entries(this.users)) {
      console.log(
        `    - ${user}: ${data.shares.toFixed(2)} shares (Deposited: ${data.deposited.toFixed(2)} SOL)`
      );
    }
    console.log();
  }
}

export default PoolClass;

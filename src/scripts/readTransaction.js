import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com"); // Use Devnet/Testnet as needed

const transactionSignature =
  "2vEojxDHtw1dc1ZrRfzRqif8i7bcugKqRSnkkTc82sQ6vKeRTwek9o4hMEjDCXiUWTtRfP4wQpXC7mmQcsDWPZWo";

async function fetchTransactionDetails() {
  try {
    const tx = await connection.getTransaction(transactionSignature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0, // Support older transactions
    });

    console.log(JSON.stringify(tx, null, 2));
    for (const instruction of tx.transaction.message.instructions) {
      console.log("Program:", instruction.programId);
      console.log(
        "Accounts:",
        instruction.accounts.map((acc) => acc)
      );
      console.log("Data (Raw):", instruction.data); // Encoded data
    }
    // for (const instruction of tx.transaction.message.instructions) {
    //   console.log("Program ID:", instruction.programId);
    //   console.log(
    //     "Accounts:",
    //     instruction.accounts.map((acc) => acc)
    //   );
    //   console.log("Raw Data:", instruction.data); // Encoded data
    // }
  } catch (error) {
    console.error("Error fetching transaction details:", error);
  }
}

await fetchTransactionDetails().catch((error) => {
  console.error("Error in fetchTransactionDetails:", error);
});

const inputParamsForStake = {
  amountX: 2000000,
  amountY: 500864135,
  activeId: 161,
  maxActiveBinSlippage: 1,
  strategyParameters: {
    minBinId: 94,
    maxBinId: 162,
    strategyType: spotImBalanced,
    parameteres: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
  },
};

const remainingAccountsInfo = {
  slices: [
    { accountsType: transferHookX, length: 0 },
    { accountsType: transferHookY, length: 0 },
  ],
};

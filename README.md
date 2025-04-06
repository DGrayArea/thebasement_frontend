# The Basement Solana

A modern DeFi application for yield farming on Solana, featuring a beautiful UI and user-friendly experience.

## Features

- Modern, responsive UI with Tailwind CSS
- Wallet integration with multiple Solana wallet adapters
- Dashboard with portfolio overview
- Investment pools for different yield strategies
- Theme switching (dark/light mode)
- Mobile-friendly design
- SEO optimization

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Solana Web3.js
- Wallet Adapter integration
- Framer Motion for animations
- React Router for navigation
- React Helmet for SEO

## Getting Started

### Prerequisites

- Node.js (v14+)
- Yarn or npm

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/yield-garden-solana.git
cd yield-garden-solana
```

2. Install dependencies:

```
yarn install
```

3. Start the development server:

```
yarn dev
```

4. Open `http://localhost:8080` to view the application in your browser.

## Building for Production

```
yarn build
```

## License

MIT

## Acknowledgements

- [Solana](https://solana.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
- [Framer Motion](https://www.framer.com/motion/)

## CPI Functions

- [initializePosition] to create liquidity position with params: lowerBinId: i32 width: i32 &Accounts ->
  payer
  Signer
  position
  Signer
  lbPair
  owner
  Signer
  systemProgram
  rent
  eventAuthority
  program

- [claimFee2] to claim fees with params: minBinId: i32 maxBinId: i32, remainingAccountsInfo:RemainingAccountsInfo &Accounts ->
  lbPair
  position
  sender
  Signer
  reserveX
  reserveY
  userTokenX
  userTokenY
  tokenXMint
  tokenYMint
  tokenProgramX
  tokenProgramY
  memoProgram
  eventAuthority
  program

- [removeLiquidityByRange2] to remove liqidity fromBinId: i32, toBinId: i32, bpsToRemove : u16, remainingAccountsInfo: "RemainingAccountsInfo" &Accounts ->
  position
  lbPair
  binArrayBitmapExtension
  userTokenX
  userTokenY
  reserveX
  reserveY
  tokenXMint
  tokenYMint
  sender
  Signer
  tokenXProgram
  tokenYProgram
  memoProgram
  eventAuthority
  program

- [claimFee2] to claim fees with params: minBinId: i32 maxBinId: i32, remainingAccountsInfo:RemainingAccountsInfo &Accounts ->
  lbPair
  position
  sender
  Signer
  reserveX
  reserveY
  userTokenX
  userTokenY
  tokenXMint
  tokenYMint
  tokenProgramX
  tokenProgramY
  memoProgram
  eventAuthority
  program

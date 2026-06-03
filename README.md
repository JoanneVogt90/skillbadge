# SkillBadge

SkillBadge is a mobile-first Base miniapp for skill identity verification and onchain resumes. Users choose Solidity Builder, Frontend Developer, or Base MiniApp Builder, claim a free skill badge, and show their Web3 skill identity with a wallet address.

## Features

- English-only UI
- Warm card-based layout for Base App embedded browsers and desktop
- One primary action: Claim Skill Badge
- Instant local reward before any token purchase or contract requirement
- Native Wagmi configuration with Coinbase Wallet and injected wallets only
- No RainbowKit, no WalletConnect Project ID, and no WalletConnect connector
- Explicit ERC-8021 `dataSuffix` on `writeContract`
- Hardcoded Base offchain attribution meta tag in `app/layout.tsx`

## Tech Stack

- Next.js
- TypeScript
- App Router
- Wagmi
- Viem
- Tailwind CSS
- Solidity and Hardhat

## Wallet Support

The app exposes a custom wallet menu with these connectors:

- Base App / Browser Wallet through `injected()`
- Coinbase Wallet through `coinbaseWallet()`
- MetaMask through `injected({ target: 'metaMask' })`
- OKX Wallet through `injected({ target: 'okxWallet' })`

## Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Frontend variables:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xFEE410f3ADC47c4979742Ca6EcaCe7a14838BBcB
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX=0x62635f626b76357233316c
```

Contract deployment variables:

```bash
PRIVATE_KEY=your_deployer_private_key_without_0x
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

The supplied contract address has code on Base mainnet, so the frontend defaults to `NEXT_PUBLIC_CHAIN_ID=8453`.

## Base Attribution

Offchain attribution is hardcoded in `app/layout.tsx`:

```tsx
<meta name="base:app_id" content="" />
```

The current app hardcodes the provided verify token:

```tsx
<meta name="base:app_id" content="6a1fd6434fbf682eb25dc0bd" />
```

Onchain attribution is configured in `lib/wagmi.ts`:

```ts
export const baseBuilderDataSuffix = '0x' as `0x${string}`;
```

The current builder code is `bc_bkv5r31l`, encoded as `0x62635f626b76357233316c`. Every `writeContract` call must pass `dataSuffix`, and the current skill badge claim already does this.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Next.js URL shown in the terminal.

## Build

```bash
npm run build
```

## Deploy Contract To Base Sepolia

Make sure the deployer wallet has Base Sepolia ETH, then run:

```bash
npm run deploy:contract
```

The script prints the deployed contract address. Add that address to `NEXT_PUBLIC_CONTRACT_ADDRESS`.

## Deploy Frontend To Vercel

1. Push this project to GitHub.
2. Import the repo in Vercel.
3. Set the frontend environment variables listed above.
4. Use the default Next.js settings:
   - Build command: `npm run build`
   - Framework preset: Next.js

## BaseScan Verification Notes

After deploying, verify the contract on BaseScan:

```bash
npx hardhat verify --network baseSepolia 0xYourDeployedContract
```

The constructor has no arguments.

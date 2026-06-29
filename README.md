# SkillBadge

SkillBadge is a mobile-first Base miniapp for skill identity verification and onchain resumes.

The app lets users choose a skill path, claim a free skill badge, and display a Web3 skill identity connected to a wallet address.

Repository: [https://github.com/JoanneVogt90/skillbadge.git](https://github.com/JoanneVogt90/skillbadge.git)

## Overview

SkillBadge is designed to provide a simple, focused experience in Base App embedded browsers and desktop browsers.

Users can select one of the supported skill identities and claim a skill badge from the app interface.

Supported skill identities include:

- Solidity Builder
- Frontend Developer
- Base MiniApp Builder

The primary action in the app is:

- Claim Skill Badge

## Features

- English-only interface
- Mobile-first layout
- Warm, card-based visual design
- Support for Base App embedded browsers
- Support for desktop browsers
- Single primary action: `Claim Skill Badge`
- Instant local reward experience before any contract requirement
- Custom wallet menu
- Wagmi configuration with Coinbase Wallet and injected wallets
- No RainbowKit dependency
- No WalletConnect connector
- Explicit ERC-8021 `dataSuffix` support on `writeContract`
- Base offchain attribution meta tag configured in `app/layout.tsx`

## Tech Stack

- Next.js
- TypeScript
- App Router
- Wagmi
- Viem
- Tailwind CSS
- Solidity
- Hardhat

## Wallet Support

SkillBadge uses a custom wallet menu.

The configured connectors are:

- Base App / browser wallet through `injected()`
- Coinbase Wallet through `coinbaseWallet()`
- MetaMask through `injected({ target: 'metaMask' })`
- OKX Wallet through `injected({ target: 'okxWallet' })`

Wallet support should stay limited to these configured connectors unless the project requirements change.

## Environment Variables

Copy the example environment file before running the app locally:

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

The supplied contract address has code on Base mainnet.

For that reason, the frontend defaults to Base mainnet:

```bash
NEXT_PUBLIC_CHAIN_ID=8453
```

If you use a different contract deployment, update the contract address and chain ID to match the target network.

## Base Attribution

Offchain attribution is configured in `app/layout.tsx`.

Example meta tag format:

```tsx
<meta name="base:app_id" content="" />
```

The current app uses this configured value:

```tsx
<meta name="base:app_id" content="6a1fd6434fbf682eb25dc0bd" />
```

Onchain attribution is configured in `lib/wagmi.ts`.

Default format:

```ts
export const baseBuilderDataSuffix = '0x' as `0x${string}`;
```

The current builder code is:

```text
bc_bkv5r31l
```

It is encoded as:

```text
0x62635f626b76357233316c
```

Every `writeContract` call should pass `dataSuffix`.

The current skill badge claim flow already includes this configuration.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local Next.js URL shown in your terminal.

## Build

Create a production build:

```bash
npm run build
```

## Deploy the Contract to Base Sepolia

Make sure the deployer wallet has Base Sepolia ETH.

Run the contract deployment script:

```bash
npm run deploy:contract
```

The deployment script prints the deployed contract address.

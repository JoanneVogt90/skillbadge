# SkillBadge

SkillBadge is a mobile-first Base miniapp for skill identity verification and onchain resumes.

The app lets users choose a skill path, claim a free skill badge, and display a Web3 skill identity connected to a wallet address.

Repository: [https://github.com/JoanneVogt90/skillbadge.git](https://github.com/JoanneVogt90/skillbadge.git)

## Overview

SkillBadge is designed for a simple, focused user experience inside Base App embedded browsers and on desktop.

Users can select one of the supported skill identities:

- Solidity Builder
- Frontend Developer
- Base MiniApp Builder

The primary user action is to claim a skill badge.

## Features

- English-only interface
- Mobile-first layout
- Warm card-based visual design
- Works in Base App embedded browsers and desktop browsers
- Single primary action: Claim Skill Badge
- Instant local reward experience before any contract requirement
- Custom wallet menu
- Wagmi configuration using Coinbase Wallet and injected wallets
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

The app exposes a custom wallet menu with the following connectors:

- Base App / Browser Wallet through `injected()`
- Coinbase Wallet through `coinbaseWallet()`
- MetaMask through `injected({ target: 'metaMask' })`
- OKX Wallet through `injected({ target: 'okxWallet' })`

## Environment Variables

Copy the example environment file before running the app locally:

```bash
cp .env.example .env.local

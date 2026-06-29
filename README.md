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

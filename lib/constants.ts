import { type Address } from 'viem';

export type BadgeDefinition = {
  id: number;
  name: string;
  description: string;
  reward: string;
};

export const primaryBadge: BadgeDefinition = {
  id: 1,
  name: 'Starter Builder',
  description: 'A warm first-step reward for opening the app, connecting a wallet, and joining the Base builder loop.',
  reward: '+25 Builder Points',
};

export const rewardSteps = ['Open the app', 'Connect a wallet', 'Claim the starter reward', 'Keep building on Base'];

export const configuredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 84532);
export const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '') as Address;
export const contractConfigured = /^0x[a-fA-F0-9]{40}$/.test(contractAddress) && !/^0x0{40}$/i.test(contractAddress);

import { type Address } from 'viem';

export type BadgeDefinition = {
  id: number;
  name: string;
  track: string;
  description: string;
  reward: string;
};

export const skillBadges: BadgeDefinition[] = [
  {
    id: 1,
    name: 'Solidity Builder',
    track: 'Solidity',
    description: 'Smart contract development skill badge for your wallet identity.',
    reward: '+25 Skill XP',
  },
  {
    id: 2,
    name: 'Frontend Developer',
    track: 'Web3 UI',
    description: 'Web3 frontend development skill badge for product builders.',
    reward: '+25 Skill XP',
  },
  {
    id: 3,
    name: 'Base MiniApp Builder',
    track: 'Base App',
    description: 'Proof of building applications and mobile-first experiences on Base.',
    reward: '+25 Skill XP',
  },
];

export const primaryBadge = skillBadges[0];

export const rewardSteps = ['Choose a skill track', 'Connect a wallet', 'Claim your badge', 'Share your skill identity'];

export const configuredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 8453);
export const contractAddress = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0xFEE410f3ADC47c4979742Ca6EcaCe7a14838BBcB') as Address;
export const contractConfigured = /^0x[a-fA-F0-9]{40}$/.test(contractAddress) && !/^0x0{40}$/i.test(contractAddress);

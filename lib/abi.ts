export const skillBadgeAbi = [
  {
    type: 'function',
    name: 'claimBadge',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'badgeId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'hasBadge',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'badgeId', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getBadge',
    stateMutability: 'view',
    inputs: [{ name: 'badgeId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'imageURI', type: 'string' },
          { name: 'active', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'badgeCount',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

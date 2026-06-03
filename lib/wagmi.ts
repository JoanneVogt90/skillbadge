import { createConfig, http, type Config } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { base, baseSepolia } from 'wagmi/chains';

import { configuredChainId } from './constants';

export const selectedChain = configuredChainId === base.id ? base : baseSepolia;

export const baseBuilderDataSuffix = (process.env.NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX || '0x') as `0x${string}`;

const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({
      target: {
        id: 'base-app-injected',
        name: 'Base App / Browser Wallet',
        provider: (windowObject) => windowObject?.ethereum,
      },
    }),
    coinbaseWallet({
      appName: 'Warm Badge',
      preference: 'all',
    }),
    injected({ target: 'metaMask' }),
    injected({ target: 'okxWallet' }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: true,
});

export const wagmiConfig = Object.assign(config, {
  dataSuffix: baseBuilderDataSuffix,
}) as Config & { dataSuffix: `0x${string}` };

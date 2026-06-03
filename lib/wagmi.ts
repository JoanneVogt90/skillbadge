import { createConfig, http, type Config } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { base, baseSepolia } from 'wagmi/chains';

import { configuredChainId } from './constants';

export const selectedChain = configuredChainId === base.id ? base : baseSepolia;

export const baseBuilderDataSuffix = (process.env.NEXT_PUBLIC_BASE_BUILDER_DATA_SUFFIX || '0x') as `0x${string}`;

type BrowserWalletProvider = NonNullable<Window['ethereum']> & {
  isOKExWallet?: boolean;
  isOkxWallet?: boolean;
  providers?: BrowserWalletProvider[];
};

type BrowserWalletWindow = Window & {
  okxwallet?: BrowserWalletProvider;
  ethereum?: BrowserWalletProvider;
};

function getOkxProvider(windowObject?: unknown) {
  const walletWindow = windowObject as BrowserWalletWindow | undefined;
  if (walletWindow?.okxwallet) return walletWindow.okxwallet;

  const providers = walletWindow?.ethereum?.providers;
  const okxProvider = providers?.find(
    (provider: BrowserWalletProvider) => provider.isOkxWallet || provider.isOKExWallet,
  );
  if (okxProvider) return okxProvider;

  const ethereum = walletWindow?.ethereum;
  if (ethereum?.isOkxWallet || ethereum?.isOKExWallet) return ethereum;

  return undefined;
}

const config = createConfig({
  chains: [base, baseSepolia],
  multiInjectedProviderDiscovery: false,
  connectors: [
    injected({
      target: {
        id: 'base-app-injected',
        name: 'Base App / Browser Wallet',
        provider: (windowObject) => windowObject?.ethereum,
      },
    }),
    coinbaseWallet({
      appName: 'SkillBadge',
      preference: 'all',
    }),
    injected({ target: 'metaMask' }),
    injected({
      target: {
        id: 'okx-wallet',
        name: 'OKX Wallet',
        provider: (windowObject) => getOkxProvider(windowObject),
      },
    }),
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

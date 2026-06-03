'use client';

import { Award, BadgeCheck, ChevronDown, Compass, LogOut, ShieldCheck, Sparkles, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BaseError } from 'viem';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContracts,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { Providers } from '@/app/providers';
import { skillBadgeAbi } from '@/lib/abi';
import { contractAddress, contractConfigured, configuredChainId, rewardSteps, skillBadges } from '@/lib/constants';
import { baseBuilderDataSuffix } from '@/lib/wagmi';

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getErrorMessage(error: unknown) {
  if (!error) return '';
  if (error instanceof BaseError) return error.shortMessage;
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}

function isBaseAppBrowser() {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  const ethereum = window.ethereum as { isCoinbaseBrowser?: boolean } | undefined;
  return userAgent.includes('base') || Boolean(ethereum?.isCoinbaseBrowser);
}

function getWalletMenuKey(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('okx')) return 'okx';
  if (normalizedName.includes('metamask') || normalizedName.includes('matefox')) return 'metamask';
  if (normalizedName.includes('coinbase')) return 'coinbase';
  if (normalizedName.includes('base app')) return 'base-app';

  return normalizedName.replace(/\s+/g, '-');
}

function getWalletMenuLabel(name: string) {
  const walletKey = getWalletMenuKey(name);

  if (walletKey === 'okx') return 'OKX Wallet';
  if (walletKey === 'metamask') return 'MetaMask';

  return name;
}

function BadgeApp() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, isPending: connectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: switchPending } = useSwitchChain();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [instantClaimedIds, setInstantClaimedIds] = useState<number[]>([]);
  const [autoConnectTried, setAutoConnectTried] = useState(false);
  const [identityShared, setIdentityShared] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState(skillBadges[0].id);

  const selectedBadge = skillBadges.find((badge) => badge.id === selectedBadgeId) ?? skillBadges[0];
  const walletMenuConnectors = useMemo(() => {
    const seenWallets = new Set<string>();

    return connectors.filter((connector) => {
      const walletKey = getWalletMenuKey(connector.name);
      if (seenWallets.has(walletKey)) return false;
      seenWallets.add(walletKey);
      return true;
    });
  }, [connectors]);

  const wrongNetwork = isConnected && chainId !== configuredChainId;
  const canUseContract = contractConfigured && isConnected && !wrongNetwork;

  const { data: badgeRead, refetch: refetchBadge } = useReadContracts({
    contracts: address
      ? [
          {
            address: contractAddress,
            abi: skillBadgeAbi,
            functionName: 'hasBadge',
            args: [address, BigInt(selectedBadge.id)],
          },
        ]
      : [],
    query: { enabled: canUseContract && Boolean(address) },
  });

  const onchainClaimed = Boolean(badgeRead?.[0]?.result);
  const visibleRewardClaimed = instantClaimedIds.includes(selectedBadge.id) || onchainClaimed;

  const { writeContract, data: txHash, error: writeError, isPending: writePending } = useWriteContract();
  const { isLoading: txConfirming, isSuccess: txSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  });

  useEffect(() => {
    if (!txSuccess) return;
    setInstantClaimedIds((ids) => (ids.includes(selectedBadge.id) ? ids : [...ids, selectedBadge.id]));
    void refetchBadge();
  }, [refetchBadge, selectedBadge.id, txSuccess]);

  useEffect(() => {
    if (autoConnectTried || isConnected || !isBaseAppBrowser()) return;
    const embeddedConnector = walletMenuConnectors.find((connector) => connector.name.includes('Base App'));
    if (!embeddedConnector) return;
    setAutoConnectTried(true);
    connect({ connector: embeddedConnector });
  }, [autoConnectTried, connect, walletMenuConnectors, isConnected]);

  const walletLabel = useMemo(() => {
    if (address) return shortAddress(address);
    if (connectPending) return 'Connecting';
    return 'Connect Wallet';
  }, [address, connectPending]);

  const statusMessage = wrongNetwork
    ? 'Switch to Base to write this badge onchain.'
    : !contractConfigured
      ? 'Onchain claiming is waiting for a contract address. Your instant badge preview still works now.'
      : !isConnected
        ? 'Connect your wallet before claiming an onchain skill badge.'
      : getErrorMessage(writeError || receiptError);

  const handleClaim = () => {
    if (!isConnected) {
      setWalletMenuOpen(true);
      return;
    }

    if (wrongNetwork) {
      switchChain({ chainId: configuredChainId });
      return;
    }
    if (!canUseContract || onchainClaimed) return;

    writeContract({
      address: contractAddress,
      abi: skillBadgeAbi,
      functionName: 'claimBadge',
      args: [BigInt(selectedBadge.id)],
      dataSuffix: baseBuilderDataSuffix,
    });
  };

  const handleShareIdentity = async () => {
    if (!address || !visibleRewardClaimed) return;

    const shareUrl = `${window.location.origin}?wallet=${address}&badge=${selectedBadge.id}`;
    const shareText = `I claimed the ${selectedBadge.name} skill badge on SkillBadge.`;

    if (navigator.share) {
      await navigator.share({
        title: 'SkillBadge',
        text: shareText,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    }

    setIdentityShared(true);
  };

  return (
    <main className="min-h-screen bg-cream text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-base font-bold">SkillBadge</span>
          </div>

          <div className="relative">
            <button
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-amber-200 bg-white px-3 text-sm font-semibold shadow-sm transition hover:border-ember"
              onClick={() => setWalletMenuOpen((open) => !open)}
            >
              <Wallet className="h-4 w-4" />
              <span className="max-w-28 truncate sm:max-w-none">{walletLabel}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {walletMenuOpen ? (
              <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-amber-200 bg-white p-2 shadow-soft">
                {walletMenuConnectors.map((connector) => (
                  <button
                    key={connector.uid}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-semibold transition hover:bg-orange-50"
                    onClick={() => {
                      connect({ connector });
                      setWalletMenuOpen(false);
                    }}
                  >
                    {getWalletMenuLabel(connector.name)}
                    <Wallet className="h-4 w-4 text-ember" />
                  </button>
                ))}
                {isConnected ? (
                  <button
                    className="mt-1 flex w-full items-center justify-between rounded-md border-t border-amber-100 px-3 py-3 text-left text-sm font-semibold text-ember transition hover:bg-orange-50"
                    onClick={() => {
                      disconnect();
                      setWalletMenuOpen(false);
                    }}
                  >
                    Disconnect
                    <LogOut className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        </header>

        <div className="grid flex-1 items-center gap-6 py-6 md:grid-cols-[1fr_0.9fr] md:py-10">
          <section className="rounded-lg border border-amber-200 bg-white p-5 shadow-soft sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-ember">
              <Compass className="h-4 w-4" />
              Onchain skill identity
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Claim a skill badge for your wallet.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              Pick a Web3 skill direction, get instant Skill XP, and attach a badge to your address on Base. No token
              purchase and no WalletConnect flow required.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {skillBadges.map((badge) => {
                const selected = badge.id === selectedBadge.id;
                return (
                  <button
                    key={badge.id}
                    className={`rounded-lg border p-3 text-left transition ${
                      selected ? 'border-ember bg-orange-50' : 'border-amber-100 bg-white hover:border-amber-300'
                    }`}
                    onClick={() => setSelectedBadgeId(badge.id)}
                  >
                    <span className="text-xs font-bold uppercase text-ember">{badge.track}</span>
                    <span className="mt-1 block text-sm font-black leading-5">{badge.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 text-base font-bold text-white shadow-soft transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 sm:w-auto"
              disabled={writePending || txConfirming || switchPending}
              onClick={handleClaim}
            >
              {visibleRewardClaimed ? <BadgeCheck className="h-5 w-5" /> : <Award className="h-5 w-5" />}
              {visibleRewardClaimed
                ? 'Badge Claimed'
                : writePending || txConfirming || switchPending
                  ? 'Claiming'
                  : !isConnected
                    ? 'Connect Wallet First'
                    : 'Claim Skill Badge'}
            </button>

            {statusMessage ? <p className="mt-4 text-sm font-semibold text-ember">{statusMessage}</p> : null}
          </section>

          <aside className="rounded-lg border border-amber-200 bg-[#fffdf7] p-5 shadow-soft sm:p-6">
            <p className="text-sm font-bold uppercase text-ember">Identity Preview</p>
            <div className="mt-4 rounded-lg bg-ink p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-orange-100">{selectedBadge.track}</p>
                  <p className="mt-3 text-3xl font-black">{selectedBadge.reward}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-honey text-ink">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-4 text-xl font-black">{selectedBadge.name}</p>
              <p className="mt-3 text-sm leading-6 text-orange-100">{selectedBadge.description}</p>
              <div className="mt-5 rounded-lg bg-white/10 p-3">
                <p className="text-xs font-bold uppercase text-orange-100">Wallet identity</p>
                <p className="mt-1 break-all text-sm font-semibold">{address ? shortAddress(address) : 'Connect a wallet to show your address'}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {rewardSteps.map((step, index) => {
                const complete =
                  index === 0 ||
                  (index === 1 && isConnected) ||
                  (index === 2 && visibleRewardClaimed) ||
                  (index === 3 && identityShared);
                return (
                  <div key={step} className="flex items-center gap-3 rounded-lg border border-amber-100 bg-white p-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                        complete ? 'bg-honey text-ink' : 'bg-orange-50 text-stone-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold">{step}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 rounded-lg border border-amber-100 bg-orange-50 p-4">
              <p className="text-sm font-bold text-ink">Wallet support</p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Base App embedded wallet, Coinbase Wallet, MetaMask, OKX Wallet, and injected browser wallets.
              </p>
            </div>

            {visibleRewardClaimed ? (
              <button
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-white px-4 text-sm font-bold transition hover:border-ember"
                onClick={handleShareIdentity}
              >
                <Sparkles className="h-4 w-4 text-ember" />
                {identityShared ? 'Identity Shared' : 'Share Skill Identity'}
              </button>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <Providers>
      <BadgeApp />
    </Providers>
  );
}

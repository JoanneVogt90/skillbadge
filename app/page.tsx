'use client';

import { Award, BadgeCheck, ChevronDown, LogOut, Sparkles, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BaseError } from 'viem';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { Providers } from '@/app/providers';
import { skillBadgeAbi } from '@/lib/abi';
import { contractAddress, contractConfigured, configuredChainId, primaryBadge, rewardSteps } from '@/lib/constants';
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

function BadgeApp() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, isPending: connectPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [autoConnectTried, setAutoConnectTried] = useState(false);

  const wrongNetwork = isConnected && chainId !== configuredChainId;
  const canUseContract = contractConfigured && isConnected && !wrongNetwork;

  const { data: badgeRead, refetch: refetchBadge } = useReadContracts({
    contracts: address
      ? [
          {
            address: contractAddress,
            abi: skillBadgeAbi,
            functionName: 'hasBadge',
            args: [address, BigInt(primaryBadge.id)],
          },
        ]
      : [],
    query: { enabled: canUseContract && Boolean(address) },
  });

  const onchainClaimed = Boolean(badgeRead?.[0]?.result);
  const visibleRewardClaimed = rewardClaimed || onchainClaimed;

  const { writeContract, data: txHash, error: writeError, isPending: writePending } = useWriteContract();
  const { isLoading: txConfirming, isSuccess: txSuccess, error: receiptError } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: Boolean(txHash) },
  });

  useEffect(() => {
    if (!txSuccess) return;
    setRewardClaimed(true);
    void refetchBadge();
  }, [refetchBadge, txSuccess]);

  useEffect(() => {
    if (autoConnectTried || isConnected || !isBaseAppBrowser()) return;
    const embeddedConnector = connectors.find((connector) => connector.name.includes('Base App'));
    if (!embeddedConnector) return;
    setAutoConnectTried(true);
    connect({ connector: embeddedConnector });
  }, [autoConnectTried, connect, connectors, isConnected]);

  const walletLabel = useMemo(() => {
    if (address) return shortAddress(address);
    if (connectPending) return 'Connecting';
    return 'Connect Wallet';
  }, [address, connectPending]);

  const statusMessage = wrongNetwork
    ? `Switch to chain ${configuredChainId} to claim onchain.`
    : !contractConfigured
      ? 'Onchain claiming is waiting for a contract address. Your instant reward still works now.'
      : getErrorMessage(writeError || receiptError);

  const handleClaim = () => {
    setRewardClaimed(true);

    if (!canUseContract || onchainClaimed) return;

    writeContract({
      address: contractAddress,
      abi: skillBadgeAbi,
      functionName: 'claimBadge',
      args: [BigInt(primaryBadge.id)],
      dataSuffix: baseBuilderDataSuffix,
    });
  };

  return (
    <main className="min-h-screen bg-cream text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-base font-bold">Warm Badge</span>
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
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-semibold transition hover:bg-orange-50"
                    onClick={() => {
                      connect({ connector });
                      setWalletMenuOpen(false);
                    }}
                  >
                    {connector.name}
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
              <Award className="h-4 w-4" />
              Free Base reward
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">Claim your first builder badge.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
              No token purchase, no relay protocol, no complex flow. Tap once to see your reward instantly, then optionally
              attach it to your wallet on Base.
            </p>

            <button
              className="mt-7 inline-flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-ink px-5 text-base font-bold text-white shadow-soft transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 sm:w-auto"
              disabled={writePending || txConfirming}
              onClick={handleClaim}
            >
              {visibleRewardClaimed ? <BadgeCheck className="h-5 w-5" /> : <Award className="h-5 w-5" />}
              {visibleRewardClaimed ? 'Reward Claimed' : writePending || txConfirming ? 'Claiming' : 'Claim Reward'}
            </button>

            {statusMessage ? <p className="mt-4 text-sm font-semibold text-ember">{statusMessage}</p> : null}
          </section>

          <aside className="rounded-lg border border-amber-200 bg-[#fffdf7] p-5 shadow-soft sm:p-6">
            <p className="text-sm font-bold uppercase text-ember">Reward Preview</p>
            <div className="mt-4 rounded-lg bg-ink p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-orange-100">{primaryBadge.name}</p>
                  <p className="mt-3 text-3xl font-black">{primaryBadge.reward}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-honey text-ink">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-orange-100">{primaryBadge.description}</p>
            </div>

            <div className="mt-5 grid gap-3">
              {rewardSteps.map((step, index) => {
                const complete = index === 0 || (index === 1 && isConnected) || (index === 2 && visibleRewardClaimed);
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

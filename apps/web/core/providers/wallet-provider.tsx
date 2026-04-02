"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { createConfig, createStorage, http, WagmiProvider } from "wagmi";

import { resolveWalletChains } from "@/core/config/chains";
import { env } from "@/core/config/env";

import type { ReactNode } from "react";
import type { Chain } from "viem";

const chains = resolveWalletChains() as [Chain, ...Chain[]];

function createWalletConfig() {
  return createConfig({
    ...getDefaultConfig({
      appName: "Turbo Next Convex",
      appDescription: "Wallet auth",
      appUrl: env.NEXT_PUBLIC_APP_URL,
      walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      chains,
      transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
    }),
    storage: createStorage({
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    }),
  });
}

const walletConfig = createWalletConfig();
const walletQueryClient = new QueryClient();

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={walletConfig} reconnectOnMount>
      <QueryClientProvider client={walletQueryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

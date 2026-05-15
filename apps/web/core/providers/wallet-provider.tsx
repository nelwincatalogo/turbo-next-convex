"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { useEffect, useState } from "react";
import { createConfig, createStorage, http, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";

import { resolveWalletChains } from "@/core/config/chains";
import { env } from "@/core/config/env";

import type { ReactNode } from "react";
import type { Chain } from "viem";
import type { Config } from "wagmi";

// Minimal SSR-safe config: no connectors that access browser APIs (indexedDB, window, etc.)
// Used during server render so wagmi hooks like useDisconnect don't throw.
const ssrConfig = createConfig({
  chains: [mainnet],
  transports: { [mainnet.id]: http() },
  ssr: true,
});

function createWalletConfig() {
  const chains = resolveWalletChains() as [Chain, ...Chain[]];
  return createConfig({
    ...getDefaultConfig({
      appName: "Turbo Next Convex",
      appDescription: "Wallet auth",
      appUrl: env.NEXT_PUBLIC_APP_URL,
      walletConnectProjectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      chains,
      transports: Object.fromEntries(chains.map((chain) => [chain.id, http()])),
    }),
    storage: createStorage({ storage: window.localStorage }),
  });
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<Config>(ssrConfig);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setConfig(createWalletConfig());
  }, []);

  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

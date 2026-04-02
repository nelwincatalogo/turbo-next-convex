import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonAmoy,
  sepolia,
} from "wagmi/chains";

import { env } from "./env";

import type { Chain } from "viem";

const CHAIN_MAP: Record<string, Chain> = {
  mainnet,
  ethereum: mainnet,
  sepolia,
  polygon,
  amoy: polygonAmoy,
  polygonAmoy,
  optimism,
  optimismSepolia,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
};

const DEFAULT_CHAINS: Chain[] = [
  mainnet,
  sepolia,
  polygon,
  polygonAmoy,
  optimism,
  optimismSepolia,
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
];

export function resolveWalletChains(): Chain[] {
  const raw = env.NEXT_PUBLIC_EVM_CHAINS?.trim();
  if (!raw) {
    return DEFAULT_CHAINS;
  }

  const uniqueChains = new Map<number, Chain>();

  for (const token of raw.split(",")) {
    const normalized = token.trim();
    if (!normalized) {
      continue;
    }

    const byName = CHAIN_MAP[normalized];
    if (byName) {
      uniqueChains.set(byName.id, byName);
      continue;
    }

    const chainId = Number(normalized);
    if (Number.isFinite(chainId)) {
      const byId = Object.values(CHAIN_MAP).find((chain) => chain.id === chainId);
      if (byId) {
        uniqueChains.set(byId.id, byId);
      }
    }
  }

  return uniqueChains.size > 0 ? [...uniqueChains.values()] : DEFAULT_CHAINS;
}

"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation } from "convex/react";
import { useTransitionRouter } from "next-view-transitions";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useSignMessage } from "wagmi";

import { env } from "@/core/config/env";
import { api } from "@repo/backend/convex/_generated/api";

const appUrl = new URL(env.NEXT_PUBLIC_APP_URL);

export function useWalletSignin() {
  const router = useTransitionRouter();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync, isPending } = useSignMessage();
  const createNonce = useMutation(api.walletAuth.createNonce);
  const [error, setError] = useState<string | null>(null);
  const lastAutoSigninKeyRef = useRef<string | null>(null);

  const canSignIn = isConnected && !!address && !!chainId;

  const signInWithWallet = useCallback(async () => {
    if (!address || !chainId) {
      setError("Connect a wallet first.");
      return;
    }

    setError(null);

    try {
      const { nonce } = await createNonce({});
      const siwe = new SiweMessage({
        domain: appUrl.host,
        address,
        statement: "Sign in with Ethereum to Turbo Next Convex.",
        uri: appUrl.origin,
        version: "1",
        chainId,
        nonce,
      });

      const message = siwe.prepareMessage();
      const signature = await signMessageAsync({ message });

      await signIn("wallet", {
        message,
        signature,
      });

      router.replace("/dashboard");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Wallet sign in failed");
    }
  }, [address, chainId, createNonce, router, signIn, signMessageAsync]);

  useEffect(() => {
    if (!isConnected || !address || !chainId || isAuthenticated) {
      lastAutoSigninKeyRef.current = null;
      return;
    }

    if (isAuthLoading || isPending) {
      return;
    }

    const autoSigninKey = `${address}:${chainId}`;
    if (lastAutoSigninKeyRef.current === autoSigninKey) {
      return;
    }

    lastAutoSigninKeyRef.current = autoSigninKey;
    void signInWithWallet();
  }, [address, chainId, isAuthLoading, isAuthenticated, isConnected, isPending, signInWithWallet]);

  return {
    canSignIn,
    error,
    isPending,
    signInWithWallet,
  };
}

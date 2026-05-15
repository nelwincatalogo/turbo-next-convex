import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { convexAuth, createAccount, retrieveAccount } from "@convex-dev/auth/server";
import { SiweMessage } from "siwe";

import { internal } from "./_generated/api";

import type { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    ConvexCredentials<DataModel>({
      id: "wallet",
      authorize: async (credentials, ctx) => {
        const message = credentials.message;
        const signature = credentials.signature;

        if (typeof message !== "string" || typeof signature !== "string") {
          throw new Error("Missing wallet signature credentials");
        }

        const siwe = new SiweMessage(message);
        const configuredAppUrl =
          process.env.WALLET_AUTH_APP_URL ??
          process.env.NEXT_PUBLIC_APP_URL ??
          process.env.CONVEX_SITE_URL;

        if (!configuredAppUrl) {
          throw new Error("Missing WALLET_AUTH_APP_URL or CONVEX_SITE_URL");
        }

        const expectedUrl = new URL(configuredAppUrl);
        const expectedDomain = expectedUrl.host;
        const nonceConsumed = await ctx.runMutation(internal.walletAuth.consumeNonce, {
          nonce: siwe.nonce,
        });

        if (!nonceConsumed) {
          throw new Error("Invalid or expired nonce");
        }

        const verification = await siwe.verify({
          signature,
          domain: expectedDomain,
          nonce: siwe.nonce,
          time: new Date().toISOString(),
        });

        if (!verification.success) {
          throw new Error("Invalid wallet signature");
        }

        if (siwe.uri !== expectedUrl.origin) {
          throw new Error("Invalid wallet sign-in origin");
        }

        const address = siwe.address.toLowerCase();
        const allowedChainsRaw = process.env.WALLET_AUTH_CHAIN_IDS;
        const allowedChains = new Set(
          allowedChainsRaw
            ?.split(",")
            .map((value) => Number(value.trim()))
            .filter((value) => Number.isFinite(value)) ?? [],
        );

        if (allowedChains.size > 0 && !allowedChains.has(siwe.chainId)) {
          throw new Error("Unsupported chain");
        }

        try {
          const existing = await retrieveAccount(ctx, {
            provider: "wallet",
            account: { id: address },
          });

          return { userId: existing.user._id };
        } catch {
          const created = await createAccount(ctx, {
            provider: "wallet",
            account: { id: address },
            profile: {
              name: `${address.slice(0, 6)}...${address.slice(-4)}`,
            },
            shouldLinkViaEmail: false,
            shouldLinkViaPhone: false,
          });

          return { userId: created.user._id };
        }
      },
    }),
  ],
});

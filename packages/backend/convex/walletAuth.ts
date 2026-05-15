import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

const NONCE_TTL_MS = 5 * 60 * 1000;

export const createNonce = mutation({
  args: {},
  handler: async (ctx) => {
    const expiredNonces = await ctx.db
      .query("walletAuthNonces")
      .withIndex("expiresAt", (q) => q.lt("expiresAt", Date.now()))
      .collect();

    await Promise.all(expiredNonces.map((nonceDoc) => ctx.db.delete(nonceDoc._id)));

    const nonce = crypto.randomUUID().replaceAll("-", "");
    const expiresAt = Date.now() + NONCE_TTL_MS;

    await ctx.db.insert("walletAuthNonces", {
      nonce,
      expiresAt,
    });

    return { nonce, expiresAt };
  },
});

export const consumeNonce = internalMutation({
  args: { nonce: v.string() },
  handler: async (ctx, args) => {
    const nonceDoc = await ctx.db
      .query("walletAuthNonces")
      .withIndex("nonce", (q) => q.eq("nonce", args.nonce))
      .first();

    if (!nonceDoc || nonceDoc.expiresAt < Date.now()) {
      if (nonceDoc) {
        await ctx.db.delete(nonceDoc._id);
      }
      return false;
    }

    await ctx.db.delete(nonceDoc._id);
    return true;
  },
});

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    const walletAccount = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId).eq("provider", "wallet"))
      .first();

    const walletAddress = walletAccount?.providerAccountId ?? null;

    return {
      userId,
      name: user.name ?? null,
      walletAddress,
      displayName:
        user.name ??
        (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : null),
    };
  },
});

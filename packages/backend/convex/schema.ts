import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { tasks } from "./tasks/schema";

export default defineSchema({
  ...authTables,
  walletAuthNonces: defineTable({
    nonce: v.string(),
    expiresAt: v.number(),
  })
    .index("nonce", ["nonce"])
    .index("expiresAt", ["expiresAt"]),
  tasks,
});

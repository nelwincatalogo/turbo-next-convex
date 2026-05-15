import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.url({
    message: "NEXT_PUBLIC_CONVEX_URL must be a valid URL",
  }),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1, {
    message: "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required",
  }),
  NEXT_PUBLIC_APP_URL: z.url({
    message: "NEXT_PUBLIC_APP_URL must be a valid URL",
  }),
  NEXT_PUBLIC_EVM_CHAINS: z.string().optional(),
});

// Helper to trim strings and convert empty values to undefined
const _normalize = (value: string | undefined) => (value?.trim() ? value : undefined);

// This will throw an error if validation fails
const validateEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_EVM_CHAINS: _normalize(process.env.NEXT_PUBLIC_EVM_CHAINS),
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(z.treeifyError(parsed.error), null, 2),
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
};

export const env = validateEnv();

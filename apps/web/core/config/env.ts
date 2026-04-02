import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z.string().url({
    message: "NEXT_PUBLIC_CONVEX_URL must be a valid URL",
  }),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1, {
    message: "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required",
  }),
  NEXT_PUBLIC_APP_URL: z.string().url({
    message: "NEXT_PUBLIC_APP_URL must be a valid URL",
  }),
  NEXT_PUBLIC_EVM_CHAINS: z.string().optional(),
});

// This will throw an error if validation fails
const validateEnv = () => {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_EVM_CHAINS: process.env.NEXT_PUBLIC_EVM_CHAINS,
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(parsed.error.format(), null, 2),
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
};

export const env = validateEnv();

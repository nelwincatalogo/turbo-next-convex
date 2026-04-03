import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

import type { DataModel } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      profile(params) {
        if (typeof params.email !== "string") {
          throw new Error("Email is required");
        }

        const email = params.email.trim().toLowerCase();
        const name =
          typeof params.fullName === "string"
            ? params.fullName.trim()
            : typeof params.name === "string"
              ? params.name.trim()
              : undefined;

        return {
          name: name || undefined,
          email,
        };
      },
    }),
  ],
});

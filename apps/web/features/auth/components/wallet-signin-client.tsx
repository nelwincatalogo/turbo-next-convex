"use client";

import { ConnectKitButton } from "connectkit";

import { useWalletSignin } from "@/features/auth/hooks/use-wallet-signin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { FieldDescription, FieldError, FieldGroup } from "@repo/ui/components/ui/field";

function WalletSigninCardInner() {
  const { error, isPending } = useWalletSignin();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Sign in with wallet</CardTitle>
        <CardDescription>Connect your EVM wallet to automatically sign in.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <ConnectKitButton />
          {error ? <FieldError errors={[{ message: error }]} /> : null}
          <FieldDescription className="text-center">
            {isPending
              ? "Check your wallet to sign the authentication message."
              : "This app uses wallet-only auth. No passwords required."}
          </FieldDescription>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}

export function WalletSigninClient() {
  return <WalletSigninCardInner />;
}

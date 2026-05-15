"use client";

import { useConvexAuth } from "convex/react";
import { useTransitionRouter } from "next-view-transitions";
import { useEffect, useState } from "react";

import { WalletSigninClient } from "@/features/auth/components/wallet-signin-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

function WalletSigninLoadingCard() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Checking authentication</CardTitle>
        <CardDescription>Restoring your wallet session…</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-sm text-muted-foreground">Please wait.</CardContent>
    </Card>
  );
}

export function WalletSigninEntry() {
  const router = useTransitionRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <WalletSigninLoadingCard />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <WalletSigninClient />;
}

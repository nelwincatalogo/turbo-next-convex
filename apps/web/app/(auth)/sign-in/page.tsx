"use client";

import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { SigninForm } from "@/features/auth/components/signin-form";

export default function SigninPage() {
  return (
    <AuthPageShell>
      <SigninForm />
    </AuthPageShell>
  );
}

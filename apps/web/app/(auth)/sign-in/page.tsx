import { AuthPageShell } from "@/features/auth/components/auth-page-shell";
import { WalletSigninEntry } from "@/features/auth/components/wallet-signin-entry";

export default function SigninPage() {
  return (
    <AuthPageShell>
      <WalletSigninEntry />
    </AuthPageShell>
  );
}

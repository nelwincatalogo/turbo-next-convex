"use client";

import { GalleryVerticalEndIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { SigninForm } from "@/features/auth/components/signin-form";

export default function SigninPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          Acme Inc.
        </Link>
        <SigninForm />
      </div>
    </div>
  );
}

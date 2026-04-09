"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransitionRouter } from "next-view-transitions";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Resolver } from "react-hook-form";

const signinFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signinResolver = zodResolver(
  signinFormSchema as unknown as Parameters<typeof zodResolver>[0],
) as unknown as Resolver<SigninFormValues>;

export type SigninFormValues = z.infer<typeof signinFormSchema>;

export function useSigninForm() {
  const router = useTransitionRouter();
  const { signIn } = useAuthActions();
  const form = useForm<SigninFormValues>({
    resolver: signinResolver,
    mode: "onChange",
  });

  async function onSubmit(values: SigninFormValues) {
    form.clearErrors("root");

    const formData = new FormData();
    formData.set("flow", "signIn");
    formData.set("email", values.email);
    formData.set("password", values.password);

    try {
      await signIn("password", formData);
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in. Please try again.";
      form.setError("root", { message });
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

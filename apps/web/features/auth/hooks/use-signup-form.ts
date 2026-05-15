"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransitionRouter } from "next-view-transitions";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Resolver } from "react-hook-form";

const signupFormSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const signupResolver = zodResolver(
  signupFormSchema as unknown as Parameters<typeof zodResolver>[0],
) as unknown as Resolver<SignupFormValues>;

export type SignupFormValues = z.infer<typeof signupFormSchema>;

export function useSignupForm() {
  const router = useTransitionRouter();
  const { signIn } = useAuthActions();
  const form = useForm<SignupFormValues>({
    resolver: signupResolver,
    mode: "onChange",
  });

  async function onSubmit(values: SignupFormValues) {
    form.clearErrors("root");

    const formData = new FormData();
    formData.set("flow", "signUp");
    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("fullName", values.fullName);
    formData.set("name", values.fullName);

    try {
      await signIn("password", formData);
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign up. Please try again.";
      form.setError("root", { message });
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Resolver } from "react-hook-form";

const forgotPasswordFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const forgotPasswordResolver = zodResolver(
  forgotPasswordFormSchema as unknown as Parameters<typeof zodResolver>[0],
) as unknown as Resolver<ForgotPasswordFormValues>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export function useForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: forgotPasswordResolver,
    mode: "onChange",
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    // TODO: Implement forgot password logic
    console.log("Forgot password form submitted", values);
    setSubmittedEmail(values.email);
  }

  return {
    form,
    submittedEmail,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

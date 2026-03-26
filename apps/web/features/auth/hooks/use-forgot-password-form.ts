"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

export function useForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
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

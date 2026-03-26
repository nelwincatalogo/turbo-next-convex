"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export function useLoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
  });

  function onSubmit(_values: LoginFormValues) {
    // TODO: Implement login logic
    console.log("Login form submitted", _values);
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

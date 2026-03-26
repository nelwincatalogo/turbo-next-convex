"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransitionRouter } from "next-view-transitions";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export type SignupFormValues = z.infer<typeof signupFormSchema>;

export function useSignupForm() {
  const router = useTransitionRouter();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    mode: "onChange",
  });

  function onSubmit(_values: SignupFormValues) {
    // TODO: Implement signup logic
    console.log("Signup form submitted", _values);
    router.push("/sign-in");
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransitionRouter } from "next-view-transitions";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signinFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SigninFormValues = z.infer<typeof signinFormSchema>;

export function useSigninForm() {
  const router = useTransitionRouter();
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(signinFormSchema),
    mode: "onChange",
  });

  function onSubmit(_values: SigninFormValues) {
    // TODO: Implement login logic
    console.log("Signin form submitted", _values);
    router.push("/dashboard");
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}

"use client";

import { Link } from "next-view-transitions";

import { useSignupForm } from "@/features/auth/hooks/use-signup-form";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@repo/ui/components/ui/field";
import { Input } from "@repo/ui/components/ui/input";
import { InputPassword } from "@repo/ui/components/ui/input-password";
import { cn } from "@repo/ui/lib/utils";

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, onSubmit } = useSignupForm();
  const { errors, isSubmitting } = form.formState;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>Enter your email below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form noValidate onSubmit={onSubmit}>
            <FieldGroup>
              <Field data-invalid={!!errors.fullName}>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  aria-invalid={!!errors.fullName}
                  {...form.register("fullName")}
                />
                <FieldError errors={[errors.fullName]} />
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...form.register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={!!errors.password}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <InputPassword
                      id="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      aria-invalid={!!errors.password}
                      {...form.register("password")}
                    />
                    <FieldError errors={[errors.password]} />
                  </Field>

                  <Field data-invalid={!!errors.confirmPassword}>
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <InputPassword
                      id="confirmPassword"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      aria-invalid={!!errors.confirmPassword}
                      {...form.register("confirmPassword")}
                    />
                    <FieldError errors={[errors.confirmPassword]} />
                  </Field>
                </div>
                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
              </Field>

              <Field data-invalid={!!errors.root}>
                <FieldError errors={[errors.root]} />
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  Create Account
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link href="/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}

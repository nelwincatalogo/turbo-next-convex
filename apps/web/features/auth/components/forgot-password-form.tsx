"use client";

import { MailCheckIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/ui/alert";
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
import { cn } from "@repo/ui/lib/utils";

export function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"div">) {
  const { form, submittedEmail, onSubmit } = useForgotPasswordForm();
  const { errors, isSubmitting } = form.formState;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot your password?</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form noValidate onSubmit={onSubmit}>
            <FieldGroup>
              {submittedEmail ? (
                <Alert>
                  <MailCheckIcon className="size-4" />
                  <AlertTitle>Check your inbox</AlertTitle>
                  <AlertDescription>
                    If an account exists for <span className="font-medium">{submittedEmail}</span>,
                    we&apos;ll send a password reset link shortly.
                  </AlertDescription>
                </Alert>
              ) : null}

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
                <Button type="submit" disabled={isSubmitting}>
                  {submittedEmail ? "Resend reset link" : "Send reset link"}
                </Button>
                <FieldDescription className="text-center">
                  Remembered your password? <Link href="/sign-in">Sign in</Link>
                </FieldDescription>
                <FieldDescription className="text-center">
                  Need an account? <Link href="/sign-up">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

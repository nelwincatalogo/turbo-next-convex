import { ArrowRightIcon, DatabaseIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { Link } from "next-view-transitions";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

const features = [
  {
    title: "Authentication flows",
    description:
      "Start with sign up, sign in, and password recovery screens that already fit the rest of the app.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Shared UI foundation",
    description:
      "Build faster with reusable shadcn-based components, consistent spacing, and a clean design system.",
    icon: SparklesIcon,
  },
  {
    title: "Convex-ready stack",
    description:
      "Ship product features on top of a setup that is already wired for modern app workflows.",
    icon: DatabaseIcon,
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="text-base font-semibold tracking-tight">
            Acme Inc.
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#cta" className="transition-colors hover:text-foreground">
              Get started
            </a>
          </nav>

          <Button asChild variant="outline">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </header>

        <section className="flex flex-1 items-center py-16 md:py-24">
          <div className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary">Turbo · Next.js · Convex</Badge>
                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
                    Launch a polished product foundation without starting from zero.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                    A simple starter with clean UI, authentication flows, and room to grow into your
                    next app.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="min-w-40">
                  <Link href="/sign-up">
                    Get started
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="min-w-40">
                  <Link href="/dashboard">Open dashboard</Link>
                </Button>
              </div>
            </div>

            <Card className="border-border/60 bg-muted/40 py-0">
              <CardHeader className="border-b py-6">
                <CardTitle className="text-lg">What you get out of the box</CardTitle>
                <CardDescription>
                  A small but practical starting point for building internal tools, SaaS products,
                  or experiments.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 py-6">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="flex gap-4 rounded-lg border bg-background p-4 shadow-xs"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="font-medium">{feature.title}</h2>
                        <p className="text-sm leading-6 text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-primary">Simple by default</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">
              Enough structure to move fast, without getting in your way.
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Keep the homepage lightweight, point people toward the product, and reuse the same
              design language across the app.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title} className="h-full bg-card/80">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="cta" className="py-16 md:py-24">
          <Card className="border-border/60 bg-muted/50 py-10 text-center">
            <CardHeader className="mx-auto w-full max-w-2xl px-6">
              <CardTitle className="text-3xl font-semibold tracking-tight md:text-4xl">
                Ready to turn the template into your product?
              </CardTitle>
              <CardDescription className="text-base leading-7">
                Start with the included flows, shape the UI to your brand, and ship the first
                version faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-3 px-6 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/sign-up">Create an account</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sign-in">I already have an account</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <footer className="border-t py-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Acme Inc. Built with the shared UI kit.</p>
            <div className="flex items-center gap-4">
              <a href="#features" className="transition-colors hover:text-foreground">
                Features
              </a>
              <Link href="/sign-up" className="transition-colors hover:text-foreground">
                Sign up
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

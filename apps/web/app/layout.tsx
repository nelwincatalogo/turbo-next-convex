import { ViewTransitions } from "next-view-transitions";
import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

import { ConvexClientProvider } from "@/core/providers/convex-provider";
import { WalletProvider } from "@/core/providers/wallet-provider";
import "@repo/ui/globals.css";
import UiProviders from "@repo/ui/ui-providers";

import type { Metadata } from "next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vercel.com"),
  title: "Next-Tailwind Starter Template",
  description: "Starter Template",
  keywords: ["nextjs", "tailwindcss", "template", "starter", "kit"],
  openGraph: {
    siteName: "Next-Tailwind Starter Template",
    title: "Next-Tailwind Starter Template",
    description: "Starter Template",
    images: "/banner.png",
    type: "website",
  },
  twitter: {
    title: "Next-Tailwind Starter Template",
    description: "Starter Template",
    images: "/banner.png",
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`scroll-smooth ${geistSans.variable} ${jetbrainsMono.variable}`}>
        <body>
          <ConvexClientProvider>
            <WalletProvider>
              <UiProviders>{children}</UiProviders>
            </WalletProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}

"use client";

import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { useIsMobile } from "./hooks/use-mobile";
import "./styles/globals.css";

export default function UiProviders({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      {children}
      <Toaster position={isMobile ? "top-center" : "bottom-right"} />
    </TooltipProvider>
  );
}

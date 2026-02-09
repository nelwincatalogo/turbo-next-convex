"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Loading from ".";

export function LoadingButton({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button disabled className={cn("", className)} {...props}>
      <Loading className="mr-2" />
      {children ? children : "Loading"}
    </Button>
  );
}

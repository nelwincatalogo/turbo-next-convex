"use client";

import { cn } from "../../../lib/utils";

import Loading from ".";
import { Button } from "../../ui/button";

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

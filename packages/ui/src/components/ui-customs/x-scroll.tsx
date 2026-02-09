"use client";

import { ScrollAreaProps } from "@radix-ui/react-scroll-area";

import { cn } from "../../lib/utils";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface XScrollProps extends ScrollAreaProps {
  className?: string;
}

export default function XScroll({ children, className, ...props }: XScrollProps) {
  return (
    <div className="flex">
      <ScrollArea className={cn("w-1 flex-1", className)} {...props}>
        {children}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

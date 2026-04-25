import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-border/90 bg-background/90 px-4 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:shadow-[0_0_0_6px_rgba(183,46,9,0.08)]",
        className
      )}
      {...props}
    />
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-[1.75rem] border border-border/80 bg-background/85 px-4 py-2 text-sm font-medium outline-none transition-all duration-200 placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background/50 hover:border-border/70",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

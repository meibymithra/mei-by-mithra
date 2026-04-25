import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { 
  variant?: "default" | "outline" | "secondary" | "destructive" 
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-2 text-xs font-medium transition-colors duration-200",
        variant === "default" ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/90" :
        variant === "outline" ? "border-border/60 bg-transparent hover:bg-muted/50" :
        variant === "secondary" ? "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90" :
        variant === "destructive" ? "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90" :
        "bg-transparent",
        className
      )}
      {...props}
    />
  );
}

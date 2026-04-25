import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "default" | "lg";
  asChild?: boolean;
};

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default:
    "bg-primary text-primary-foreground shadow-[0_18px_40px_-18px_rgba(183,46,9,0.6)] hover:-translate-y-0.5 hover:bg-primary/90",
  secondary:
    "bg-secondary text-secondary-foreground shadow-[0_16px_32px_-18px_rgba(132,161,143,0.7)] hover:-translate-y-0.5 hover:bg-secondary/90",
  outline: "border border-border bg-background/80 hover:-translate-y-0.5 hover:bg-muted/70",
  ghost: "bg-transparent hover:bg-muted/70",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-3 text-sm",
  default: "h-11 px-5",
  lg: "h-12 px-6 text-base"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          (children.props as { className?: string }).className,
          className
        )
      });
    }
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

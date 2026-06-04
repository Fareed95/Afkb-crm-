import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-150 ease-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] active:brightness-95",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:brightness-110",
        secondary: "bg-muted text-foreground hover:bg-muted/70 shadow-sm",
        outline: "border border-border bg-transparent hover:bg-muted shadow-sm",
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:brightness-110",
        ghost: "hover:bg-muted text-muted-foreground hover:text-foreground"
      },
      size: {
        default: "h-11 px-5",
        lg: "h-12 px-6 text-base",
        sm: "h-9 px-3 text-xs",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

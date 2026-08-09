import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

// shadcn's Button, themed to the app's tokens rather than shadcn's default
// palette: "default" is the teal (bg-secondary) used by the nav and every
// submit, "destructive" is the brand red. This keeps the existing look while
// giving every button one source of truth for variants and sizes.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-secondary text-white hover:brightness-95",
        destructive: "bg-danger text-white hover:brightness-95",
        outline: "border border-primary/30 text-primary hover:bg-primary/5",
        secondary: "bg-primary/5 text-primary hover:bg-primary/10",
        ghost: "text-primary hover:bg-primary/5",
        link: "text-secondary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef(
  (
    { className, variant, size, asChild = false, loading = false, disabled, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;

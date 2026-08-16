import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest",
  {
    variants: {
      variant: {
        default: "bg-secondary/15 text-secondary",
        muted: "bg-primary/10 text-primary/60",
        outline: "border border-primary/20 text-primary/70",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
export default Badge;

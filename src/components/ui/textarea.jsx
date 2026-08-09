import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, rows = 6, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "flex w-full rounded-control border border-primary/30 bg-white px-3 py-2 text-xs transition-colors placeholder:text-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
export default Textarea;

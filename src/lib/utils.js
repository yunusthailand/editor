import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// The shadcn class-merge helper: clsx resolves conditionals, twMerge dedupes
// conflicting Tailwind utilities so a caller's `className` can override a
// component's defaults (e.g. passing `bg-danger` wins over a default `bg-*`).
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

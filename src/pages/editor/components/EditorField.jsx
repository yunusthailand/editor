import { FaChevronDown } from "react-icons/fa6";
import { cn } from "@/lib/utils";

// One control style for every input in the sidebar, so a text box, a select and
// a textarea read as the same family. Filled rather than outlined (the iOS
// grouped-list look): a quiet gray well that turns white with a soft accent
// ring when focused, so the active field is the clearest thing on screen.
export const CONTROL =
  "min-h-10 w-full rounded-control border border-transparent bg-neutral-100 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 transition-[background-color,box-shadow,border-color] duration-150 hover:bg-neutral-200/70 focus-visible:border-secondary focus-visible:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/25 disabled:opacity-50 motion-reduce:transition-none";

// A labelled control. Passing `htmlFor` renders a real <label> so clicking the
// text focuses the input; controls with no single input (the image pickers)
// omit it and get a plain caption instead of an orphaned label.
export function Field({ label, htmlFor, hint, badge, className, children }) {
  const Caption = htmlFor ? "label" : "span";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Caption
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-700"
      >
        {label}
        {badge}
      </Caption>
      {children}
      {hint && (
        <p className="text-xs leading-relaxed text-neutral-600">{hint}</p>
      )}
    </div>
  );
}

// Marks a field as showing the Thai version while the editor is in Thai mode.
export function LangBadge() {
  return (
    <span className="rounded-pill bg-secondary-y/30 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-neutral-800">
      TH
    </span>
  );
}

// Native <select> (so keyboard and mobile pickers keep working) with the
// browser arrow swapped for one that matches the rest of the panel.
export function SelectField({ className, children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cn(CONTROL, "cursor-pointer appearance-none pr-9", className)}
      >
        {children}
      </select>
      <FaChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-neutral-500"
      />
    </div>
  );
}

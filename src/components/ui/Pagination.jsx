import { IoChevronBack, IoChevronForward } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

// First page, last page, and a window around the current one. Rendering every
// page number is fine at 4 pages and unusable at 40.
function pageWindow(page, maxPage) {
  const pages = new Set([1, maxPage, page, page - 1, page + 1]);
  const visible = [...pages]
    .filter((p) => p >= 1 && p <= maxPage)
    .sort((a, b) => a - b);

  return visible.reduce((acc, p, i) => {
    if (i > 0 && p - visible[i - 1] > 1) acc.push("gap");
    acc.push(p);
    return acc;
  }, []);
}

// shadcn's pagination layout — centered row of ghost/outline "link" buttons —
// reusing buttonVariants so it shares the app's theme. The active page reads as
// an outlined button; prev/next collapse to chevrons.
export default function Pagination({
  page,
  maxPage,
  onChange,
  totalItems = 0,
  pageSize,
  shown = 0,
}) {
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = (page - 1) * pageSize + shown;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-1 disabled:opacity-40",
        )}
      >
        <IoChevronBack className="size-4" />
        Prev
      </button>

      {pageWindow(page, maxPage).map((p, i) =>
        p === "gap" ? (
          <span
            key={`gap-${i}`}
            className="px-2 text-sm text-primary/50 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: p === page ? "outline" : "ghost",
                size: "icon",
              }),
              p === page && "border-secondary text-secondary pointer-events-none",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= maxPage}
        aria-label="Next page"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "gap-1 disabled:opacity-40",
        )}
      >
        Next
        <IoChevronForward className="size-4" />
      </button>

      <span className="w-full text-center text-xs text-primary/60 sm:ml-auto sm:w-auto">
        Showing {from}–{to} of {totalItems}
      </span>
    </div>
  );
}

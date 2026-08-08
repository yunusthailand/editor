import clsx from "clsx";

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

const STEP =
  "border px-4 py-2 rounded-pill text-sm transition-all hover:bg-secondary hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary";

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
    <div className="bg-white rounded-card p-6 text-primary flex flex-wrap items-center gap-4 shadow-card">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className={STEP}
        aria-label="Previous page"
      >
        ‹
      </button>

      {pageWindow(page, maxPage).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={clsx(
              "border px-4 py-2 rounded-pill text-sm transition-all",
              "hover:bg-secondary hover:text-white",
              p === page && "bg-secondary text-white pointer-events-none",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= maxPage}
        className={STEP}
        aria-label="Next page"
      >
        ›
      </button>

      <span className="text-xs ml-auto">
        Showing {from}–{to} of {totalItems}
      </span>
    </div>
  );
}

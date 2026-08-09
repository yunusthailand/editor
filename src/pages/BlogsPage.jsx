import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { mapDatabaseImages } from "@/utils/helpers";
import { apiFetch } from "@/lib/api";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import clsx from "clsx";

import BlogCard from "@/components/blogs/BlogCard";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";

const PAGE_SIZE = 8;
const SEARCH_DEBOUNCE_MS = 350;

// One key per option keeps the control a plain <select>; the column/direction
// pair is only assembled when building the query.
const SORT_OPTIONS = [
  { key: "updated_desc", label: "Last edited", sort: "updated_at", order: "desc" },
  { key: "updated_asc", label: "Least recently edited", sort: "updated_at", order: "asc" },
  { key: "created_desc", label: "Newest first", sort: "created_at", order: "desc" },
  { key: "created_asc", label: "Oldest first", sort: "created_at", order: "asc" },
  { key: "title_asc", label: "Title A–Z", sort: "title", order: "asc" },
  { key: "title_desc", label: "Title Z–A", sort: "title", order: "desc" },
];

const EMPTY_FILTERS = {
  findAuthor: "",
  findSearch: "",
  findStarred: "",
  findCategory: "",
  findSubcategory: "",
  findRecent: "",
  findStatus: "",
};

function buildBlogParams({ filters, page, sortKey }) {
  const query = new URLSearchParams();
  const activeSort =
    SORT_OPTIONS.find((opt) => opt.key === sortKey) ?? SORT_OPTIONS[0];

  query.append("page", page);
  query.append("limit", PAGE_SIZE);
  query.append("sort", activeSort.sort);
  query.append("order", activeSort.order);

  if (filters.findAuthor) query.append("author", filters.findAuthor);
  if (filters.findSearch) query.append("search", filters.findSearch);
  if (filters.findStarred !== "") query.append("starred", filters.findStarred);
  if (filters.findRecent !== "") query.append("recent", filters.findRecent);
  if (filters.findCategory) query.append("category", filters.findCategory);
  if (filters.findSubcategory)
    query.append("subcategory", filters.findSubcategory);
  if (filters.findStatus) query.append("status", filters.findStatus);

  return query.toString();
}

// The backend already applies the sort; re-sorting here could only ever
// reorder the current page's slice.
async function fetchBlogs({ filters, page, sortKey }) {
  const result = await apiFetch(`/blog?${buildBlogParams({ filters, page, sortKey })}`);

  return {
    blogs: result.data.map((blog) => mapDatabaseImages(blog)),
    maxPage: result.meta.totalPages,
    totalItems: result.meta.totalItems,
  };
}

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("updated_desc");
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // The text input is immediate so typing stays responsive; the debounced copy
  // in `filters` is what actually triggers a fetch.
  const [searchInput, setSearchInput] = useState("");

  const queryClient = useQueryClient();

  // The query key is the full request identity — filters, page and sort. React
  // Query dedupes, caches per key, and (with keepPreviousData) keeps the last
  // page on screen while the next loads. That replaces the manual requestId
  // race guard: a stale response can no longer overwrite a newer one, because
  // each key owns its own cache entry.
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["blogs", filters, page, sortKey],
    queryFn: () => fetchBlogs({ filters, page, sortKey }),
    placeholderData: keepPreviousData,
  });

  const blogs = data?.blogs ?? [];
  const maxPage = data?.maxPage ?? 1;
  const totalItems = data?.totalItems ?? 0;

  const refetchBlogs = () =>
    queryClient.invalidateQueries({ queryKey: ["blogs"] });

  const deleteBlog = useMutation({
    mutationFn: (id) => apiFetch(`/blog/${id}`, { method: "DELETE" }),
    onSuccess: refetchBlogs,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) =>
        prev.findSearch === searchInput
          ? prev
          : { ...prev, findSearch: searchInput },
      );
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Any filter or sort change invalidates the current page number: changing one
  // while on page 5 would otherwise request page 5 of a possibly 1-page result
  // and show nothing. React batches these into a single render and fetch.
  function updateFilters(next) {
    setFilters(next);
    setPage(1);
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setSearchInput("");
    setPage(1);
  }

  function updateSort(key) {
    setSortKey(key);
    setPage(1);
  }

  return (
    <div className="flex flex-col space-y-6 mx-auto max-w-[960px]">
      <BlogBar />

      <BlogFilter
        filters={filters}
        setFilters={updateFilters}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        sortKey={sortKey}
        setSortKey={updateSort}
        onReset={resetFilters}
      />

      <Pagination
        page={page}
        maxPage={maxPage}
        onChange={setPage}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        shown={blogs.length}
      />

      <Blogs
        blogs={blogs}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error?.message}
        onRetry={refetch}
        refetchBlogs={refetchBlogs}
        deleteBlog={(id) => deleteBlog.mutate(id)}
      />
    </div>
  );
}

function Blogs({
  blogs,
  isLoading,
  isFetching,
  isError,
  error,
  onRetry,
  refetchBlogs,
  deleteBlog,
}) {
  if (isError) {
    return (
      <EmptyState
        title="Could not load blogs"
        message={error}
        action={<Button onClick={onRetry}>Retry</Button>}
      />
    );
  }

  // `!isLoading` rather than a success flag: only claim "no matches" once the
  // first load has resolved, so the empty state never flashes before data.
  if (!isLoading && !blogs.length) {
    return (
      <EmptyState
        title="No blogs match these filters"
        message="Try widening the search or clearing a filter."
      />
    );
  }

  return (
    <div
      className={clsx(
        "flex justify-start flex-wrap gap-4 mx-auto w-11/12 transition-opacity",
        isFetching && "opacity-50",
      )}
    >
      {isFetching && (
        <div className="w-full flex justify-center py-2">
          <Spinner />
        </div>
      )}
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          getBlogs={refetchBlogs}
          deleteBlog={() => deleteBlog(blog.id)}
        />
      ))}
    </div>
  );
}

function BlogBar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <PageHeader title="Blogs" />

      <Button onClick={() => navigate("/editor")}>+ Create New Blog</Button>
    </div>
  );
}

function BlogFilter({
  filters = {},
  setFilters,
  searchInput,
  setSearchInput,
  sortKey,
  setSortKey,
  onReset,
}) {
  // includeHidden so placeholder authors (e.g. the blog-author fallback) remain
  // filterable here even once they're off the public roster.
  const { data: members = [] } = useTeamMembers();

  // Subcategories only exist under "knowledge", so the two selects are coupled:
  // picking a subcategory implies that category, and leaving it clears them.
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "findCategory" && value !== "knowledge") {
      setFilters((prev) => ({
        ...prev,
        [name]: value || "",
        findSubcategory: "",
      }));

      return;
    }

    if (name === "findSubcategory") {
      setFilters((prev) => ({
        ...prev,
        findCategory: "knowledge",
        [name]: value || "",
      }));

      return;
    }

    setFilters((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  return (
    <section className="flex flex-col items-stretch justify-between gap-y-6">
      <div className="flex flex-wrap gap-3 text-xs text-primary">
        <input
          type="text"
          name="findSearch"
          value={searchInput}
          placeholder="Search..."
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-9 rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        />

        <select
          name="sort"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="h-9 rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              Sort: {opt.label}
            </option>
          ))}
        </select>

        <select
          name="findAuthor"
          value={filters.findAuthor}
          onChange={handleChange}
          className="h-9 rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <option value="">- Select Author -</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>

        <select
          name="findCategory"
          value={filters.findCategory}
          onChange={handleChange}
          className="h-9 rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <option value="">- Select Category -</option>
          <option value="perspectives">Perspectives</option>
          <option value="knowledge">Knowledge</option>
        </select>

        <select
          name="findSubcategory"
          value={filters.findSubcategory}
          onChange={handleChange}
          className="h-9 rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <option value="">- Select Subcategory -</option>
          <option value="publication">Publication</option>
          <option value="press-release">Press Release</option>
          <option value="case-studies">Case Studies</option>
          <option value="toolkit">Toolkit</option>
          <option value="videos">Videos</option>
        </select>

        <select
          name="findStarred"
          value={filters.findStarred}
          onChange={handleChange}
          className="h-9 rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <option value="">- Select Starred -</option>
          <option value="true">Starred</option>
          <option value="false">Not Starred</option>
        </select>

        <select
          name="findRecent"
          value={filters.findRecent}
          onChange={handleChange}
          className="h-9 rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <option value="">- Select Recent -</option>
          <option value="true">Recent</option>
          <option value="false">Not Recent</option>
        </select>

        <select
          name="findStatus"
          value={filters.findStatus}
          onChange={handleChange}
          className="h-9 rounded-control border border-primary/30 bg-white px-3 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <option value="">- Select Status -</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button variant="destructive" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </section>
  );
}


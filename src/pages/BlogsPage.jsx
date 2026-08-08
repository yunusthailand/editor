import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapDatabaseImages } from "@/utils/helpers";
import clsx from "clsx";

import BlogCard from "@/components/blogs/BlogCard";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [sortKey, setSortKey] = useState("updated_desc");
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  // The text input is immediate so typing stays responsive; the debounced copy
  // in `filters` is what actually triggers a fetch.
  const [searchInput, setSearchInput] = useState("");

  // Debounced search plus fast filter clicks means responses can arrive out of
  // order. Only the newest request is allowed to write to state.
  const requestId = useRef(0);

  async function getBlogs() {
    const id = ++requestId.current;

    setStatus("loading");

    try {
      const query = new URLSearchParams();
      const activeSort =
        SORT_OPTIONS.find((opt) => opt.key === sortKey) ?? SORT_OPTIONS[0];

      query.append("page", page);
      query.append("limit", PAGE_SIZE);
      query.append("sort", activeSort.sort);
      query.append("order", activeSort.order);

      if (filters.findAuthor) query.append("author", filters.findAuthor);

      if (filters.findSearch) query.append("search", filters.findSearch);

      if (filters.findStarred !== "")
        query.append("starred", filters.findStarred);

      if (filters.findRecent !== "") query.append("recent", filters.findRecent);

      if (filters.findCategory) query.append("category", filters.findCategory);

      if (filters.findSubcategory)
        query.append("subcategory", filters.findSubcategory);

      if (filters.findStatus) query.append("status", filters.findStatus);

      const response = await fetch(`${apiUrl}/blog?${query.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP ERROR ${response.status}`);
      }

      const result = await response.json();

      if (id !== requestId.current) return;

      // The backend already applies the sort; re-sorting here could only ever
      // reorder the current page's slice.
      setBlogs(result.data.map((blog) => mapDatabaseImages(blog)));
      setMaxPage(result.meta.totalPages);
      setTotalItems(result.meta.totalItems);
      setError(null);
      setStatus("success");
    } catch (err) {
      if (id !== requestId.current) return;

      console.error(err);
      setError(err.message || "Could not load blogs");
      setStatus("error");
    }
  }

  async function deleteBlog(id) {
    try {
      const res = await fetch(`${apiUrl}/blog/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete blog");
      }

      getBlogs();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not delete blog");
      setStatus("error");
    }
  }

  useEffect(() => {
    getBlogs();
  }, [filters, page, sortKey]);

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
    <main className="flex flex-col space-y-6 mx-auto max-w-[960px]">
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

      <BlogPagination
        page={page}
        setPage={setPage}
        maxPage={maxPage}
        totalItems={totalItems}
        shown={blogs.length}
      />

      <Blogs
        blogs={blogs}
        status={status}
        error={error}
        getBlogs={getBlogs}
        deleteBlog={deleteBlog}
      />
    </main>
  );
}

function Blogs({ blogs, status, error, getBlogs, deleteBlog }) {
  if (status === "error") {
    return (
      <div className="mx-auto w-11/12 space-y-3 text-primary">
        <p className="text-secondary-r">Could not load blogs: {error}</p>
        <button
          onClick={getBlogs}
          className="bg-secondary-t text-white px-4 py-2 rounded-lg text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === "success" && !blogs.length) {
    return (
      <p className="mx-auto w-11/12 text-primary">
        No blogs match these filters.
      </p>
    );
  }

  return (
    <div
      className={clsx(
        "flex justify-start flex-wrap gap-4 mx-auto w-11/12 transition-opacity",
        status === "loading" && "opacity-50",
      )}
    >
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          getBlogs={getBlogs}
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
      <h1 className="text-3xl font-bold">Blogs</h1>

      <button
        className="bg-primary hover:bg-teal-500 transition-all text-white p-4 rounded-lg text-sm"
        onClick={() => navigate("/editor")}
      >
        + Create New Blog
      </button>
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
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function getMembers() {
      try {
        // includeHidden so placeholder authors (e.g. the blog-author fallback)
        // remain filterable here even once they're off the public roster.
        const response = await fetch(`${apiUrl}/team/all?includeHidden=true`);

        if (!response.ok) throw new Error("Failed to fetch members");

        setMembers(await response.json());
      } catch (err) {
        console.error(err);
      }
    }

    getMembers();
  }, []);

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
          className="border p-2 rounded-lg"
        />

        <select
          name="sort"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="border p-2 rounded-lg"
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
          className="border p-2 rounded-lg"
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
          className="border p-2 rounded-lg"
        >
          <option value="">- Select Category -</option>
          <option value="perspectives">Perspectives</option>
          <option value="knowledge">Knowledge</option>
        </select>

        <select
          name="findSubcategory"
          value={filters.findSubcategory}
          onChange={handleChange}
          className="border p-2 rounded-lg"
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
          className="border p-2 rounded-lg"
        >
          <option value="">- Select Starred -</option>
          <option value="true">Starred</option>
          <option value="false">Not Starred</option>
        </select>

        <select
          name="findRecent"
          value={filters.findRecent}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        >
          <option value="">- Select Recent -</option>
          <option value="true">Recent</option>
          <option value="false">Not Recent</option>
        </select>

        <select
          name="findStatus"
          value={filters.findStatus}
          onChange={handleChange}
          className="border p-2 rounded-lg"
        >
          <option value="">- Select Status -</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          className="bg-secondary-r p-2 rounded-lg text-white"
          onClick={onReset}
        >
          <span className="text-sm">Reset Filters</span>
        </button>
      </div>
    </section>
  );
}

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

function BlogPagination({ page, setPage, maxPage, totalItems, shown }) {
  const from = totalItems === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = (page - 1) * PAGE_SIZE + shown;

  return (
    <div className="bg-white rounded-2xl p-6 text-primary flex flex-wrap items-center gap-4">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
        className="border px-4 py-2 rounded-full text-sm transition-all hover:bg-secondary-t hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary"
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
            onClick={() => setPage(p)}
            className={clsx(
              "border px-4 py-2 rounded-full text-sm transition-all",
              "hover:bg-secondary-t hover:text-white",
              p === page && "bg-secondary-t text-white pointer-events-none",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page >= maxPage}
        className="border px-4 py-2 rounded-full text-sm transition-all hover:bg-secondary-t hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary"
      >
        ›
      </button>

      <span className="text-xs ml-auto">
        Showing {from}–{to} of {totalItems}
      </span>
    </div>
  );
}

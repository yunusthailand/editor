import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mapDatabaseImages } from "@/utils/helpers";
import clsx from "clsx";

import BlogCard from "@/components/blogs/BlogCard";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    findAuthor: "",
    findSearch: "",
    findStarred: "",
    findCategory: "",
    findSubcategory: "",
    findRecent: "",
    findStatus: "",
  });

  async function getBlogs() {
    try {
      const query = new URLSearchParams();

      query.append("page", page);
      query.append("limit", 8);

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

      // The backend already orders by updated_at DESC. Re-sorting here would
      // only ever reorder the current page's slice, never across pages.
      setBlogs(result.data.map((blog) => mapDatabaseImages(blog)));
      setMaxPage(result.meta.totalPages);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not load blogs");
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
      console.log("Error :", err);
    }
  }

  useEffect(() => {
    getBlogs();
  }, [filters, page]);

  // Any filter change invalidates the current page number: filtering while on
  // page 5 would otherwise request page 5 of a possibly 1-page result and show
  // nothing. React batches these, so it stays a single render and one fetch.
  function updateFilters(next) {
    setFilters(next);
    setPage(1);
  }

  return (
    <main className="flex flex-col space-y-6 mx-auto max-w-[960px]">
      <BlogBar />
      <BlogFilter filters={filters} setFilters={updateFilters} />

      <BlogPagination page={page} setPage={setPage} maxPage={maxPage} />

      <Blogs
        blogs={blogs}
        error={error}
        getBlogs={getBlogs}
        deleteBlog={deleteBlog}
      />
    </main>
  );
}

function Blogs({ blogs, error, getBlogs, deleteBlog }) {
  if (error) {
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

  return (
    <div className="flex justify-start flex-wrap gap-4 mx-auto w-11/12">
      {blogs.length ? (
        blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            getBlogs={getBlogs}
            deleteBlog={() => deleteBlog(blog.id)}
          />
        ))
      ) : (
        <p className="text-primary">No blogs match these filters.</p>
      )}
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

function BlogFilter({ filters = {}, setFilters }) {
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
          value={filters.findSearch || ""}
          placeholder="Search..."
          onChange={handleChange}
          className="border p-2 rounded-lg"
        />

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
          onClick={() =>
            setFilters({
              findAuthor: "",
              findSearch: "",
              findStarred: "",
              findCategory: "",
              findSubcategory: "",
              findRecent: "",
              findStatus: "",
            })
          }
        >
          <span className="text-sm">Reset Filters</span>
        </button>
      </div>
    </section>
  );
}

function BlogPagination({ page, setPage, maxPage }) {
  const pages = Array.from({ length: maxPage }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-2xl p-6 text-primary flex flex-wrap gap-4">
      {pages.map((p) => (
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
      ))}
    </div>
  );
}

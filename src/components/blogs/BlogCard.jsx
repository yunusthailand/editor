import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { FaStar, FaRegStar } from "react-icons/fa";
import { MdUpdate, MdHistory } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const CARD_SELECT =
  "h-8 flex-1 rounded-control border border-primary/30 bg-white px-2 text-xs text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40";

export default function BlogCard({ blog, getBlogs, deleteBlog }) {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);

  function handleEdit() {
    navigate(`/editor/${blog.id}`);
  }

  function handleDelete() {
    setShowConfirm(false);
    deleteBlog();
  }

  async function changeStatus(field, value = null) {
    try {
      const formData = new FormData();

      formData.append(field, value !== null ? value : !blog[field]);

      const response = await fetch(`${apiUrl}/blog/${blog.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Can't update blog ${field}`);
      }

      await response.json();

      getBlogs();
    } catch (error) {
      console.log("Error updating:", error);
    }
  }

  return (
    <Card className="w-52 p-4 flex flex-col gap-3 relative">
      {/* confirmation modal */}
      {showConfirm && (
        <div className="absolute inset-0 bg-white/95 flex flex-col justify-center items-center gap-4 rounded-card z-10">
          <p className="text-sm">Delete this blog?</p>

          <div className="flex justify-center gap-2">
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* image */}
      <div className="relative rounded-control overflow-hidden">
        <img
          src={blog.metadata.headerPicture}
          alt={blog.metadata.title}
          className="w-full h-24 object-cover"
        />
      </div>

      {/* title */}
      <p className="text-xs font-medium line-clamp-2 min-h-[2rem]">
        {blog.metadata.title}
      </p>

      {/* status */}
      <div className="flex items-center gap-2 text-xs">
        <label htmlFor={`status-${blog.id}`} className="text-primary/60">
          Status
        </label>
        <select
          id={`status-${blog.id}`}
          value={blog.status}
          onChange={(e) => changeStatus("status", e.target.value)}
          className={CARD_SELECT}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* toggles */}
      <div className="flex gap-4 text-xs items-center justify-between">
        <div className="flex gap-1 items-center">
          <span className="text-primary/60">Starred</span>
          <motion.button
            type="button"
            key={blog.starred ? "on" : "off"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer"
            onClick={() => changeStatus("starred")}
            aria-label="Toggle starred"
          >
            {blog.starred ? (
              <FaStar className="text-secondary-y" />
            ) : (
              <FaRegStar className="text-primary/30" />
            )}
          </motion.button>
        </div>

        <div className="flex gap-1 items-center">
          <span className="text-primary/60">Recent</span>
          <motion.button
            type="button"
            key={blog.recent ? "recent" : "old"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer"
            onClick={() => changeStatus("recent")}
            aria-label="Toggle recent"
          >
            {blog.recent ? (
              <MdUpdate className="text-secondary" />
            ) : (
              <MdHistory className="text-primary/30" />
            )}
          </motion.button>
        </div>
      </div>

      {/* actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="flex-1"
        >
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowConfirm(true)}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </Card>
  );
}

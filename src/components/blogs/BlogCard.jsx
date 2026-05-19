import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { FaStar, FaRegStar } from "react-icons/fa";
import { MdUpdate, MdHistory } from "react-icons/md";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

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
    <div className="bg-white rounded-2xl justify-between w-52 p-4 text-primary flex flex-col gap-4 relative">
      {/* confirmation modal */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center rounded-2xl z-10">
          <div className="bg-white p-4 rounded-lg text-center space-y-4 w-40">
            <p className="text-sm">Are you sure?</p>

            <div className="flex justify-center text-sm gap-2">
              <button
                onClick={handleDelete}
                className="bg-secondary-r text-white px-2 py-1 rounded"
              >
                Delete
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="border px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* status */}
      <div className="text-xs">
        <label htmlFor={`status-${blog.id}`} className="mr-2">
          Status:
        </label>

        <select
          id={`status-${blog.id}`}
          value={blog.status}
          onChange={(e) => changeStatus("status", e.target.value)}
          className="border p-1 rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* icons */}
      <div className="flex gap-4 text-xs items-center justify-between">
        {/* starred */}
        <div className="flex gap-1 items-center">
          <p>Starred</p>

          <motion.div
            key={blog.starred ? "on" : "off"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer"
            onClick={() => changeStatus("starred")}
          >
            {blog.starred ? (
              <FaStar className="text-yellow-500" />
            ) : (
              <FaRegStar className="text-gray-400" />
            )}
          </motion.div>
        </div>

        {/* recent */}
        <div className="flex gap-1 items-center">
          <p>Recent</p>

          <motion.div
            key={blog.recent ? "recent" : "old"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="cursor-pointer"
            onClick={() => changeStatus("recent")}
          >
            {blog.recent ? (
              <MdUpdate className="text-green-600" />
            ) : (
              <MdHistory className="text-gray-400" />
            )}
          </motion.div>
        </div>
      </div>

      {/* image */}
      <div className="relative rounded-2xl overflow-hidden">
        <img
          src={blog.metadata.headerPicture}
          alt={blog.metadata.title}
          className="w-full h-24 object-cover"
        />
      </div>

      {/* title */}
      <p className="text-xs line-clamp-2">{blog.metadata.title}</p>

      {/* actions */}
      <div className="flex gap-4 text-xs">
        <button onClick={handleEdit} className="rounded-lg border p-2 bg-white">
          Edit
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          className="bg-secondary-r text-white rounded-lg border p-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

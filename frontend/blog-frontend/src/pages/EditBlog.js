"use client";

import { useState } from "react";
import axios from "axios";

const EditBlog = ({ blog, onClose, onUpdate }) => {
  const [title, setTitle] = useState(blog.title);
  const [description, setDescription] = useState(blog.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/v1/api/blogs/${blog._id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(response.data.data);
      onClose();
    } catch (err) {
      setError("Failed to update the blog.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Blog</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;

"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateBlog = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    tags: [],
    coverImage: null,
  });

  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, coverImage: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized! Please log in.");
      return;
    }

    const blogData = new FormData();
    blogData.append("title", formData.title);
    blogData.append("slug", formData.slug);
    blogData.append("description", formData.description);
    blogData.append("content", formData.content);
    formData.tags.forEach((tag) => blogData.append("tags[]", tag));
    if (formData.coverImage) {
      blogData.append("coverImage", formData.coverImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/v1/api/blogs/create-blog",
        blogData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/blogs");

      const newBlog = response.data.data;
      onCreate(newBlog);
      onClose();

      console.log("Blog created successfully:", newBlog);
    } catch (err) {
      console.error("API Error:", err.response ? err.response.data : err);
      setError("Failed to create blog. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Create New Blog</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-3 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 h-24"
            required
          />
          <div>
            <input
              type="text"
              placeholder="Add tag and press Enter"
              value={tagInput}
              onChange={handleTagInput}
              onKeyDown={handleAddTag}
              className="w-full p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-wrap mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm mr-2 mb-2 flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="relative flex flex-col items-center">
            <label className="bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-600 transition">
              Upload Cover Image
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {formData.coverImage && (
              <p className="mt-2 text-sm text-gray-600">
                {formData.coverImage.name}
              </p>
            )}
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-5 py-2 rounded-full hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;

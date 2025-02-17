"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import EditBlog from "./EditBlog";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(queryParams.get("page")) || 1;
  const limitFromUrl = parseInt(queryParams.get("limit")) || 10;

  const [page, setPage] = useState(pageFromUrl);
  const [limit, setLimit] = useState(limitFromUrl);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/v1/api/blogs/get-blogs",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, limit },
          }
        );
        setBlogs(response.data.data.blogs);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch blogs.");
        setLoading(false);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchBlogs();
  }, [navigate, page, limit]);

  const handleDelete = async (blogId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/v1/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      alert("Blog deleted successfully");
    } catch (err) {
      setError("Failed to delete the blog.");
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
  };

  const handleUpdate = (updatedBlog) => {
    setBlogs(
      blogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    navigate(`?page=${newPage}&limit=${limit}`);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    navigate(`?page=${page}&limit=${newLimit}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Blogs</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/create-blog")}
            className="bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-gray-200"
          >
            Create Blog
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-gray-200"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search blogs by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border rounded-full outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredBlogs.length === 0 ? (
          <p className="text-center text-gray-600">No blogs found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {blog.coverImage && (
                  <img
                    src={`/pointer-1739784739852.png`}
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h1 className="text-xl font-semibold mb-2">{blog.slug}</h1>
                  <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-600 mb-4">{blog.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <div className="space-x-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            Next
          </button>
        </div>
      </div>

      {editingBlog && (
        <EditBlog
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default UserBlogs;

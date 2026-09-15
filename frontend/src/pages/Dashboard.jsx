import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [searchText, setSearchText] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");

  const fetchPosts = () => {
    fetch("http://localhost:5017/api/Post")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  };

  const fetchCategories = () => {
    fetch("http://localhost:5017/api/Category")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // ----- Post modal logic -----

  const openCreateModal = () => {
    setEditingPostId(null);
    setTitle("");
    setContent("");
    setCategoryId("");
    setShowPostModal(true);
  };

  const openEditModal = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setContent(post.content);
    setCategoryId(post.categoryId);
    setShowPostModal(true);
  };

  const closePostModal = () => {
    setShowPostModal(false);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const postData = {
      title: title,
      content: content,
      categoryId: parseInt(categoryId),
      userId: 1,
    };

    const isEditing = editingPostId !== null;
    const url = isEditing
      ? `http://localhost:5017/api/Post/${editingPostId}`
      : "http://localhost:5017/api/Post";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    }).then(() => {
      closePostModal();
      fetchPosts();
    });
  };

  // ----- Delete with confirmation -----

  const deletePostHandler = (postId) => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:5017/api/Post/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setPosts(posts.filter((post) => post.id !== postId));
    });
  };

  // ----- Category modal logic -----

  const openCategoryModal = () => {
    setNewCategoryName("");
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    fetch("http://localhost:5017/api/Category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategoryName }),
    }).then(() => {
      closeCategoryModal();
      fetchCategories();
    });
  };

  // ----- Category lookup for display -----

  const getCategoryName = (id) => {
    const match = categories.find((cat) => cat.id === id);
    return match ? match.name : "Uncategorized";
  };

  // ----- Filtering (search by text + category) -----

  const filteredPosts = posts.filter((post) => {
    const matchesText =
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.content.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      filterCategoryId === "" || post.categoryId === parseInt(filterCategoryId);

    return matchesText && matchesCategory;
  });

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-wordmark">Quiet Corners</h1>
          <p className="dashboard-subtitle">Admin</p>
        </div>
        <div className="dashboard-actions">
          <button type="button" className="btn-outline" onClick={openCategoryModal}>
            New category
          </button>
          <button type="button" className="btn-solid" onClick={openCreateModal}>
            New post
          </button>
        </div>
      </header>

      <div className="dashboard-filters">
        <input
          type="text"
          className="filter-input"
          placeholder="Search posts…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterCategoryId}
          onChange={(e) => setFilterCategoryId(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {filteredPosts.length === 0 && (
        <p className="empty-state">
          {posts.length === 0
            ? "No posts yet. Create your first one."
            : "No posts match your filters."}
        </p>
      )}

      <div className="post-row-list">
        {filteredPosts.map((post) => (
          <div className="post-row" key={post.id}>
            <span className="post-row-bullet" aria-hidden="true"></span>

            <div className="post-row-main">
              <Link className="post-row-title" to={`/post/${post.id}`}>
                {post.title}
              </Link>
              <span className="post-row-category">{getCategoryName(post.categoryId)}</span>
            </div>
            <div className="post-row-actions">
              <button type="button" className="link-btn" onClick={() => openEditModal(post)}>
                Edit
              </button>
              <button
                type="button"
                className="link-btn link-btn-danger"
                onClick={() => deletePostHandler(post.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPostModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{editingPostId ? "Edit post" : "New post"}</h2>
            <form onSubmit={handlePostSubmit} className="modal-form">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={closePostModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-solid">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>New category</h2>
            <form onSubmit={handleCategorySubmit} className="modal-form">
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={closeCategoryModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-solid">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
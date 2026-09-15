import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";
import logo from '../assets/logo.svg';



const EXCERPT_LENGTH = 150;



function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5017/api/Post")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      });

    fetch("http://localhost:5017/api/Category")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  const getCategoryName = (id) => {
    const match = categories.find((cat) => cat.id === id);
    return match ? match.name : null;
  };

  const getExcerpt = (content) => {
    if (content.length <= EXCERPT_LENGTH) {
      return content;
    }
    return content.slice(0, EXCERPT_LENGTH).trim() + "…";
  };

  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.content.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const [featuredPost, ...restPosts] = filteredPosts;

  return (
    <div className="home-page">
      <nav className="home-nav">
        <Link to="/" className="home-nav-title">
          Quiet Corners
        </Link>
        <Link to="/login" className="home-nav-link">
          Admin
        </Link>
      </nav>

      <div className="home-hero">
        <div className="home-hero-inner">
          <div>
            <h1 className="home-wordmark">Quiet Corners</h1>
            <p className="home-tagline">Notes, essays, and things worth sitting with.</p>
          </div>

          <div className="hero-image-slot">
            
              <img src={logo} className="hero-image"  alt="logo" />
            
          </div>
        </div>
      </div>

      <div className="home-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search posts…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        {!isLoading && filteredPosts.length === 0 && (
          <p className="empty-state">
            {posts.length === 0
              ? "No posts have been published yet."
              : "No posts match your search."}
          </p>
        )}

        {featuredPost && (
          <article className="post-featured">
            {getCategoryName(featuredPost.categoryId) && (
              <span className="post-card-category">
                {getCategoryName(featuredPost.categoryId)}
              </span>
            )}
            <h2 className="post-featured-title">
              <Link className="post-title-link" to={`/post/${featuredPost.id}`}>
                {featuredPost.title}
              </Link>
            </h2>
            <p className="post-featured-excerpt">{getExcerpt(featuredPost.content)}</p>
            <Link className="post-continue" to={`/post/${featuredPost.id}`}>
              Continue reading
            </Link>
          </article>
        )}

        <div className="post-grid">
          {restPosts.map((post) => (
            <article className="post-card" key={post.id}>
              {getCategoryName(post.categoryId) && (
                <span className="post-card-category">{getCategoryName(post.categoryId)}</span>
              )}
              <h2 className="post-card-title">
                <Link className="post-title-link" to={`/post/${post.id}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="post-card-excerpt">{getExcerpt(post.content)}</p>
              <Link className="post-continue" to={`/post/${post.id}`}>
                Continue reading
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
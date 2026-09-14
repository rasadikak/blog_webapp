import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5017/api/Post")
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">My Blog Site</h1>

      {posts.map((post) => (
        <div className="post-card" key={post.id}>
          <h2>
            <Link className="post-title-link" to={`/post/${post.id}`}>
              {post.title}
            </Link>
          </h2>
          <p className="post-content">{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
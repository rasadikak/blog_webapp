import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/Post.css";

function Post() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);

  const [commenterName, setCommenterName] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const fetchPost = () => {
    fetch(`http://localhost:5017/api/Post/${id}`)
      .then((response) => response.json())
      .then((data) => setPost(data));
  };

  const fetchCategories = () => {
    fetch("http://localhost:5017/api/Category")
      .then((response) => response.json())
      .then((data) => setCategories(data));
  };

  const fetchComments = () => {
    fetch(`http://localhost:5017/api/Comment/post/${id}`)
      .then((response) => response.json())
      .then((data) => setComments(data));
  };

  useEffect(() => {
    fetchPost();
    fetchCategories();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      content: commentContent,
      commenterName: commenterName,
      postId: parseInt(id),
    };

    fetch("http://localhost:5017/api/Comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newComment),
    }).then(() => {
      setCommenterName("");
      setCommentContent("");
      fetchComments();
    });
  };

  if (!post) {
    return (
      <div className="post-detail-container">
        <p className="post-loading">Loading…</p>
      </div>
    );
  }

  const categoryName = categories.find((cat) => cat.id === post.categoryId)?.name;

  return (
    <div className="post-page">
      <nav className="post-nav">
        <Link to="/" className="post-nav-title">
          Quiet Corners
        </Link>
        <Link to="/" className="post-nav-link">
          Back to all posts
        </Link>
      </nav>

      <div className="post-detail-container">
        

        {categoryName && <span className="post-card-category">{categoryName}</span>}
        <h1>{post.title}</h1>
        <p className="post-detail-content">{post.content}</p>

        <h3>Comments</h3>
        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first to share a thought.</p>
        )}
        {comments.map((comment) => (
          <div className="comment-card" key={comment.id}>
            <strong>{comment.commenterName}</strong>
            <p>{comment.content}</p>
          </div>
        ))}

        <h3>Leave a comment</h3>
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Your name"
            value={commenterName}
            onChange={(e) => setCommenterName(e.target.value)}
            required
          />
          <textarea
            placeholder="Your comment"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            required
          />
          <button type="submit">Submit comment</button>
        </form>
      </div>
    </div>
  );
}

export default Post;
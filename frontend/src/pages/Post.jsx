import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Post.css";

function Post() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [commenterName, setCommenterName] = useState("");
  const [commentContent, setCommentContent] = useState("");

  const fetchPost = () => {
    fetch(`http://localhost:5017/api/Post/${id}`)
      .then((response) => response.json())
      .then((data) => setPost(data));
  };

  const fetchComments = () => {
    fetch(`http://localhost:5017/api/Comment/post/${id}`)
      .then((response) => response.json())
      .then((data) => setComments(data));
  };

  useEffect(() => {
    fetchPost();
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
    return <p>Loading...</p>;
  }

  return (
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      <p className="post-detail-content">{post.content}</p>

      <h3>Comments</h3>
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((comment) => (
        <div className="comment-card" key={comment.id}>
          <strong>{comment.commenterName}</strong>
          <p>{comment.content}</p>
        </div>
      ))}

      <h3>Leave a Comment</h3>
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
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}

export default Post;
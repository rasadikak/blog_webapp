import { useState,useEffect } from "react";

function Dashboard(){

    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:5017/api/Post")
          .then((response) => response.json())
          .then((data) => setPosts(data));
      }, []);

    const createPostHandler=(e)=>{}

    const editPostHandler=(e)=>{}

    const deletePostHandler=(e)=>{}

    const createCategoryHandler=(e)=>{}

    return(
        <div>
            <h1>Dashboard</h1>

            <button type="button" onSubmit={createPostHandler}>Create New Post</button>

            <button type="button" onSubmit={createCategoryHandler}>Create New Category</button>

            {posts.map((post) => (
                <div key={post.id}>
                <h2>
                    <Link  to={`/post/${post.id}`}>
                    {post.title}
                    </Link>
                </h2>
                <p >{post.content}</p>
                <button type="submit" onSubmit={editPostHandler}>Edit Post</button>
                <button type="submit"   onSubmit={deletePostHandler}>Delete post</button>
                </div>
            ))}

            
        </div>
    )
}

export default Dashboard
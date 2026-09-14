import { useEffect,useState } from "react";
import {Link} from "react-router-dom"

function Home(){


    const [posts, setPosts]= useState([])

    useEffect(()=>{
        fetch('http://localhost:5017/api/Post')
            .then((response)=>response.json())
            .then((data)=>setPosts(data))
    },[]);


    return(
        <div>
            <h1>My Blog Site</h1>

            {posts.map((post)=>(
                <div key={post.id}>
                    <h2>
                        <Link to={`/post/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p>{post.content}</p>
                </div>
            ))}
            
        </div>
    )

}
export default Home;
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import properties from "../../properties";

const Posts = ({postsData})=>{
    const {id} = useParams();
    const forumId=id;
    const [posts,setPosts] = useState(postsData);
    const [role,] = useContext(UserContext);
    const [content, setContent] = useState("");
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const history = useHistory();
    let [doPostsExist,setDoPostsExist] = useState(false);
    const {host} = properties;
    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    console.log(posts);
    console.log("forum id : "+forumId);
    if(!role)
        history.push("/login");
        
    useEffect(()=>{
        if(posts.length === 0)
            setDoPostsExist(false);
        else
            setDoPostsExist(true);
    },[posts])
    console.log(posts);

    //adding new post
    const addPost = (e)=>{
        e.preventDefault();
        const url = `${host}/api/v1/posts`;
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({content,forumId,userId})
        })
        .then(response => response.json().then(data=>{
            console.log(data);
            //const index = JSON.stringify(data);
            setPosts([...posts,data])
            setContent("");
        }));
    }
    return (
        <div className="forums-container">
            <h2>Posts</h2>
            <div>{!doPostsExist ? <>no posts for this forum yet</>:<><h3>{posts[0].forum.title}</h3><h4>{posts[0].forum.content}</h4> </>}</div>
            <table className="table table-bordered table-hover table-striped">
                <thead>
                <tr>
                    <th className="w-50">title</th>
                    <th>posted by</th>
                    <th>role</th>
                    <th>posted</th>
                </tr>
                </thead>
                <tbody>
                <>{doPostsExist && 
                <>{posts.map((post)=>{
                    return (
                    <tr key={post.id}>
                        <td><Link to={`/posts/${post.id}`}>{post.content}</Link></td>
                        <td>{post.user.firstName}</td>
                        <td>{post.user.role}</td>
                        <td>{post.postDate} </td>
                    </tr>
                    )
                })}
                </>}</>
                </tbody>

            </table>

            {role==="ADMIN" ? <>

            <button className="btn btn-outline-success mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#addPost" aria-expanded="false" aria-controls="addPost" onClick={()=>{sleep(200).then(()=>{window.scrollTo(0,document.body.scrollHeight)})}}>Post a Question</button>

            <form className="collapse multi-collapse" id="addPost" onSubmit={addPost}>
            <div className="row g-2">
                <div className="col-md-7">
                    <textarea minLength="10" required className="form-control" id="content" placeholder="content" value={content} onChange={(e)=>setContent(e.target.value)} rows="5" maxLength="255"></textarea>
                </div>
                <div>
                    <button className="btn btn-success mb-5" type="submit">submit</button>
                </div>            
            </div>
            </form>
            </>:""}
            
        </div>
    )
}
export default Posts;
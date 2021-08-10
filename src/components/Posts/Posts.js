import { Comment, Empty, Tooltip} from "antd";
import { useContext, useEffect, useState, createElement } from "react";
import { useCookies } from "react-cookie";
import { Link, useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import properties from "../../properties";
import Avatar from "antd/lib/avatar/avatar";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled  } from '@ant-design/icons';
import React from "react";
const {host} = properties;

const Posts = ({postsData})=>{
    const {id} = useParams();
    const forumId=id;
    const [posts,setPosts] = useState(postsData.content);
    const [role,] = useContext(UserContext);
    const [content, setContent] = useState("");
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const history = useHistory();
    let [doPostsExist,setDoPostsExist] = useState(false);

    
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState(null);
    let token ="";
    if(!role)
        history.push("/login");
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;


    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

        
    useEffect(()=>{
        if(posts.length === 0)
            setDoPostsExist(false);
        else
            setDoPostsExist(true);
    },[posts])


    const like = () => {
        setLikes(1);
        setDislikes(0);
        setAction('liked');
      };
    
    const dislike = () => {
        setLikes(0);
        setDislikes(1);
        setAction('disliked');
      };

      //you should make a function and get the infos you need about the post and user then when a user hits on reply they can be taken to the comment page, and when they hit like they can like the post and postId,UserWhoLikedId gets registred in the back end
    const actions = [
        <Tooltip key="comment-basic-like" title="Like">
          <span onClick={like}>
            {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
            <span className="comment-action">{likes}</span>
          </span>
        </Tooltip>,
        <Tooltip key="comment-basic-dislike" title="Dislike">
          <span onClick={dislike}>
            {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
            <span className="comment-action">{dislikes}</span>
          </span>
        </Tooltip>,
        <span key="comment-basic-reply-to">Reply to</span>,
      ];

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
            //const index = JSON.stringify(data);
            setPosts([...posts,data])
            setContent("");
        }));
    }
    return (
        <div className="forums-container">
            <h5>Posts : </h5>
            {!doPostsExist && <Empty description="no Posts"/>}
            {doPostsExist && 
            <>
            {posts.map((post)=>{
                    return (
                        <Comment
                        actions={actions}
                        author={<Tooltip title={post.user.role}>
                                    <Link to={`/profile/${post.user.id}`}>{post.user.lastName} {post.user.firstName}</Link>
                                </Tooltip>}
                        datetime={<span>{post.postDate}</span>}
                        avatar=
                            {post.user.avatar ? 
                                <img src={`${host}/viewFile/${post.user.avatar}`} width="50" alt="avatar"/>
                            :
                                <Avatar
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                alt="avatar"
                                />
                            }
                        
                        content={<p><Link to={`/posts/${post.id}`}>{post.content}</Link></p>}
                    >
                        {/* you can post sub comments here */}
                    </Comment>
                    )
                })}

            
                
            </>
}
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
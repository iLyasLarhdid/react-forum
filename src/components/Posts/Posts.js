import { Comment, Empty, Tooltip, message} from "antd";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import properties from "../../properties";
import Avatar from "antd/lib/avatar/avatar";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled,CommentOutlined} from '@ant-design/icons';
import React from "react";
const {host,avatarProp} = properties;

function writeNumber(number){
    if(number === null || typeof number ==="undefined")
        return 0;
    if(number>=1000000000000)
        return number/1000000000000+"T";
    if(number>=1000000000)
        return number/1000000000+"B";
    if(number>=1000000)
        return number/1000000+"M";
    if(number>=1000)
        return number/1000+"K";  
    
    return number;
}


const Posts = ({postsData,isFromProfile})=>{
    const {id} = useParams();
    const forumId=id;
    const [posts,setPosts] = useState(postsData.content);
    const [role,] = useContext(UserContext);
    const [content, setContent] = useState("");
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const history = useHistory();
    let [doPostsExist,setDoPostsExist] = useState(false);

    var Filter = require('bad-words'),
    filter = new Filter();

    if(!role)
        history.push("/login");

    

    //update forum views
    useEffect(()=>{
        fetch(`${host}/api/v1/forums/updateViews/${forumId}`,
    {method:"get",headers: {
        'Authorization': cookies.ilyToken
    }});
    },[cookies.ilyToken,forumId]);
    
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

    const like = (postId) => {
        fetch(`${host}/api/v1/postActions/postId/${postId}/state/like`,{
            headers:{
            "Authorization" : cookies.ilyToken
        }}).then(response => {
            if(!response.ok)
                throw Error("couldnt proform the task");
            return response.json()
        }).then(data=>{
            console.log("post actions======>");
            console.log(data);
            let updatedActions = posts.map((post)=>{
                if(post.id !== data.id)
                    return post;
                return  data;
            });
            setPosts(updatedActions);
        });
      };
    
    const dislike = (postId) => {
        fetch(`${host}/api/v1/postActions/postId/${postId}/state/dislike`,{
            headers:{
            "Authorization" : cookies.ilyToken
        }}).then(response => {
            if(!response.ok)
                throw Error("couldnt proform the task");
            return response.json()
        }).then(data=>{
            console.log("post actions======>");
            console.log(data);
            let updatedActions = posts.map((post)=>{
                if(post.id !== data.id)
                    return post;
                return  data;
            });
            setPosts(updatedActions);
        }); 
        //console.log(posts);
      };

      //you should make a function and get the infos you need about the post and user then when a user hits on reply they can be taken to the comment page, and when they hit like they can like the post and postId,UserWhoLikedId gets registred in the back end
    // const actions = [
    //     <Tooltip key="comment-basic-like" title="Like">
    //       <span onClick={like}>
    //         {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
    //         <span className="comment-action">{likes}</span>
    //       </span>
    //     </Tooltip>,
    //     <Tooltip key="comment-basic-dislike" title="Dislike">
    //       <span onClick={dislike}>
    //         {action === 'disliked' ? <DislikeFilled/> : <DislikeOutlined/>}
    //         <span className="comment-action">{dislikes}</span>
    //       </span>
    //     </Tooltip>,
    //     <Tooltip key="comment-basic-views" title="views">
    //     <span>
    //       <EyeOutlined/>
    //       <span>0</span>
    //     </span>
    //   </Tooltip>,
    //   <Tooltip key="comment-basic-views" title="views">
    //   <span>
    //     <span key="comment-basic-reply-to"><CommentOutlined /></span>
    //     <span>{post.numberOfComments}</span>
    //   </span>
    // </Tooltip>,
        
    //   ];

    //adding new post
    const addPost = (e)=>{
        e.preventDefault();
        message.loading('Adding....',"updating");
        const url = `${host}/api/v1/posts`;
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({content,forumId,userId})
        })
        .then(response => {
            if(!response.ok){
                throw Error("something went wrong");
            }
            return response.json()}
            ).then(data=>{
            message.success({content:'Updated successfully', key:"updating", duration:2});
            console.log("post====>");
            console.log(data);
            //const index = JSON.stringify(data);
            setPosts([...posts,data])
            setContent("");
        }).catch(err=>{
            message.error({content:'Updated successfully', key:"updating", duration:2});
            console.log("error while posting");
            console.log(err);
            setContent("");
        });
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
                        key={`parentComment${post.id}`}
                        actions={[
                            <Tooltip key="comment-basic-like" title="like">
                              <span onClick={()=>like(post.id)}>
                                {post.likedByPrincipal ? <LikeFilled/> :<LikeOutlined/>}
                                <span className="comment-action">{writeNumber(post.numberOfLikes)}</span>
                              </span>
                            </Tooltip>,
                            <Tooltip key="comment-basic-dislike" title="Dislike">
                              <span onClick={()=>dislike(post.id)}>
                                {post.dislikedByPrincipal ? <DislikeFilled/> : <DislikeOutlined/>}
                                <span className="comment-action">{writeNumber(post.numberOfDislikes)}</span>
                              </span>
                            </Tooltip>,
                          <Tooltip key="comment-basic-comments" title="leave a comment">
                          <Link to={`/posts/${post.id}`}>
                            <span key="comment-basic-reply-to"><CommentOutlined /></span>
                            <span>{writeNumber(post.numberOfComments)}</span>
                          </Link>
                        </Tooltip>,
                          ]}
                        author={<Tooltip title={post.user.role}>
                                    <Link to={`/profile/${post.user.id}`}>{post.user.lastName} {post.user.firstName}</Link>
                                </Tooltip>}
                        datetime={<span>{post.postDate}</span>}
                        avatar=
                            {post.user.avatar ? 
                                <img src={`${host}/upload/viewFile/${post.user.avatar}`} width="50" alt="avatar"/>
                            :
                                <Avatar
                                src={avatarProp}
                                alt="avatar"
                                />
                            }
                        
                        content={<p><Link to={`/posts/${post.id}`} style={{ color:'black' }}>{filter.clean(post.content)}</Link></p>}
                    >
                        {/* you can post sub comments here */}
                    </Comment>
                    )
                })}

            
                
            </>
}
            {role && !isFromProfile ? <>

            <button className="btn btn-outline-success mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#addPost" aria-expanded="false" aria-controls="addPost" onClick={()=>{sleep(200).then(()=>{window.scrollTo(0,document.body.scrollHeight)})}}>Post a Question</button>

            <form className="collapse multi-collapse" id="addPost" onSubmit={addPost}>
            <div className="row g-2">
                <div className="col-md-7">
                    <textarea minLength="10" required className="form-control" id="content" placeholder="content" value={content} onChange={(e)=>setContent(e.target.value)} rows="5"></textarea>
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
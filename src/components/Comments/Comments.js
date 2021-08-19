import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router";
import { UserContext } from "../../hooks/UserContext";
import { Link } from "react-router-dom";
import properties from "../../properties";
import Avatar from "antd/lib/avatar/avatar";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled  } from '@ant-design/icons';
import { Comment, Empty, message, Tooltip } from "antd";
import React from "react";

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

const Comments =({commentsData})=>{
    const {id} = useParams();
    const postId=id;
    let [doCommentsExist,setDoCommentsExist] = useState(false);

    const [comments, setComments] = useState(commentsData);
    const [role,] = useContext(UserContext);
    const [comment, setComment] = useState("");
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const history = useHistory();
    const {host,avatarProp} = properties;

    var Filter = require('bad-words'),
    filter = new Filter();

    useEffect(()=>{
        if(comments.length === 0)
            setDoCommentsExist(false);
        else
            setDoCommentsExist(true);
    },[comments,commentsData]);

    if(!role)
        history.push("/login");
    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    const like = (CommentId) => {
        fetch(`${host}/api/v1/commentActions/commentId/${CommentId}/state/like`,{
            headers:{
            "Authorization" : cookies.ilyToken
        }}).then(response => {
            if(!response.ok)
                throw Error("couldnt proform the task");
            return response.json()
        }).then(data=>{
            console.log("post actions======>");
            console.log(data);
            let updatedActions = comments.map((comment)=>{
                if(comment.id !== data.id)
                    return comment;
                return  data;
            });
            setComments(updatedActions);
        });
      };
    
      const dislike = (postId) => {
        fetch(`${host}/api/v1/commentActions/commentId/${postId}/state/dislike`,{
            headers:{
            "Authorization" : cookies.ilyToken
        }}).then(response => {
            if(!response.ok)
                throw Error("couldnt proform the task");
            return response.json()
        }).then(data=>{
            console.log("post actions======>");
            console.log(data);
            let updatedActions = comments.map((comment)=>{
                if(comment.id !== data.id)
                    return comment;
                return  data;
            });
            setComments(updatedActions);
        }); 
        //console.log(posts);
      };

    //   const actions = [
    //     <Tooltip key="comment-basic-like" title="Like">
    //       <span onClick={like}>
    //         {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
    //         <span className="comment-action">{likes}</span>
    //       </span>
    //     </Tooltip>,
    //     <Tooltip key="comment-basic-dislike" title="Dislike">
    //       <span onClick={dislike}>
    //         {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
    //         <span className="comment-action">{dislikes}</span>
    //       </span>
    //     </Tooltip>,
    //     <span key="comment-basic-reply-to">Reply to</span>,
    //   ];

    //adding new comment
    const addComment = (e)=>{
        e.preventDefault();
        const url = `${host}/api/v1/comments`;
        message.loading('updating....',"updating");
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({comment,postId,userId})
        })
        .then(response => {
            if(!response.ok){
                throw Error("couldn't get data");
            }
            return response.json()
        }).then(data=>{
            //const index = JSON.stringify(data);
            setComments([...comments,data]);
            setComment("");
            message.success({content:'Updated successfully', key:"updating", duration:2});
        }).catch(()=>{
            message.error({content:"could not add comment, try again", key:"updating", duration:2});
        });
    }

    return (
        <div className="forums-container">
        <h5>Comments : </h5>
        <div>{!doCommentsExist && <Empty description="no comments"/>}</div>
            <>{doCommentsExist && 
                <>
                {comments.map((comment)=>{
                    return (
                        <Comment
                        actions={[
                            <Tooltip key="comment-basic-like" title="Like">
                              <span onClick={()=>like(comment.id)}>
                                {comment.likedByPrincipal ? <LikeFilled/> : <LikeOutlined/>}
                                <span className="comment-action">{writeNumber(comment.numberOfLikes)}</span>
                              </span>
                            </Tooltip>,
                            <Tooltip key="comment-basic-dislike" title="Dislike">
                              <span onClick={()=>dislike(comment.id)}>
                                {comment.dislikedByPrincipal ? <DislikeFilled/> : <DislikeOutlined/>}
                                <span className="comment-action">{writeNumber(comment.numberOfDislikes)}</span>
                              </span>
                            </Tooltip>,
                          ]}
                        author={<Tooltip title={comment.user.role}>
                                    <Link to={`/profile/${comment.user.id}`}>{comment.user.lastName} {comment.user.firstName}</Link>
                                </Tooltip>}
                        datetime={<span>{comment.commentDate}</span>}
                        avatar=
                            {comment.user.avatar ? 
                                <img src={`${host}/upload/viewFile/${comment.user.avatar}`} width="50" alt="avatar"/>
                            :
                                <Avatar
                                src={avatarProp}
                                alt="avatar"
                                />
                            }
                        
                        content={<p>{filter.clean(comment.comment)}</p>}
                    >
                        {/* you can post sub comments here */}
                    </Comment>
                    )
                })}
                </>
            }</>

        
        {/* form for leaving messages */}
        {role ? <>

            <button className="btn btn-outline-success mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#addComment" aria-expanded="false" aria-controls="addComment" onClick={()=>{sleep(300).then(()=>{window.scrollTo(0,document.body.scrollHeight)})}}>Comment</button>

            <form className="collapse multi-collapse" id="addComment" onSubmit={addComment}>
            <div className="row g-2">
                <div className="col-md-7">
                    <textarea minLength="10" required className="form-control" id="comment" placeholder="content" value={comment} onChange={(e)=>setComment(e.target.value)} rows="5"></textarea>
                </div>
                <div>
                    <button className="btn btn-success mb-5" type="submit">submit</button>
                </div>            
            </div>
            </form>
            </>:""}
    </div>
    );
}
export default Comments;
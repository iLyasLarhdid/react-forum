import { createElement, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router";
import { UserContext } from "../../hooks/UserContext";
import { Link } from "react-router-dom";
import properties from "../../properties";
import Avatar from "antd/lib/avatar/avatar";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled  } from '@ant-design/icons';
import { Comment, Empty, message, Tooltip } from "antd";
import React from "react";

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
    const {host} = properties;
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);
    const [action, setAction] = useState(null);

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
        .then(response => response.json().then(data=>{
            //const index = JSON.stringify(data);
            setComments([...comments,data]);
            setComment("");
            message.success({content:'Updated successfully', key:"updating", duration:2});
        }));
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
                        actions={actions}
                        author={<Tooltip title={comment.user.role}>
                                    <Link to={`/profile/${comment.user.id}`}>{comment.user.lastName} {comment.user.firstName}</Link>
                                </Tooltip>}
                        datetime={<span>{comment.commentDate}</span>}
                        avatar=
                            {comment.user.avatar ? 
                                <img src={`${host}/upload/viewFile/${comment.user.avatar}`} width="50" alt="avatar"/>
                            :
                                <Avatar
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                alt="avatar"
                                />
                            }
                        
                        content={<p>{comment.comment}</p>}
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
                    <textarea minLength="10" required className="form-control" id="comment" placeholder="content" value={comment} onChange={(e)=>setComment(e.target.value)} rows="5" maxLength="255"></textarea>
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
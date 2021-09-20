import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router";
import { UserContext } from "../../hooks/UserContext";
import { Link } from "react-router-dom";
import properties from "../../properties";
import Avatar from "antd/lib/avatar/avatar";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled  } from '@ant-design/icons';
import { Comment, Empty, message, Tooltip, Button,Form,Input } from "antd";
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

const Comments =({commentsData,showForm})=>{
    const {id} = useParams();
    const postId=id;
    let [doCommentsExist,setDoCommentsExist] = useState(false);

    const [comments, setComments] = useState(commentsData);
    const [role,] = useContext(UserContext);
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const history = useHistory();
    const {host,avatarProp} = properties;
    const [form] = Form.useForm();

    //var Filter = require('bad-words'), filter = new Filter();

    useEffect(()=>{
        if(comments!==undefined && comments && comments.length > 0)
            setDoCommentsExist(true);
        else
            setDoCommentsExist(false);
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
    const addComment = (values) => {
        console.log(values);
        const url = `${host}/api/v1/comments`;
        if(values.comment.length < 1){
            message.error('your comment is empty!!');
            return;
        }
        message.loading('commenting...',"updating");
        const comment = values.comment;
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
                throw Error("something went wrong");
            }
            return response.json()}
            ).then(data=>{
            message.success({content:'Added successfully', key:"updating", duration:2});
            console.log("comment====>");
            console.log(data);
            form.resetFields();
            //const index = JSON.stringify(data);
            setComments([...comments,data]);
        }).catch(err=>{
            message.error({content:'Something went wrong! try again', key:"updating", duration:2});
        });
        //sleep(200).then(()=>{window.scrollTo(0,document.body.scrollHeight)});
      };

    return (
        <div className="forums-container">
        <h5>Comments : </h5>
        {/* form for leaving messages */}
        {role && showForm ? <>
            <Comment
                key={`addcomment`}
                avatar=
                    {cookies.principal_avatar ? 
                        <img src={cookies.principal_avatar} width="50" alt="avatar"/>
                            :
                        <Avatar
                            src={avatarProp}
                            alt="avatar"
                        />
                    }
                content={<>
            <Form name="posts" onFinish={addComment} form={form} >
            <Form.Item 
                name="comment"
                rules={[{ required: true, message: 'Please add comment!' }]}
            >
                <Input.TextArea rows="5" value="hiiiii"/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            </Form>

                </>}
                    >
                        {/* you can post sub comments here */}
                    </Comment>

            
            </>:""}
        <div>{!doCommentsExist && <Empty description="no comments"/>}</div>
            <>{doCommentsExist && 
                <>
                {comments.map((comment)=>{
                    return (
                        <Comment
                        key={`comments${comment.id}`}
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
                        
                        content={<p>{comment.comment}</p>}
                    >
                        {/* you can post sub comments here */}
                    </Comment>
                    )
                })}
                </>
            }</>

    </div>
    );
}
export default Comments;
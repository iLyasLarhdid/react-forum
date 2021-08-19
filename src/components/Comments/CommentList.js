import { useParams } from "react-router";
import Comments from "./Comments";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { List, Skeleton, Comment, Tooltip } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Link } from "react-router-dom";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled,CommentOutlined} from '@ant-design/icons';
import { useState } from "react";

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

const fetchData = async (key)=>{
    
    const postId = key.queryKey[1];
    const token = key.queryKey[2];
    const res = await fetch(`${host}/api/v1/posts/id/${postId}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const CommentList = ()=>{

    const {id} = useParams();
    const [cookies] = useCookies([]);
    const [triggerQueryChange,setTriggerQueryChange] = useState(false);
    let token = "";
        
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;
    
    var Filter = require('bad-words'),
    filter = new Filter();
    
    const {data,isLoading} = useQuery(['forumId',id,token,triggerQueryChange],fetchData,{keepPreviousData:false})
    console.log("data");
    console.log(data);
    const url = `${host}/api/v1/comments/post/id/${id}`;
    const [comments,isPending,error] = useFetch(url);

    

    console.log("com=====>");
    console.log(comments);

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
            setTriggerQueryChange(!triggerQueryChange);
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
            setTriggerQueryChange(!triggerQueryChange);
        }); 
        //console.log(posts);
      };


    return (
        <div className="container">
        <div>{isLoading && <><Skeleton active/><Skeleton active/></>}</div>

        {data && 
            <div>
                <List.Item id={"row"+data.forum.id} >
                <List.Item.Meta title="Forum" description={filter.clean(data.forum.title)} />
                </List.Item>

                <Comment
                        actions={[
                            <Tooltip key="comment-basic-like" title="double click">
                              <span onClick={()=>like(data.id)}>
                                {data.likedByPrincipal ? <LikeFilled/> :<LikeOutlined/>}
                                <span className="comment-action">{writeNumber(data.numberOfLikes)}</span>
                              </span>
                            </Tooltip>,
                            <Tooltip key="comment-basic-dislike" title="Dislike">
                              <span onClick={()=>dislike(data.id)}>
                                {data.dislikedByPrincipal ? <DislikeFilled/> : <DislikeOutlined/>}
                                <span className="comment-action">{writeNumber(data.numberOfDislikes)}</span>
                              </span>
                            </Tooltip>,
                          <Tooltip key="comment-basic-comments" title="leave a comment">
                          <Link to={`/posts/${data.id}`}>
                            <span key="comment-basic-reply-to"><CommentOutlined /></span>
                            <span>{writeNumber(data.numberOfComments)}</span>
                          </Link>
                        </Tooltip>,
                          ]}
                        author={<Tooltip title={data.user.role}>
                                    <Link to={`/profile/${data.user.id}`}>{data.user.lastName} {data.user.firstName}</Link>
                                </Tooltip>}
                        datetime={<span>{data.postDate}</span>}
                        avatar=
                            {data.user.avatar ? 
                                <img src={`${host}/upload/viewFile/${data.user.avatar}`} width="50" alt="avatar"/>
                            :
                                <Avatar
                                src={avatarProp}
                                alt="avatar"
                                />
                            }
                        
                        content={<p>{filter.clean(data.content)}</p>}
                    >
                     {comments && <Comments commentsData={comments.content}/>}   
                    </Comment>
            </div>}

        <div>{error && <div>{error}</div>}</div>
        <div>{isPending && <>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            </>}
        </div>
        </div>
    );
}
export default CommentList;
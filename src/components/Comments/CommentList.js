import { useParams } from "react-router";
import Comments from "./Comments";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useInfiniteQuery,  } from "react-query";
import { useCookies } from "react-cookie";
import { List, Skeleton, Comment, Tooltip } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Link } from "react-router-dom";
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled,CommentOutlined} from '@ant-design/icons';
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

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
    let page;
    if(typeof key.pageParam === "undefined")
        page=0;
    else
        page = key.pageParam;
    console.log(key);
    const res = await fetch(`${host}/api/v1/comments/post/id/${postId}/page/${page}`,{
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
    const [isLiked,setIsLiked] = useState(null);
    const [isDisLiked,setIsDisLiked] = useState(null);
    let token = "";
        
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;
    
    //var Filter = require('bad-words'), filter = new Filter();
    
    // const {data,isLoading} = useQuery(['comments',id,token],fetchData,{keepPreviousData:true})
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage
      } = useInfiniteQuery(['comments',id,token], fetchData, {
        getNextPageParam: (lastPage, pages) => {
            console.log(pages);
            console.log("next page number : ",lastPage);        
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      })
    //console.log("data");
    //console.log(data);
    const url = `${host}/api/v1/posts/id/${id}`;
    const [posts,isPending,error] = useFetch(url);
    
    //console.log(post);
    //console.log("com=====>");
    //console.log(posts);

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
            setIsDisLiked(data.dislikedByPrincipal);
            setIsLiked(data.likedByPrincipal);
            console.log(isLiked+"-"+isDisLiked);
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
            setIsDisLiked(data.dislikedByPrincipal);
            setIsLiked(data.likedByPrincipal);
            console.log(isLiked+"-"+isDisLiked);
        }); 
        //console.log(posts);
      };


    return (
        <div className="container">
        <div>{isPending && <><Skeleton active/><Skeleton active/></>}</div>

        {posts && typeof(posts) != "undefined" && 
            <div>
                <List.Item id={"row"+posts.forum.id} >
                <List.Item.Meta title="Forum" description={posts.forum.title} />
                </List.Item>

                <Comment
                        actions={[
                            <Tooltip key="comment-basic-like" title="double click">
                              <span onClick={()=>like(posts.id)}>
                                {isLiked ? <LikeFilled/> : isLiked === null ? posts.likedByPrincipal ? <LikeFilled/> :<LikeOutlined/> : <LikeOutlined/> }
                                <span className="comment-action">
                                    {isLiked ? posts.likedByPrincipal ? writeNumber(posts.numberOfLikes):writeNumber(posts.numberOfLikes+1): isLiked === null ? writeNumber(posts.numberOfLikes) : posts.likedByPrincipal ? writeNumber(posts.numberOfLikes-1):writeNumber(posts.numberOfLikes)}
                                </span>
                              </span>
                            </Tooltip>,
                            <Tooltip key="comment-basic-dislike" title="Dislike">
                              <span onClick={()=>dislike(posts.id)}>
                                {isDisLiked ? <DislikeFilled/> : isDisLiked === null ? posts.dislikedByPrincipal ? <DislikeFilled/> : <DislikeOutlined/>:<DislikeOutlined/>}
                                <span className="comment-action">
                                    {isDisLiked ? posts.dislikedByPrincipal ? writeNumber(posts.numberOfDislikes):writeNumber(posts.numberOfDislikes+1): isDisLiked === null ? writeNumber(posts.numberOfDislikes) : posts.dislikedByPrincipal ? writeNumber(posts.numberOfDislikes-1):writeNumber(posts.numberOfDislikes)}
                                </span>
                              </span>
                            </Tooltip>,
                          <Tooltip key="comment-basic-comments" title="leave a comment">
                          <Link to={`/posts/${posts.id}`}>
                            <span key="comment-basic-reply-to"><CommentOutlined /></span>
                            <span>{writeNumber(posts.numberOfComments)}</span>
                          </Link>
                        </Tooltip>,
                          ]}
                        author={<Tooltip title={posts.user.role}>
                                    <Link to={`/profile/${posts.user.id}`}>{posts.user.lastName} {posts.user.firstName}</Link>
                                </Tooltip>}
                        datetime={<span>{posts.postDate}</span>}
                        avatar=
                            {posts.user.avatar ? 
                                <img src={`${host}/upload/viewFile/${posts.user.avatar}`} width="50" alt="avatar"/>
                            :
                                <Avatar
                                src={avatarProp}
                                alt="avatar"
                                />
                            }
                        
                        content={<p>{posts.content}</p>}
                    >
                    {data &&
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={fetchNextPage}
                        hasMore={hasNextPage}
                        loader={<div className="loader" key={1}><Skeleton/></div>}
                    >
                     <>{data.pages.length && data.pages.map((comment,index)=>{
                        return(
                            <>{index === 0 ? 
                            <Comments commentsData={comment.content} showForm={true}/> : <Comments commentsData={comment.content} showForm={false}/>
                        }</>
                            )})
                    }</>
                    </InfiniteScroll>
                    }
                    </Comment>
            </div>}

        <div>{error && <div>{error}</div>}</div>
        <div>{isLoading && <>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            </>}
        </div>
        </div>
    );
}
export default CommentList;
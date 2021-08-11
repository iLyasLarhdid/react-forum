import { useParams } from "react-router";
import Comments from "./Comments";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { List, Skeleton, Comment, Tooltip } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { Link } from "react-router-dom";

const {host} = properties;
   

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

    let token = "";
        
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;
    
    const {data,isLoading} = useQuery(['forumId',id,token],fetchData,{keepPreviousData:false})

    console.log(data);
    const url = `${host}/api/v1/comments/post/id/${id}`;
    const [comments,isPending,error] = useFetch(url);

    return (
        <div className="container">
        <div>{isLoading && <><Skeleton active/><Skeleton active/></>}</div>

        {data && 
            <div>
                <List.Item id={"row"+data.forum.id} >
                <List.Item.Meta title="Forum" description={data.forum.title} />
                </List.Item>

                <Comment
                        author={<Tooltip title={data.user.role}>
                                    <Link to={`/profile/${data.user.id}`}>{data.user.lastName} {data.user.firstName}</Link>
                                </Tooltip>}
                        datetime={<span>{data.postDate}</span>}
                        avatar=
                            {data.user.avatar ? 
                                <img src={`${host}/upload/viewFile/${data.user.avatar}`} width="50" alt="avatar"/>
                            :
                                <Avatar
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                alt="avatar"
                                />
                            }
                        
                        content={<p>{data.content}</p>}
                    >
                     {comments && <Comments commentsData={comments}/>}   
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
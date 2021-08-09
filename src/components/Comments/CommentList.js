import { useParams } from "react-router";
import Comments from "./Comments";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { Skeleton } from "antd";

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

    const url = `${host}/api/v1/comments/post/id/${id}`;
    const [comments,isPending,error] = useFetch(url);

    return (
        <div className="container">
        <div>{isLoading && <><Skeleton active/><Skeleton active/></>}</div>
        {data && <div><h4> forum :</h4><p> {data.forum.content}</p><h5>post :</h5><p>{data.content}</p></div>}

        <div>{error && <div>{error}</div>}</div>
        <div>{isPending && <>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            <Skeleton avatar paragraph={{ rows: 4 }} active/>
                            </>}
        </div>
        <div>{comments && <Comments commentsData={comments}/>}</div>
        </div>
    );
}
export default CommentList;
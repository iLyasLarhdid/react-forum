import { useParams } from "react-router";
import Comments from "./Comments";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";

const {host} = properties;
   

const fetchData = async (key)=>{
    
    console.log("hello from async + key ",key);
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
    console.log(comments);

    return (
        <div className="container">
        <div>{isLoading && <div>loading ...</div>}</div>
        <div>{data && <><h1>{data.title}</h1><p>{data.content}</p></>}</div>

        <div>{error && <div>{error}</div>}</div>
        <div>{isPending && <div>loading ...</div>}</div>
        <div>{comments && <Comments commentsData={comments}/>}</div>
        </div>
    );
}
export default CommentList;
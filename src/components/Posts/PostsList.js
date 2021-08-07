import { useParams } from "react-router";
import Posts from "./Posts";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useQuery } from "react-query";
const {host} = properties;

const fetchData = async (key)=>{
    console.log("hello from async + key ",key," page ", key.queryKey[1]);
    const forumId = key.queryKey[1];
    const res = await fetch(`${host}/api/v1/forums/id/${forumId}`)
    return res.json();
}

const ForumDetails = () =>{
    const {id} = useParams();
    
    const {data,isLoading} = useQuery(['forumId',id],fetchData,{keepPreviousData:false})
    console.log(data);

    const url = `${host}/api/v1/posts/forum/id/${id}`;
    const [posts,isPending,error] = useFetch(url);

   
    return (
    <div className="container">
        <div>{isLoading && <div>loading ...</div>}</div>
        <div>{data && <><h1>{data.title}</h1><p>{data.content}</p></>}</div>

        <div>{error && <div>{error}</div>}</div>
        <div>{isPending && <div>loading ...</div>}</div>
        <div>{posts && <Posts postsData={posts}/>}</div>
    </div>)
}
export default ForumDetails;
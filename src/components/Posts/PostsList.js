import { useParams } from "react-router";
import Posts from "./Posts";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useQuery } from "react-query";
import { List, Skeleton } from "antd";
const {host} = properties;

const fetchData = async (key)=>{
    const forumId = key.queryKey[1];
    const res = await fetch(`${host}/api/v1/forums/id/${forumId}`)
    return res.json();
}

const ForumDetails = () =>{
    const {id} = useParams();
    
    const {data,isLoading} = useQuery(['forumId',id],fetchData,{keepPreviousData:false})

    const url = `${host}/api/v1/posts/forum/id/${id}`;
    const [posts,isPending,error] = useFetch(url);
    
    console.log(posts);
   
    return (
    <div className="container">
        {isLoading && <div><Skeleton active/></div>}
        {data && 
            <div>
                <h5>forum : </h5>
                <List.Item >
                <List.Item.Meta title={data.title} description={data.content} />
                </List.Item>
            </div>}

        <div>{error && <div>{error}</div>}</div>
        <div>{isPending && <div><Skeleton active/><Skeleton active/><Skeleton active/></div>}</div>
        <div>{posts && <Posts postsData={posts}/>}</div>
    </div>)
}
export default ForumDetails;
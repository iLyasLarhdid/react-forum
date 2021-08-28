import { useParams } from "react-router";
//import Posts from "./Posts";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useQuery } from "react-query";
import { List, Skeleton } from "antd";
import { lazy } from "react";
import { Suspense } from "react";
import { useCookies } from "react-cookie";
const {host} = properties;
const Posts = lazy(()=>import ('./Posts'));

const fetchDataAgain = async (key)=>{
    const forumId = key.queryKey[1];
    const token = key.queryKey[2];
    const res = await fetch(`${host}/api/v1/posts/forum/id/${forumId}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const ForumDetails = () =>{
    const {id} = useParams();
    const [cookies,] = useCookies();

    let token = "";
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;

    //const {posts,isPending} = useQuery(['forumId',id],fetchData,{keepPreviousData:true})
    const url = `${host}/api/v1/forums/id/${id}`;
    const [forum,isPending,error] = useFetch(url);

    const {data,isLoading} = useQuery(['posts',id,token],fetchDataAgain,{keepPreviousData:true});
    
    console.log(data);
    //var Filter = require('bad-words'),filter = new Filter();
   
    return (
    <div className="container">
        {isLoading && <div><Skeleton active/></div>}
        {forum && 
            <div>
                <h5>forum : </h5>
                <List.Item >
                <List.Item.Meta title={forum.title} description={forum.content} />
                </List.Item>
            </div>}

        <div>{error && <div>{error}</div>}</div>
        <div>{isPending && <div><Skeleton active/><Skeleton active/><Skeleton active/></div>}</div>
        <div>{data && 
            <Suspense fallback={<Skeleton/>}>
                <Posts postsData={data} isFromProfile={false}/>
            </Suspense>}</div>
    </div>)
}
export default ForumDetails;
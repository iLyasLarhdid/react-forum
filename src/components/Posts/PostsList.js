import { useParams } from "react-router";
//import Posts from "./Posts";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import { useInfiniteQuery } from "react-query";
import { List, Skeleton } from "antd";
import { lazy } from "react";
import { Suspense } from "react";
import { useCookies } from "react-cookie";
import InfiniteScroll from 'react-infinite-scroller';
const {host} = properties;
const Posts = lazy(()=>import ('./Posts'));

const fetchData = async (key)=>{
    const forumId = key.queryKey[1];
    const token = key.queryKey[2];
    let page;
    if(typeof key.pageParam === "undefined")
        page=0;
    else
        page = key.pageParam;
    console.log(key);
    const res = await fetch(`${host}/api/v1/posts/forum/id/${forumId}/page/${page}`,{
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
    //use !data.last as the has more

    let token = "";
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;

    //const {posts,isPending} = useQuery(['forumId',id],fetchData,{keepPreviousData:true})
    const url = `${host}/api/v1/forums/id/${id}`;
    const [forum,isPending,forumError] = useFetch(url);

    //const {data,isLoading} = useQuery(['posts',id,token,pageNumber],fetchData,{keepPreviousData:true});
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage
      } = useInfiniteQuery(['posts',id,token], fetchData, {
        getNextPageParam: (lastPage, pages) => {
            console.log(pages);
            console.log("next page number : ",lastPage);        
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      })
    
    console.log(data);
    
    //var Filter = require('bad-words'),filter = new Filter();
   
    //the way i used before using the hasNextPage
    //data.pages!==undefined && data.pages.at(-1).content.length !== 0? !data.pages.at(-1).content.at(-1).last:false 
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

        <div>{forumError && <div>{forumError}</div>}</div>
        <div>{isPending && <div><Skeleton active/><Skeleton active/><Skeleton active/></div>}</div>
        <div>{data &&
        <InfiniteScroll
            pageStart={0}
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
            loader={<div className="loader" key={1}><Skeleton/></div>}
        >
            {data.pages.length && data.pages.map((post,index)=>{
                return(
                    <Suspense fallback={<Skeleton/>}>
                        {index===0 ? <Posts postsData={post} showForm={true}/>:<Posts postsData={post} showForm={false}/>}
                    </Suspense>
                )
            })}
        </InfiniteScroll>}
            </div>
    </div>)
}
export default ForumDetails;
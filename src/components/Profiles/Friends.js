import Avatar from "antd/lib/avatar/avatar";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "react-query";
import properties from "../../properties";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router";
import InfiniteScroll from "react-infinite-scroller";
import { Skeleton } from "antd";

const {host} = properties;
//const url = `${host}/api/v1/users/page/0`;
const fetchData = async (key)=>{
    const page = key.queryKey[1];
    const token = key.queryKey[2];
    const id = key.queryKey[3];
    const res = await fetch(`${host}/api/v1/friendships/userId/${id}/accepted/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } );
    return res.json();
}
const Friends = ()=>{
    const [cookies] = useCookies([]);
    const {id} = useParams(); 
    let token = "";
    const history = useHistory();
        //className="col-lg-4 col-xl-3" for previous div
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;
    else 
        history.push("/login");

    //const {data,isLoading} = useQuery(['page',0,token],fetchData,{keepPreviousData:true});
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage
      } = useInfiniteQuery(['posts',0,token,id], fetchData, {
        getNextPageParam: (lastPage, pages) => {
            console.log(pages);
            console.log("next page number : ",lastPage);        
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      })
    
    console.log("friends infinit data : ");
    console.log(data);
    return(
    <>
    <div className="container" style={{ background:"#edeff0", borderRadius:"10px", padding:"1rem",marginBottom:"1rem", marginTop:"1rem"}}>


    {/* show friends but for now i will show all users */}
    {isLoading && <div>loadning....</div>}
    {data && data.pages.length >= 0
    && !data.pages[0].empty
    && id === data.pages[0].content[0].receiver.id 
    &&<b>{data.pages[0].content[0].receiver.firstName} {data.pages[0].content[0].receiver.lastName}'s friends</b>}

    {data && data.pages.length >= 0
    && !data.pages[0].empty
    && id === data.pages[0].content[0].sender.id 
    && <b>{data.pages[0].content[0].sender.firstName} {data.pages[0].content[0].sender.lastName}'s friends</b>}

    {data &&
    <InfiniteScroll
    pageStart={0}
    loadMore={fetchNextPage}
    hasMore={hasNextPage}
    loader={<div className="loader" key={1}><Skeleton/></div>}
    >
        {data.pages.map((page)=>{
        return page.content.map((friendship)=>{
            return (id === friendship.sender.id ? <div>
                <Avatar src={`${host}/upload/viewFile/${friendship.receiver.avatar}`}>{friendship.receiver.firstName}</Avatar> <b><Link to={`/profile/${friendship.receiver.id}`}>{friendship.receiver.firstName} {friendship.receiver.lastName}</Link></b> 
                </div>:<div>
                <Avatar src={`${host}/upload/viewFile/${friendship.sender.avatar}`}>{friendship.sender.firstName}</Avatar> <b><Link to={`/profile/${friendship.sender.id}`}>{friendship.sender.firstName} {friendship.sender.lastName}</Link></b> 
                </div>)
        })
        
    })}
    </InfiniteScroll> 
    }
    </div>
    {hasNextPage && <div>has next page</div>}
    </>
    );
}
export default Friends;
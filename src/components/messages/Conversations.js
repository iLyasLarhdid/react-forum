import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import SockJS from "sockjs-client";
import properties from "../../properties";
import { useEffect, useState } from "react";
import Stomp from "stompjs";
import { Skeleton,message } from "antd";


const {host} = properties;

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    let page;
    if(typeof key.pageParam === "undefined")
        page=0;
    else
        page = key.pageParam;
    console.log(key);
    const res = await fetch(`${host}/api/v1/conversations/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const checkForDuplicates = (value)=>{

}

const Conversation = ({currentConversation,setCurrentConversation})=>{
    const [cookie,] = useCookies();
    const [conversations,setConversations] = useState([]);

    let token = "";
    let userId="";
    if(cookie.ilyToken != null){
        token = cookie.ilyToken;
        userId = cookie.principal_id;
    }

    
    const url = `${host}/ws`;
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage
      } = useInfiniteQuery(['conversations',token], fetchData, {
        getNextPageParam: (lastPage, pages) => {
            console.log(pages);
            console.log("next page number : ",lastPage);        
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      });

    useEffect(()=>{
        let sock = new SockJS(url);
        let stompClient = Stomp.over(sock);
        stompClient.connect({"Authorization": token},(frame)=>{
            console.log("connecting to : "+ frame);
            stompClient.subscribe(`/topic/conversation/to/${userId}`
                ,(response)=>{
                let data = JSON.parse(response.body);
                console.log("data from ws===========>");
                console.log(data);
                
                setConversations(prevM=>{return [data,...prevM]});
                //sleep(50).then(()=>{scroller.scrollTo({top:scroller.scrollHeight,left:0,behavior:'smooth'},document.body.scrollHeight)});
                }
            );
        })
    },[token,userId,url])
      
    const deleteConversationByConversationId = (id,isInConversation)=>{
        const url = `${host}/api/v1/conversations`;
        if(isInConversation)
            setCurrentConversation(null);
        fetch(url,{
            method:"delete",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': token
            },
            body:JSON.stringify({id})
        })
        .then(response => {
            if(response.status === 202){
                document.querySelector("#convo"+id).remove();
                message.success('deleted successfully');
            }
            else
                message.error("nope!!");
            console.log(response);
            return response});
    }

    
    console.log("the conversation already created : ",data);
    return (
    <>
    here is the conversations
    {isLoading && <div>loading ...</div>}
    <div>{data &&
        <InfiniteScroll
            pageStart={0}
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
            loader={<div className="loader"><Skeleton/></div>}
        >
            <>{data.pages.length && data.pages.map((conversations,index)=>{
                return conversations.content.map((conversation,index)=>{
                    return(
                        <>{currentConversation[0] === conversation.id ? 
                        <div id={`convo${conversation.id}`} onClick={()=>setCurrentConversation(prev=>[conversation.id,prev[0]])} style={{ color : "white", background : "black" , borderRadius : "10px"}} key={index} onDoubleClick={()=>deleteConversationByConversationId(conversation.id,true)}>{conversation.id}</div>
                           :
                        <div id={`convo${conversation.id}`} onClick={()=>setCurrentConversation(prev=>[conversation.id,prev[0]])} key={index} onDoubleClick={()=>deleteConversationByConversationId(conversation.id)} onDoubleClick={()=>deleteConversationByConversationId(conversation.id,false)}>{conversation.id}</div>}
                        </>
                    )
                });
                
            })}</>
            <>
            {conversations.length && conversations.map((conversation,index)=>{
                return(<>
                    <>{currentConversation[0] === conversation.id ? 
                    <div id={`convo${conversation.id}`} onClick={()=>setCurrentConversation(prev=>[conversation.id,prev[0]])} style={{ color : "white", background : "black" , borderRadius : "10px"}} key={index} onDoubleClick={()=>deleteConversationByConversationId(conversation.id,true)} >{conversation.id}-------{index}</div>
                           :
                    <div id={`convo${conversation.id}`} onClick={()=>setCurrentConversation(prev=>[conversation.id,prev[0]])} key={index} onDoubleClick={()=>deleteConversationByConversationId(conversation.id,false)}>{conversation.id}-------{index}</div>}
                    </>
                </>)
            })}
            </>
        </InfiniteScroll>}
    </div>
    
    </>)

}

export default Conversation;
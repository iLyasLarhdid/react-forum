import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import SockJS from "sockjs-client";
import properties from "../../properties";
import { useEffect, useState } from "react";
import Stomp from "stompjs";
import { Skeleton,message, Popconfirm, Button,Space } from "antd";
import { Link } from "react-router-dom";
import FormConversation from "./FormConversation";


const {host} = properties;

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const setConversations = key.queryKey[2];
    console.log("set cnvoooooooooooo ",key);
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
    } );

    setConversations([]);
    return res.json();
}

const Conversation = ()=>{
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
      } = useInfiniteQuery(['conversations',token,setConversations], fetchData, {
        getNextPageParam: (lastPage, pages) => {
            console.log(pages);
            console.log("next page number : ",lastPage);        
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      });
      console.log("conversations =======================> ",data);

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
      
    const deleteConversationByConversationId = (id)=>{
        const url = `${host}/api/v1/conversations`;
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
    <div className="container">
    <FormConversation/>
    {isLoading && <div>loading ...</div>}
    <div>{data &&
        <InfiniteScroll
            pageStart={0}
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
            loader={<div className="loader"><Skeleton/></div>}
        >
            <>
            {conversations && conversations.length>0 && conversations.map((conversation,index)=>{
                return(<>
                    <div key={conversation.id+""+index} id={`convo${conversation.id}`}>
                        <Link className="nav-link" to={`/messages/${conversation.id}`}>
                            {conversation.title}
                        </Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={()=>deleteConversationByConversationId(conversation.id)}>
                            <Button type="primary" danger>
                            Delete
                            </Button>
                        </Popconfirm>
                    </div>
                </>)
            })}
            </>
            <>{data.pages.length && data.pages.map((participants)=>{
                return participants.content.map((participant,index)=>{
                    return(
                        <>
                        
                        <div key={index} id={`convo${participant.conversation.id}`}>
                        <Space size={2}>
                        <Link className="nav-link" to={`/messages/${participant.conversation.id}`}>
                            {participant.conversation.title}
                        </Link>
                        <Popconfirm title="Sure to delete?" onConfirm={()=>deleteConversationByConversationId(participant.conversation.id)}>
                            <Button type="primary" danger>
                            Delete
                            </Button>
                        </Popconfirm>
                        </Space>
                        </div>
                        </>
                    )
                });
                
            })}</>
        </InfiniteScroll>}
    </div>
    </div>
    </>)

}

export default Conversation;
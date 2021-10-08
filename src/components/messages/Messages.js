import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import SockJS from "sockjs-client";
import properties from "../../properties";
import Stomp from "stompjs";
import { Skeleton } from "antd";
import FormMessages from "./FormMessages";
import { useParams } from "react-router";
const {host} = properties;

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const conversationId = key.queryKey[2];
    let page;
    if(typeof key.pageParam === "undefined")
        page=0;
    else
        page = key.pageParam;
    console.log(key);
    if(conversationId){
        const res = await fetch(`${host}/api/v1/messages/conversationId/${conversationId}/page/${page}`,{
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': token
            }
        } )
        return res.json();
    }
    return "null";
}

const Messages = ()=>{
    const {id} = useParams();
    const [cookie,] = useCookies();
    const [messages,setMessages] = useState([]);
    const url = `${host}/ws`;
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage
      } = useInfiniteQuery(['messages',cookie.ilyToken,id], fetchData, {
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
        if(id!==undefined){
            let sock = new SockJS(url);
            let stompClient = Stomp.over(sock);
            console.log("current convo is : ",id);
            
            stompClient.connect({"Authorization": cookie.ilyToken},(frame)=>{
                console.log("connecting to : "+ frame);
                console.log(stompClient.subscriptions);
                //stompClient.disconnect();
                // if(currentConversation[1]!==undefined){
                //     console.log("closing the convo",currentConversation[1]);
                //     //there is a problem with unsubscribing from a stomp client
                //     //even when you unsubscribe successfully you still get messages
                //     stompClient.unsubscribe(`${currentConversation[1]}`);
                // }
                stompClient.subscribe(`/queue/to/${id}`
                    ,(response)=>{
                    let data = JSON.parse(response.body);
                    console.log("data from ws===========>");
                    console.log(data);
                    console.log("c c=================>:",id);
                    if(id===data.conversation.id)
                    setMessages(prevM=>{return [...prevM,data]});
                    },{id:`${id}`}
                );
            })
          }
    },[cookie.ilyToken,url,id])

      console.log("the messages data : ",data);
      return (
          <>
          <div className="container">
          {isLoading && <div>loading ...</div>}
          {data && 
              <><div
              id="scrollableDiv"
              style={{ height:300,
                  overflow:'auto',
                  display:'flex',
                  flexDirection:'column-reverse',
                  background:"#FDFAF9",
                  borderRadius:"10px",
                  padding:"1rem",
                  marginTop:"1rem"
              }}
            >
                <InfiniteScroll
                  style={{ display:'flex',flexDirection:'column-reverse' }}
                  inverse={'true'}
                  pageStart={0}
                  loadMore={fetchNextPage}
                  hasMore={hasNextPage}
                  loader={<div className="loader" key={1}><Skeleton/></div>}
                  >
  
                  <div>{messages && messages.map((message)=>{
                      return(<>{message.sender.id === cookie.principal_id ? 
                      <div key={message.id} style={{ textAlign:"right" }}><div style={{  background:"#00B2FF",display:"inline-block",color:"white", paddingRight:"1rem", paddingLeft:"1rem",marginTop:"0.5rem"  }}>{message.sender.firstName} : {message.message}</div></div>
                      :
                      <div key={message.id}>
                          <div style={{  background:"#075E54",display:"inline-block",color:"white", paddingRight:"1rem", paddingLeft:"1rem",marginTop:"0.5rem"  }}>
                              {message.sender.firstName} : {message.message}
                            </div>
                        </div>}</>)
                     })
                    }
                  </div>
                  <div>{messages && messages.length>0 && <div style={{ textAlign:"center", background:"#25D366", marginTop:"1rem"}}>new messages</div>}</div>
                  <div>{data.pages.length && data.pages.map((messages)=>{
                      return(
                          <>{messages && messages.content!== undefined && messages.content.map((message)=>{
                              return(
                                <>{message.sender.id === cookie.principal_id ? 
                                    <div key={message.id} style={{ textAlign:"right"}}>
                                        <div style={{  background:"#00B2FF",display:"inline-block",color:"white", paddingRight:"1rem", paddingLeft:"1rem",marginTop:"0.5rem"  }}>
                                            {message.sender.firstName} : {message.message}
                                        </div>
                                    </div>
                                    :
                                    <div key={message.id}>
                                        <div style={{  background:"#075E54",display:"inline-block",color:"white", paddingRight:"1rem", paddingLeft:"1rem",marginTop:"0.5rem"  }}>
                                            {message.sender.firstName} : {message.message}
                                            </div>
                                    </div>}</>
                              )
                          })}</>
                              
                      )
                  })}</div>
                  </InfiniteScroll>
            </div> 
            </>
          }
          {id && <FormMessages currentConversation={id} receiver={null}/>}
          </div>
          </>
      );

}
export default Messages;
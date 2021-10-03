import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import SockJS from "sockjs-client";
import properties from "../../properties";
import Conversation from "./Conversations";
import Stomp from "stompjs";
import { Skeleton } from "antd";
import FormConversation from "./FormConversation";
import FormMessages from "./FormMessages";
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

    const [cookie,] = useCookies();
    const [currentConversation,setCurrentConversation] = useState([]);
    const [messages,setMessages] = useState([]);
    const url = `${host}/ws`;
    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage
      } = useInfiniteQuery(['posts',cookie.ilyToken], fetchData, {
        getNextPageParam: (lastPage, pages) => {
            console.log(pages);
            console.log("next page number : ",lastPage);        
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      });

      console.log("converastion ====================================>",currentConversation);
    
    useEffect(()=>{
        if(currentConversation[0]!==undefined || currentConversation[1]!==undefined){
            let sock = new SockJS(url);
            let stompClient = Stomp.over(sock);
            console.log("current convo is : ",currentConversation[0]);
            
            stompClient.connect({"Authorization": cookie.ilyToken},(frame)=>{
                console.log("connecting to : "+ frame);
                console.log(stompClient.subscriptions);
                if(currentConversation[1]!==undefined){
                    console.log("closing the convo",currentConversation[1]);
                    //there is a problem with unsubscribing from a stomp client
                    //even when you unsubscribe successfully you still get messages
                    stompClient.unsubscribe(`${currentConversation[1]}`);
                }
                stompClient.subscribe(`/queue/to/${currentConversation[0]}`
                    ,(response)=>{
                    let data = JSON.parse(response.body);
                    console.log("data from ws===========>");
                    console.log(data);
                    console.log("c c=================>:",currentConversation);
                    if(currentConversation[0]===data.conversation.id)
                    setMessages(prevM=>{return [...prevM,data]});
                    },{id:`${currentConversation[0]}`}
                );
            })
          }
    },[cookie.ilyToken,url,currentConversation])

      console.log("the messages data : ",data);
      return (
          <>
          <div className="container">
          {isLoading && <div>loading ...</div>}
          <FormConversation/>
          <Conversation currentConversation={currentConversation} setCurrentConversation={setCurrentConversation}/>
          

          {currentConversation && data && 
              <><div
              id="scrollableDiv"
              style={{ height:300,
                  overflow:'auto',
                  display:'flex',
                  flexDirection:'column-reverse'
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
  
                  <div>{data.pages.length && data.pages.map((messages,index)=>{
                      return(
                          <>{messages && messages.content!== undefined && messages.content.map((message,index)=>{
                              return(
                                      <div key={message.id}>{message.message}</div>
                              )
                          })}</>
                              
                      )
                  })}</div>
                  <div>new messages : </div>
                  <div>{messages && messages.map((message)=>{
                      return(<div key={message.id}>{message.sender.firstName} : {message.message}--{message.conversation.id}</div>)
                  })
                  }</div>
  
                  </InfiniteScroll>
            </div> 
            </>
          }
          {currentConversation[0] && <FormMessages currentConversation={currentConversation} receiver={null}/>}
          </div>
          </>
      );

}
export default Messages;
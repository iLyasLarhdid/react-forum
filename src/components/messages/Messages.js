import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useInfiniteQuery } from "react-query";
import SockJS from "sockjs-client";
import properties from "../../properties";
import Stomp from "stompjs";
import { Avatar, Button, Skeleton } from "antd";
import FormMessages from "./FormMessages";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
const {host} = properties;

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const conversationId = key.queryKey[2];
    let page;
    if(typeof key.pageParam === "undefined")
        page=0;
    else
        page = key.pageParam;

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
        getNextPageParam: (lastPage) => {     
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      });

      console.log("mess ", data);

    useEffect(()=>{
        if(id!==undefined){
            const sock = new SockJS(url);
            const stompClient = Stomp.over(sock);
            stompClient.reconnect_delay=5000;
            stompClient.connect({"Authorization": cookie.ilyToken},(frame)=>{
                stompClient.subscribe(`/queue/to/${id}`
                    ,(response)=>{
                        console.log("recieved d",response);
                        let data = JSON.parse(response.body);
                        if(id===data.conversation.id)
                            setMessages(prevM=>{return [...prevM,data]});
                    },{}
                );
            })
            
          }
    },[cookie.ilyToken,url,id]);

    useEffect(()=>{
        setMessages([]);
    },[data]);


      return (
          <>
          <div className="container">
          {isLoading && <div>loading ...</div>}
          {data && 
              <><div
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
                <div>{messages && messages.map((message)=>{
                      return(<>{message.sender.id === cookie.principal_id ? 
                      <div key={message.id} style={{ textAlign:"right" }}>
                          <div style={{  background:"#00B2FF",display:"inline-block",color:"white", paddingRight:"1rem", paddingLeft:"1rem",marginTop:"0.5rem"  }}>
                          {message.sender.firstName} : {message.message}</div>
                          <Link to={`/profile/${cookie.principal_id}`}>
                              <Avatar src={cookie.principal_avatar}/>
                            </Link>
                    </div>
                      :
                      <div key={message.id}>
                          <Link to={`/profile/${message.sender.id}`}>
                              <Avatar alt="avatar" src={`${host}/upload/viewFile/${message.sender.avatar}`}/>
                            </Link>
                          <div style={{  background:"#075E54",display:"inline-block",color:"white", paddingRight:"1rem", paddingLeft:"1rem",marginTop:"0.5rem"  }}>
                              {message.sender.firstName} : {message.message}
                            </div>
                        </div>}</>)
                     })
                    }
                  </div>
                  <div>{messages && messages.length>0 && <div style={{ textAlign:"center", background:"#25D366", marginTop:"1rem"}}>new messages</div>}</div>
                  <div>{data.pages.length && data.pages.slice(0).reverse().map((messages)=>{
                      return(
                          <>{messages && messages.content!== undefined && messages.content.slice(0).reverse().map((message)=>{
                              return(
                                <>{message.sender.id === cookie.principal_id ? 
                                    <div key={message.id} style={{ textAlign:"right"}}>
                                        <div style={{  background:"#00B2FF",display:"inline-block",color:"white", paddingRight:"1rem", paddingLeft:"1rem",marginTop:"0.5rem"  }}
                                        >
                                            {message.sender.firstName} : {message.message}
                                        </div>
                                        <div style={{ display:"inline-block" }}>
                                        <Link to={`/profile/${cookie.principal_id}`}>
                                            <Avatar src={cookie.principal_avatar} alt="avatar"/>
                                        </Link>
                                        </div>
                                    </div>
                                    :
                                    <div key={message.id}>
                                        <Link to={`/profile/${message.sender.id}`}>
                                            <Avatar alt="avatar" src={`${host}/upload/viewFile/${message.sender.avatar}`}/>
                                        </Link>
                                        <div style={{  background:"#075E54",display:"inline-block",color:"white", paddingRight:"1rem", paddingLeft:"1rem",marginTop:"0.5rem"  }}>
                                            {message.sender.firstName} : {message.message}
                                            </div>
                                    </div>}</>
                              )
                          })}</>
                              
                      )
                  })}</div>
                  {isLoading && <Skeleton/>}
                  {hasNextPage && <Button><div onClick={fetchNextPage} style={{ textAlign:"center"}}>Load more</div></Button>}
            </div> 
            </>
          }
          {id && <FormMessages currentConversation={id} receiver={null}/>}
          </div>
          </>
      );

}
export default Messages;
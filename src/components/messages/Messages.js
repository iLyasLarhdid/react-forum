import { useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import properties from "../../properties";
import ChatList from "./ChatList"
import FormMessage from "./FormMessage";
import "./messages.css";
const {host} = properties;
const fetchData = async (key)=>{
  const page = key.queryKey[1];
  const token = key.queryKey[2];
  const res = await fetch(`${host}/api/v1/messages/conversation/2c919ec17bf5f372017bf5f4474f0000/page/${page}`,{
      headers: {
          'Content-Type' : 'application/json',
          'Authorization': token
      }
  })
  return res.json();
}

const Messages = ()=>{
    const demoData = [{ 'name':"said","message":"we get the people he messaged before" },
    { 'name':"ilyas","message":"we give them the possibiliy to text their friends" },
    { 'name':"ilyas","message":"we give them the possibiliy to text their friends" },
    { 'name':"ilyas","message":"we give them the possibiliy to text their friends" },
    { 'name':"taha","message":"we show people who are online now" }
    ];
    const [currentUser, setCurrentUser] = useState(null);
    const [cookies,] = useCookies([]);

    const [pageNumber, setPageNumber] = useState(0);

    let token;
      if(cookies.ilyToken != null)
          token = cookies.ilyToken;
  
    const {data,isLoading} = useQuery(['users',pageNumber,token],fetchData,{keepPreviousData:true});
    //we get the people he messaged before
    //we show people who are online now
    //we show the all people they have in their friends list
    //we give them the possibiliy to text their friends
    //we give the possibiliy to text anyone whos not in friends list (if they enable being texted)
    //calling someone with WebRTC
    //blocking someone
    
    //1 lets implement messaging first as a test
    return (<>
        <div className="container">
        <div className="row" style={{ margin:"5px" }}>
        
            <div style={{ background:"#edeff0", borderRadius:"10px"}}>
                <div >
                <ChatList messagedUsersList={demoData} user={{ currentUser,setCurrentUser }}/>
                </div>
            </div>

            <div  className="" style={{ background:"#FDFAF9", borderRadius:"10px", marginRight:"1rem", padding:"1rem",marginBottom:"1rem"}}>
                
                {currentUser && <div>{currentUser}</div>}
                <div style={{ position:"relative", bottom:"0px" }}>
                    <FormMessage conversationMessages={data}/>
                </div>
            </div>
        
        </div>
    </div>
    </>)
    
}
export default Messages;
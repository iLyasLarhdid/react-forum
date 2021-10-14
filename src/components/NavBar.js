import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { UserContext } from "../hooks/UserContext";
import { Affix, message,Badge } from 'antd';
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import properties from "../properties";

const NavBar = () =>{
    const [cookie,] = useCookies();
    const [role,] = useContext(UserContext);
    const {host} = properties;
    const [numberOfMessageNotifications,setNumberOfMessageNotifications] = useState(0);
    const userId = cookie.principal_id;
    

    let token;
    if(cookie.ilyToken)
      token = cookie.ilyToken;

    useEffect(()=>{
      const url = `${host}/ws`;
      let sock = new SockJS(url);
      let stompClient = Stomp.over(sock);
      stompClient.connect({"Authorization": token},(frame)=>{
          console.log("connecting to : "+ frame);
          stompClient.subscribe(`/topic/conversation/to/${userId}`
              ,(response)=>{
              let data = JSON.parse(response.body);
              console.log("data from ws notifications===========>");
              console.log(data);
              
              setNumberOfMessageNotifications(prev=>prev+1);
              message.success(`you have got a new message from ${data.title}`)
              //sleep(50).then(()=>{scroller.scrollTo({top:scroller.scrollHeight,left:0,behavior:'smooth'},document.body.scrollHeight)});
              }
          );
      })
  },[token,userId,host])

    return (<>
    <Affix>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">Ily-Forum</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <Badge count={numberOfMessageNotifications} size="small" offset={[0, 14]}>
        <span className="navbar-toggler-icon"></span>
      </Badge>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
          </li>
          {!role ? <li className="nav-item"><Link className="nav-link" to="/signup">sign up</Link></li>:""}
          <li className="nav-item">
            {!role ? <Link className="nav-link" to="/login">login</Link> : <Link className="nav-link" to="/logout">logout</Link>}
          </li>
          <li className="nav-item">
          <span className="nav-link">
          {role ? 
          <>
            
              welcome <Link to={`/profile/${cookie.principal_id}`}>{cookie.principal_first_name}</Link>
            
          </>
          : ""
          }
          </span> 
          </li>
          {role ? 
          <>
            
            <li className="nav-item">
              <Badge count={numberOfMessageNotifications} size="small" offset={[0, 14]}>
                <Link className="nav-link" to="/conversations" onClick={()=>setNumberOfMessageNotifications(0)}>messages</Link>
              </Badge>
            </li>
            
          </>
          : ""
          }
          
        </ul>
      </div>
    </div>
  </nav></Affix></>)
}
export default NavBar;
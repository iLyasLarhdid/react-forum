import { useState } from "react";
import { Avatar, Badge,List } from 'antd';
import properties from "../../properties";
import { Link } from "react-router-dom";


const ChatList =({messagedUsersList,user})=>{
    const [messagedUsers,setMessagedUsers] = useState(messagedUsersList);
    return (<>
            <List
            itemLayout="horizontal"
            grid={{ gutter: 16 }}
            style={{ overflow: "auto",whiteSpace:"nowrap", padding:"1rem" }}
            dataSource={messagedUsers}
            renderItem={item => (
              <List.Item style={{ display:"inline-grid" }}>
                <List.Item.Meta
                  avatar={<Badge count={99} overflowCount={10}><Avatar /></Badge>}
                  title={<Link to="" onClick={()=>user.setCurrentUser(12)}></Link>}
                />
              </List.Item>
            )}
            />
            
          </>
        );
            
}
export default ChatList;
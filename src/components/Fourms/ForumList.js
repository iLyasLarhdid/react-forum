import { Dropdown, List,message,Popconfirm, Space, Menu, Button } from "antd";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import properties from "../../properties";
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined,DownOutlined } from '@ant-design/icons';
import React from "react";

function writeNumber(number){
    if(number === null)
        return 0;
    if(number>=1000000000000)
        return number/1000000000000+"T";
    if(number>=1000000000)
        return number/1000000000+"B";
    if(number>=1000000)
        return number/1000000+"M";
    if(number>=1000)
        return number/1000+"K";  
    
    return number;
}

//todo tomorrow fix the bug where number of comments keeps getting rendered over and over and over again as you type
const ForumList = ({forumData}) =>{
    const [forums,setForums] =  useState(forumData);
    const [role,] = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [forumId, setForumId] = useState("");
    const [titleUpdate, setTitleUpdate] = useState("");
    const [contentUpdate, setContentUpdate] = useState("");
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const {host} = properties;
    var Filter = require('bad-words'),
    filter = new Filter();
    //console.log(filter.clean("Don't be an ash0le"));
    
    const history = useHistory();

    if(!cookies.ilyToken)
        history.push("/login");
        

    useEffect(()=>{
        setForums(forumData);
    },[forumData]);

    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    //filling the state variables for edit
    const fillStateVariables = (title,content,forumId)=>{
            setTitleUpdate(title);
            setContentUpdate(content);
            setForumId(forumId);
    }

    const IconText = ({ icon, text }) => (
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
      );
    
    //update forum
    const updateForum = (e)=>{
        e.preventDefault();
        document.querySelector("#updateForum").click();

        if(title.length < 5||content.length < 10)
            return;

        message.loading('updating....',"updating");

        const url = `${host}/api/v1/forums`;
        fetch(url,{
            method:"put",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({forumId,titleUpdate,contentUpdate,userId})
        })
        .then(response => response.json()
        .then(data=>{
            //todo you should delete this setforums since it just renders again for no reason
            setForums([...forums,data])
            let updatedForums = forums.map((forum)=>{
                if(forum.id !== data.id)
                    return forum;
                return  data;
            });
            setForums(updatedForums);
            setTitle("");
            setContent("");
            message.success({content:'Updated successfully', key:"updating", duration:2});
        }));

    }
    //delete forum 
    const deleteForum = (e)=>{
        //console.log(e.target.value);
        const url = `${host}/api/v1/forums/id/${e}`;
        fetch(url,{
            method:"delete",
            headers: {
                'Authorization': cookies.ilyToken
            }
        })
        .then(response => {
            document.querySelector("#row"+e).remove();
            message.success('deleted successfully');
            return response});
    }
    //adding forum 
    const addForum = (e)=>{
        e.preventDefault();
        
        if(title.length < 5||content.length < 10)
            return;
        const url = `${host}/api/v1/forums`;
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({title,content,userId})
        })
        .then(response => {
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json()})
        .then(data=>{
            console.log(data);
            setForums([...forums,data]);
            setTitle("");
            setContent("");
            message.success('Added successfully');
        }).catch((err)=>{
            message.error(err);
        });
    }
    return (
        <div className="forums-container">
            <h2>Forums</h2>

            <List
            itemLayout="vertical"
            style={{ background:"#f8f9fa",padding:"2rem",borderRadius:"10px" }}
            dataSource={forums}
            renderItem={item => (
            <List.Item 
            id={"row"+item.id}
            actions={[
                <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                <IconText icon={MessageOutlined} text={writeNumber(item.numberOfPosts)} key="list-vertical-message" />,
                <IconText icon={EyeOutlined} text={writeNumber(item.views)} key="list-vertical-message" />,
                role==="ADMIN" ?
                 <Dropdown overlay={<Menu>
                    <Menu.Item danger>
                      <Popconfirm title="Sure to cancel?" onConfirm={()=>deleteForum(item.id)}>delete</Popconfirm>
                    </Menu.Item>
                    <Menu.Item><span data-bs-toggle="modal" data-bs-target="#updateForum" value={item.id} onClick={()=>fillStateVariables(item.title,item.content,item.id)}>edit</span></Menu.Item>
                  </Menu>}>
                 <Button type="link" onClick={e => e.preventDefault()} style={{ color:"black" }}>
                    Hover me <DownOutlined />
                </Button>
               </Dropdown>:"",
              ]}
            >
                <List.Item.Meta
                title={<Link to={`/forums/${item.id}`}>{filter.clean(item.title)}</Link>}
                description={<Link to={`/forums/${item.id}`} style={{ color:"black" }}>{filter.clean(item.content)}</Link>}
                />
            </List.Item>
            )}
        />

        {role==="ADMIN" ? <>
            <button className="btn btn-outline-success mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#addForum" aria-expanded="false" aria-controls="addForum" onClick={()=>{sleep(250).then(()=>{window.scrollTo(0,document.body.scrollHeight)})}}>Add forum</button>

            <form className="collapse multi-collapse" id="addForum" onSubmit={addForum}>
            <div className="row g-2">
                <div className="col-md-7">
                    <div className="form-floating">
                    <input type="text" required minLength="5" className="form-control" id="title" placeholder="Title" onBlur={(e)=>setTitle(e.target.value)}/>
                    <label htmlFor="title">Title</label>
                    </div>
                </div>
                <div className="col-md-7">
                    <textarea minLength="10" required className="form-control" id="content" placeholder="content"  onBlur={(e)=>setContent(e.target.value)} rows="5" ></textarea>
                </div>
                <div>
                    <button className="btn btn-success mb-5" type="submit">submit</button>
                </div>            
            </div>
            </form>
            </>:""}

            {forumId && <>
            {/* modal for uodating the forum                     */}
            <form onSubmit={updateForum} name={forumId}>
                        <div className="modal fade" id={"updateForum"} tabIndex="-1" aria-labelledby="updateForumLable" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateForumLable">Edit forum</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/* form in my body */}
                                <div className="row g-2">
                                    <div>
                                        <div className="form-floating">
                                        <input type="text" required minLength="5" className="form-control" id="title" placeholder="Title" onBlur={(e)=>setTitleUpdate(e.target.value)}/>
                                        <label htmlFor="title">Title</label>
                                        </div>
                                    </div>
                                    <div>
                                        <textarea minLength="10" required className="form-control" id="content" placeholder="content" onBlur={(e)=>setContentUpdate(e.target.value)} rows="5"></textarea>
                                    </div>     
                                </div>
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button className="btn btn-outline-success" type="submit" >Update</button>
                            </div>
                             
                            </div>
                        </div>
                        </div>
                        </form>
            </>}
        </div>
    );
}
export default ForumList;
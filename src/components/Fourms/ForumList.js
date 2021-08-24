import { Dropdown, List,message,Popconfirm, Space, Menu, Button,Form, Input } from "antd";
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
const layout = {
    wrapperCol: {
      span: 24,
    },
  };


//todo tomorrow fix the bug where number of comments keeps getting rendered over and over and over again as you type
const ForumList = ({forumData}) =>{
    const [forums,setForums] =  useState(forumData);
    const [role,] = useContext(UserContext);
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const {host} = properties;
    var Filter = require('bad-words'),
    filter = new Filter();
    //console.log(filter.clean("Don't be an ash0le"));
    
    const history = useHistory();

    if(!cookies.ilyToken ||cookies.ilyToken ==null )
        history.push("/login");
        

    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    //filling the state variables for edit used to be here
    

    const IconText = ({ icon, text }) => (
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
      );
    
    //update forum used tobe here
    
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
    const onFinish = (values) => {
        console.log(values);
        if(values.title.length < 5||values.content.length < 10)
            return;
        message.loading('Adding new forum ...',"adding");
        const url = `${host}/api/v1/forums`;
        const title = values.title;
        const content = values.content;
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
            message.success({content:'Added successfully', key:"adding", duration:2});
        }).catch((err)=>{
            message.error({content:'something went wrong! try again', key:"adding", duration:2});
            message.error(err);
        });
      };

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
            <button className="btn btn-outline-success mb-3 mt-3" type="button" data-bs-toggle="collapse" data-bs-target="#addForum" aria-expanded="false" aria-controls="addForum" onClick={()=>{sleep(250).then(()=>{window.scrollTo(0,document.body.scrollHeight)})}}>Add forum</button>

            <Form {...layout} name="forum" onFinish={onFinish} className="collapse multi-collapse" id="addForum">
            <Form.Item
                label="title"
                name="title"
                rules={[{ required: true, message: 'Please add title!' }]}
            >
                <Input/>
            </Form.Item>
            <Form.Item 
                name='content' 
                label="content"
                rules={[{ required: true, message: 'Please add content!' }]}
            >
                <Input.TextArea rows="5" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
            </Form>
            </>:""}


        </div>
    );
}
export default ForumList;
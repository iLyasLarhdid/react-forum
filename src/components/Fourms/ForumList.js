import { List,message,Popconfirm, Space, Menu, Button,Form, Input, Drawer } from "antd";
import { useContext, useEffect, useState, lazy } from "react";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import properties from "../../properties";
import { MessageOutlined, LikeOutlined, StarOutlined, EyeOutlined,SettingOutlined } from '@ant-design/icons';
import React from "react";
import { Suspense } from "react";
const Dropdown = lazy(()=>import ('antd').then(mod=>({default:mod.Dropdown})));

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
    labelCol: {
        span: 24,
      },
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
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [formUpdate] = Form.useForm();

    const showDrawer = (forumId,title,content) => {
        formUpdate.setFieldsValue({
            forumId:forumId,
            titleUpdate:title,
            contentUpdate:content
        })
        setVisible(true);
    };

    const onClose = () => {
        form.resetFields();
        setVisible(false);
    };
    //todo : you should look for a way to lazy load this so it doesnt make your page slow
    //var Filter = require('bad-words'),filter = new Filter();
    //console.log(filter.clean("Don't be an ash0le"));
    
    const history = useHistory();

    if(!cookies.ilyToken ||cookies.ilyToken ==null )
        history.push("/login");
        
    useEffect(()=>{
        setForums(forumData);
    },[forumData]);
    // sleep time expects milliseconds
    // function sleep (time) {
    //     return new Promise((resolve) => setTimeout(resolve, time));
    // }

    //filling the state variables for edit used to be here
    

    const IconText = ({ icon, text }) => (
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
      );
    
    //update forum used tobe here
    //update forum
    const updateForum = (values)=>{

        console.log(values);
        if(values.titleUpdate.length < 5||values.contentUpdate.length < 10)
            return;
        message.loading('Adding new forum ...',"adding");
        const url = `${host}/api/v1/forums`;
        const title = values.titleUpdate;
        const content = values.contentUpdate;
        const id = values.forumId;
        fetch(url,{
            method:"put",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({id,title,content,userId})
        })
        .then(response => {
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json()})
        .then(data=>{
            console.log(data);
            let updatedForums = forums.map((forum)=>{
                if(forum.id !== data.id)
                    return forum;
                return  data;
            });
            setForums(updatedForums);
            message.success({content:'Added successfully', key:"adding", duration:2});
            formUpdate.resetFields();
        }).catch((err)=>{
            message.error({content:'something went wrong! try again', key:"adding", duration:2});
        });

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
    const addForum = (values) => {
        if(values.title.length < 5){
            message.warning("title needs to be more than 4 characters")
            return;
        }
        if(values.content.length < 10){
            message.warning("content needs to be more than 9 characters")
            return;
        }
            
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
            form.resetFields();
        }).catch((err)=>{
            message.error({content:'something went wrong! try again', key:"adding", duration:2});
        });
      };

    return (
        <div className="forums-container">
            <h2>Forums</h2>
            <List
            itemLayout="vertical"
            style={{ background:"#fafafa",marginBottom:"10px",padding:"2rem",borderRadius:"10px" }}
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
                 <Suspense fallback={<div>loading...</div>}>
                     <Dropdown overlay={
                        <Menu>
                        <Menu.Item danger>
                        <Popconfirm title="Sure to cancel?" onConfirm={()=>deleteForum(item.id)}>
                            <Button type="primary" danger>
                            Delete
                            </Button>
                        </Popconfirm>
                        </Menu.Item>
                        <Menu.Item success>
                        <Button type="primary" onClick={()=>showDrawer(item.id,item.title,item.content)}>
                            Edit
                        </Button>
                        </Menu.Item>
                        </Menu>}>

                        <Button type="link" onClick={e => e.preventDefault()} style={{ color:"black" }}>
                        <SettingOutlined />
                        </Button>
                    </Dropdown>
                 </Suspense>:"",
              ]}
            >
                <List.Item.Meta
                title={<Link to={`/forums/${item.id}`}>{item.title}</Link>}
                description={<Link to={`/forums/${item.id}`} style={{ color:"black" }}>{item.content}</Link>}
                />
            </List.Item>
            )}
        />

        {role==="ADMIN" ? <>
            <Form {...layout} name="forum" form={form} onFinish={addForum}>
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

            <Drawer
            title="Basic Drawer"
            placement="right"
            closable={false}
            width={"90%"}
            onClose={onClose}
            visible={visible}
            footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
            </div>
          }
            >
                <Form {...layout} name="forum" form={formUpdate} onFinish={updateForum}>
                    <Form.Item
                        hidden="true"
                        label="title"
                        name="forumId"
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="title"
                        name="titleUpdate"
                        rules={[{ required: true, message: 'Please add title!' }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item 
                        name='contentUpdate' 
                        label="content"
                        rules={[{ required: true, message: 'Please add content!' }]}
                    >
                        <Input.TextArea rows="5" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" onClick={onClose}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>


        </div>
    );
}
export default React.memo(ForumList);
import { Form, Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useCookies } from "react-cookie";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import properties from '../../properties';
const {host} = properties;
const layout = {
    wrapperCol: {
      span: 24,
    },
  };


const FormMessage=({conversationMessages})=>{
  const [cookies,] = useCookies([]);
  const [form] = Form.useForm();
  const [messages,]=useState(conversationMessages);
  const [newMessages,setNewMessages]=useState([]);
  const [conversationId,] = useState("2c919ec17bf5f372017bf5f4474f0000");

  console.log("conver mess:");
  console.log(conversationMessages);

  const scroller = document.querySelector("#scroller");

  const url = `${host}/ws`;
  console.log(messages);
  // sleep time expects milliseconds
  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const connect = ()=>{
    let sock = new SockJS(url);
    console.log(sock);
    let stompClient = Stomp.over(sock);
    stompClient.connect({"Authorization": cookies.ilyToken},(frame)=>{
        console.log("connecting to : "+ frame);
        stompClient.subscribe(`/queue/to/${conversationId}`
            ,(response)=>{
            let data = JSON.parse(response.body);
            console.log("data test");
            console.log(data);
            
            setNewMessages(prevM=>{return [...prevM,data]});
            console.log("new mess");
            console.log(newMessages);
            sleep(50).then(()=>{scroller.scrollTo({top:scroller.scrollHeight,left:0,behavior:'smooth'},document.body.scrollHeight)});
            }
        );
    })
  }
    

    const onFinish = (values) => {
        //console.log(values);
        let message = values.message;
        //stompClient.send("/queue/to/2c9128417b632ec0017b6373937d0002",{},JSON.stringify(message));
        fetch(`${host}/api/v1/messages`,{
          method:"post",
          headers: {
              'Content-Type' : 'application/json',
              'Authorization': cookies.ilyToken
          },
          body:JSON.stringify({message,conversationId})
        }).then(response=>{
          console.log(response);
          return response.json();
        }).then(data=>{
          console.log(data);
        });

        form.resetFields();
      };
    return (<>
    
    <div style={{ overflowY:"scroll",height:"50vh" }} id="scroller">
    <div>{conversationMessages && conversationMessages.content.map((message)=>{
      return (<div key={message.id}>{message.sender.firstName} : {message.message}</div>);
    })}</div>
    <div>{newMessages && newMessages.map((message)=>{
      return (<div key={message.id}>{message.sender.firstName} : {message.message}</div>);
    })}</div>
    </div>
    <Form {...layout} name="nest-messages" onFinish={onFinish} form={form}>
      <Form.Item 
      name={['message']}
      rules={[{ required: true, message: "This field shouldn't be empty!" }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
            Send <SendOutlined />
        </Button>
        <Button type="primary" onClick={connect} style={{ marginLeft:"10px" }}>
            connect
        </Button>
      </Form.Item>
    </Form>
    </>)
}

export default FormMessage;
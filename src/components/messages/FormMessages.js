import { Button, Form, Input } from "antd";
import { useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import SockJS from "sockjs-client";
import properties from "../../properties";
import Stomp from "stompjs";

const layout = {
    wrapperCol: {
      span: 24,
    },
  };

const FormMessages =({currentConversation,receiver})=>{
    const [form] = Form.useForm();
    const {host} = properties;
    const [cookie,] = useCookies();
    const emailInput = useRef(null);

    
    useEffect(() => {
        if (emailInput.current) {
          emailInput.current.focus();
        }
      }, []);
    
    const sendMessage = (values)=>{
        if(values.message.length<1){
            return
        }
        const url = `${host}/ws`;
        const sock = new SockJS(url);
        const stompClient = Stomp.over(sock);
        stompClient.reconnect_delay = 5000;
        
        console.log(values);
        //setIsButtonLoading(true);
        //const url = `${host}/api/v1/messages`;
        const message = values.message;
        const conversationId = currentConversation;
        
        stompClient.connect({"Authorization": cookie.ilyToken},(frame)=>{
            stompClient.send(`/app/message`, {}, JSON.stringify({message,receiver,conversationId}));
        })
        //stompClient.send(`/app/message`, {}, JSON.stringify({message,receiver,conversationId}));

        form.resetFields();
        // fetch(url,{
        //     method:'POST',
        //     headers:{
        //         'Content-Type' : 'application/json',
        //         'Authorization': cookie.ilyToken
        //     },
        //     body:JSON.stringify({message,receiver,conversationId})
        // })
        // .then(response=>{
        //     if(!response.ok){
        //         throw Error("something went wrong!");
        //     }
        //     return response.json();
        // })
        // .then(data=>{
        //     console.log(data);
        //     setIsButtonLoading(false);
        // }).catch((err)=>{
        //     console.log(err);
        //     setIsButtonLoading(false);
        // });
        if (emailInput.current) {
            emailInput.current.focus();
        }
    }

    return (<>
        <Form {...layout} name="forum" form={form} onFinish={sendMessage} autoComplete='off'>
            <Form.Item
                label="message"
                name="message"
                rules={[{ required: true, message: 'Please add message!' }]}
            >
                <Input ref={emailInput}/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">submit</Button>
            </Form.Item>
        </Form>
    </>);
}

export default FormMessages;
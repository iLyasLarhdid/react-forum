import { Button, Form, Input } from "antd";
import { useState } from "react";
import { useCookies } from "react-cookie";
import properties from "../../properties";

const layout = {
    wrapperCol: {
      span: 24,
    },
  };

const FormMessages =({currentConversation,receiver})=>{
    const [form] = Form.useForm();
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const {host} = properties;
    const [cookie,] = useCookies();

    const sendMessage = (values)=>{
        if(values.message.length<1){
            return
        }
        console.log(values);
        setIsButtonLoading(true);
        const url = `${host}/api/v1/messages`;
        const message = values.message;
        const conversationId = currentConversation;

        fetch(url,{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
                'Authorization': cookie.ilyToken
            },
            body:JSON.stringify({message,receiver,conversationId})
        })
        .then(response=>{
            if(!response.ok){
                throw Error("something went wrong!");
            }
            return response.json();
        })
        .then(data=>{
            console.log(data);
            setIsButtonLoading(false);
            form.resetFields();
        }).catch((err)=>{
            console.log(err);
            setIsButtonLoading(false);
        });
        

    }

    return (<>
        <Form {...layout} name="forum" form={form} onFinish={sendMessage}>
            <Form.Item
                label="message"
                name="message"
                rules={[{ required: true, message: 'Please add message!' }]}
            >
                <Input/>
            </Form.Item>
            <Form.Item>
                {isButtonLoading ? 
                    <Button type="primary" loading disabled>Loading</Button>
                :
                    <Button type="primary" htmlType="submit">submit</Button>}
            </Form.Item>
        </Form>
    </>);
}

export default FormMessages;
import { useState } from "react";
import { message, Button,Form, Input } from "antd";
import properties from "../../properties";
import { useCookies } from "react-cookie";
import Select from "react-select";

const layout = {
    wrapperCol: {
      span: 24,
    },
  };

const FormConversation=()=>{
    const [form] = Form.useForm();
    const {host} = properties;
    const [cookie,] = useCookies();
    //const { Option } = Select;
    const [searchedUsers,setSearchedUsers] = useState([]);
    

    const handleSearch = (values)=>{
        console.log("handle search : ",values);
        const url = `${host}/api/v1/users/search/page/0`;
        const nameArray = values.split(" ");
        let firstName;
        let lastName;
        let userName;
        if(nameArray.length > 1){
            firstName = nameArray[0];
            lastName = nameArray[1];
        }
        if(nameArray.length===1){
            firstName = nameArray[0];
            userName = nameArray[0];
        }

        console.log("username : ",userName,"////first name : ",firstName,"////last name : ",lastName);
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookie.ilyToken
            },
            body:JSON.stringify({firstName,lastName,userName})
        })
        .then(response => {
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json()})
        .then(data=>{
            //setSearchedUsers(data);
            let elements;
            elements  = data.content.map((user)=>({
              "value":user.id,
              "label":user.firstName+" "+user.lastName
            }));
            setSearchedUsers(elements);
            
        })
    }

    
    //search bar for future participants and add their ID to a an array then send them over to the backend (post -> /api/v1/conversations) as json format along with the title for the conversation

    //when you select your participants you get a new field to type the message you want to send 

    //which means you will be creating and at the same time sending a message to that conversation

    const createConversation=(values)=>{
        console.log("participant values ",values);
        const url = `${host}/api/v1/conversations`;
        const title = values.conversationTitle;
        let elements;
            elements  = values.usersIds.map((user)=>(user.value));
        const usersIds = elements;
        console.log("user ids : ",usersIds);
        
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookie.ilyToken
            },
            body:JSON.stringify({title , usersIds})
        })
        .then(response => {
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json()})
        .then(data=>{
            console.log("data after creating the conversation",data);
            message.success({content:'Added successfully', key:"adding", duration:2});
            form.resetFields();
        }).catch((err)=>{
            message.error({content:'something went wrong! try again', key:"adding", duration:2});
            //message.error(err);
        });

    }

    return (<>
    <Form {...layout} name="forum" form={form} onFinish={createConversation} autoComplete="false">
        <Form.Item
            label="create new conversation"
            name="conversationTitle"
            rules={[
                {
                    required: true,
                    message: 'Please specify title!',
                },
                ]}
        >
            <Input/>
        </Form.Item>
        <Form.Item
            name="usersIds"
            label="select users"
            rules={[
            {
                required: true,
                message: 'Please select participants!',
                type: 'array',
            },
            ]}
        >
            <Select options={searchedUsers} onInputChange={handleSearch} isMulti/>
                
        </Form.Item>
        <Form.Item>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
    </>)
}
export default FormConversation;
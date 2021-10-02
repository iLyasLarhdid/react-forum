import { useState } from "react";
import { Select,List,message,Popconfirm, Space, Menu, Button,Form, Input, Drawer } from "antd";
import properties from "../../properties";
import { useCookies } from "react-cookie";

const layout = {
    labelCol: {
        span: 24,
      },
    wrapperCol: {
      span: 12,
    },
  };

const FormConversation=()=>{
    const [form] = Form.useForm();
    const {host} = properties;
    const [cookie,] = useCookies();
    const { Option } = Select;
    const [searchedUsers,setSearchedUsers] = useState([]);

    const handleSearch = (values)=>{
        console.log("handle search : ",values);
        const url = `${host}/api/v1/users/search/page/0`;
        const nameArray = values.split(" ");
        let firstName;
        let lastName;
        let userName;
        console.log(nameArray," name array");
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
            console.log("searched users",data);
            setSearchedUsers(data);
            message.success({content:'Added successfully', key:"adding", duration:2});
            
        }).catch((err)=>{
            message.error({content:'something went wrong! try again', key:"adding", duration:2});
            //message.error(err);
        });
    }

    
    //search bar for future participants and add their ID to a an array then send them over to the backend (post -> /api/v1/conversations) as json format along with the title for the conversation

    //when you select your participants you get a new field to type the message you want to send 

    //which means you will be creating and at the same time sending a message to that conversation

    const createConversation=(values)=>{
        console.log("participant values ",values);
        const url = `${host}/api/v1/conversations`;
        const title = values.ConversationTitle;
        const usersIds = {...values.usersIds};
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
    <div>this is the form conversation{'=======>>>>'}</div>
    <Form {...layout} name="forum" form={form} onFinish={createConversation} autoComplete="false">
        <Form.Item
            label="create new conversation"
            name="conversationTitle"
        >
            <Input/>
        </Form.Item>
        <Form.Item
            name="usersIds"
            label="select users"
            rules={[
            {
                required: true,
                message: 'Please select your favourite colors!',
                type: 'array',
            },
            ]}
        >
            <Select mode="multiple" 
                placeholder="Select users you want to message"
                onSearch={handleSearch}>
            {searchedUsers && searchedUsers.content !== undefined && searchedUsers.content.map((user)=>{
                return(
                    <>
                    <Option value={user.id} key={user.id}>{user.firstName} {user.lastName}</Option>
                    </>
                )
            })}
            </Select>
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
import { useState } from "react";
import properties from "../properties";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const layout = {
    labelCol: {
        span: 24,
      },
    wrapperCol: {
      span: 24,
    },
  };

const ForgotPassword = ()=>{
    const {host} = properties;
    const url = `${host}/api/v1/users/forgotPassword`;
    const [isButtonLoading,setIsButtonLoading] = useState(false);

    const onFinish = (values) => {
            const email = values.username;
            setIsButtonLoading(true);
        fetch(url,{
            method:"post",
            headers:{"Content-Type" : "application/json"},
            body:JSON.stringify({email})
        })
        .then(response => {
            console.log(response);
            if(response.ok)
                message.success("check your email for confirmation");
            else{
                message.error("something went wrong");
            }
            setIsButtonLoading(false);
            return response.json();
        }).then(data=>{
            //console.log("data",data);
            
        }).catch((err)=>{
            console.log(err.message);
            message.success("something went wrong");
        })
          };
        
          const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
          };

    
        return (<>
            <div className="card" style={{ margin:"auto",width:"20rem"}}>
            <div className="card-header">
                <h4>Forgot password</h4>
            </div>
            <div className="card-body">
                
            <div className="container mt-2">
            <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            {...layout}
            >
            <Form.Item
                label="email"
                name="username"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />}/>
            </Form.Item>

            <Form.Item>
                {isButtonLoading ? <Button type="primary" loading disabled>Loading</Button>:<Button type="primary" htmlType="submit">confirm</Button>}
            </Form.Item>
            </Form>
            </div>  


                
            </div>
            <div className="card-footer text-muted">
            <span>you remembered ? <Link to="/">go back</Link></span>
            </div>
            </div>

            
        </>);
    
}
export default ForgotPassword;
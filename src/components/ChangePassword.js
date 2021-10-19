import { useState } from "react";
import { useHistory, useParams } from "react-router";
import properties from "../properties";
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

const layout = {
    labelCol: {
        span: 24,
      },
    wrapperCol: {
      span: 24,
    },
  };

const ChangePassword = ()=>{
    const {emailToken} = useParams();
    const {host} = properties;
    const history = useHistory();
    const url = `${host}/api/v1/users/changePassword/${emailToken}`;
    const [isButtonLoading,setIsButtonLoading] = useState(false);

    function sleep(seconds){
        return new Promise((resolve)=>setTimeout(resolve,seconds));
    }

    const onFinish = (values) => {
            const password = values.password;
            setIsButtonLoading(true);
        fetch(url,{
            method:"post",
            headers:{"Content-Type" : "application/json"},
            body:JSON.stringify({password})
        })
        .then(response => {
            console.log(response);
            if(response.ok)
                message.success("password chnaged successfully");
            else
                message.error("something went wrong");

            setIsButtonLoading(false);
            return response.json();
        }).then(data=>{
            console.log("data",data);
            sleep(1500).then(()=>{history.push("/login")});
        })
          };
        
          const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
          };

    
        return (<>
            <div className="card" style={{ margin:"auto",width:"20rem"}}>
            <div className="card-header">
                <h4>changePassword</h4>
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
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>
            <Form.Item
                label="confirm"
                name="passwordConfirmation"
                rules={[{ required: true, message: 'Please retype your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),]}
            >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
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
export default ChangePassword;
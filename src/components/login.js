import { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { UserContext } from "../hooks/UserContext";
import properties from "../properties";
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = ()=>{
    const {host} = properties;
    const url = `${host}/login`;
    const [cookie, setCookie] = useCookies([]);
    const [, setRole] = useContext(UserContext);
    const [error,setError] = useState(null);
    const [isButtonLoading,setIsButtonLoading] = useState(false);
    const history = useHistory();

    if(cookie.ilyToken)
        history.push("/");

    const onFinish = (values) => {
            const username = values.username;
            const password = values.password;
            setIsButtonLoading(true);
        fetch(url,{
            method:"post",
            headers:{"Content-Type" : "application/json"},
            body:JSON.stringify({username,password})
        })
        .then(response => {
            console.log(response);
            if(!response.ok)
                throw Error("either check your email to activate your account or your email or password incorrect");
            else{
                const accessToken = response.headers.get("accessToken");
                const refreshToken = response.headers.get("refreshToken");
                setCookie("ilyToken",accessToken,{path:"/",maxAge:86400});
                setCookie("ilyRefreshToken",refreshToken,{path:"/",maxAge:604800});
            }
            setIsButtonLoading(false);
            return response.json();
        }).then(data=>{
            //console.log("data",data);
            setCookie("principal_id",data.id,{path:"/",maxAge:86400});
            setCookie("principal_first_name",data.firstName,{path:"/",maxAge:86400});
            setCookie("principal_last_name",data.lastName,{path:"/",maxAge:86400});
            setCookie("principal_email",data.email,{path:"/",maxAge:86400});
            setCookie("principal_role",data.role,{path:"/",maxAge:86400});

            if(data.avatar!==null){
                setCookie("principal_avatar",`${host}/upload/viewFile/${data.avatar}`,{path:"/",maxAge:86400});
            }

            setRole(data.role);
            history.push("/");
        }).catch((err)=>{
            console.log(err.message);
            setError(err.message);
            setIsButtonLoading(false);
        })
          };
        
          const onFinishFailed = (errorInfo) => {
            console.log('Failed:', errorInfo);
          };

    
        return (<>
            <div className="card" style={{ margin:"auto",width:"20rem"}}>
            <div className="card-header">
                <h4>Login</h4>
            </div>
            <div className="card-body">
                
            <div className="container mt-2">
            {error && <div style={{ color:"red" }}>{error}</div>}
            <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            >
            <Form.Item
                label="email"
                name="username"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />}/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                {isButtonLoading ? <Button type="primary" loading disabled>Loading</Button>:<Button type="primary" htmlType="submit">Login</Button>}
            </Form.Item>
            </Form>
            </div>  


                
            </div>
            <div className="card-footer text-muted">
            <span>you dont have an account ? <Link to="/signup">register here</Link></span>
            </div>
            </div>

            
        </>);
    
}
export default Login;
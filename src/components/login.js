import { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { UserContext } from "../hooks/UserContext";
import properties from "../properties";
import { Button } from 'antd';

const Login = ()=>{
    const {host} = properties;
    const url = `${host}/login`;
    const [cookie, setCookie] = useCookies([]);
    const [, setRole] = useContext(UserContext);
    const [username,setUsername] = useState();
    const [password,setPassword] = useState();
    const [error,setError] = useState(null);
    const [isButtonLoading,setIsButtonLoading] = useState(false);
    const history = useHistory();

    if(cookie.ilyToken)
        history.push("/");

    const signIn = (e) => {
        e.preventDefault();
        setIsButtonLoading(true);
        fetch(url,{
            method:"post",
            headers:{"Content-Type" : "application/json"},
            body:JSON.stringify({username,password})
        })
        .then(response => {
            if(!response.ok)
                throw Error("either check your email to activate your account or your email or password incorrect");
            
            const accessToken = response.headers.get("accessToken");
            const refreshToken = response.headers.get("refreshToken");
            setCookie("ilyToken",accessToken,{path:"/",maxAge:86400});
            setCookie("ilyRefreshToken",refreshToken,{path:"/",maxAge:604800});
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
        });
    }
    
        return (
            <div className="card" style={{ margin:"auto",width:"20rem"}}>
            <div className="card-header">
                <h4>Login</h4>
            </div>
            <div className="card-body">
                
                <div className="container mt-2">
            <form onSubmit={signIn}>
            {error && <h4 className="text-danger">{error}</h4>}
            <div className="form-group mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={username} onChange={(e)=>setUsername(e.target.value)} required/>
            </div>
            <div className="form-group mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            </div>
            <div className="form-group">
                {isButtonLoading ? <Button type="primary" loading>Loading</Button>:<Button type="primary" onClick={signIn}>Login</Button>}
            </div>
            </form>
            </div>  


                
            </div>
            <div className="card-footer text-muted">
            <span>you dont have an account ? <Link to="/signup">register here</Link></span>
            </div>
            </div>
        );
    
}
export default Login;
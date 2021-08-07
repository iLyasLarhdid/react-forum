import { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { UserContext } from "../hooks/UserContext";
import properties from "../properties";

const Login = ()=>{
    const {host} = properties;
    const url = `${host}/login`;
    const [cookie, setCookie] = useCookies([]);
    const [, setRole] = useContext(UserContext);
    const [username,setUsername] = useState();
    const [password,setPassword] = useState();
    const [error,setError] = useState(null);
    const history = useHistory();

    if(cookie.ilyToken)
        history.push("/");

    const signIn = (e) => {
        e.preventDefault();
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
            return response.json();
        }).then(data=>{
            //console.log("data",data);
            setCookie("principal_id",data.id,{path:"/",maxAge:86400});
            setCookie("principal_first_name",data.firstName,{path:"/",maxAge:86400});
            setCookie("principal_last_name",data.lastName,{path:"/",maxAge:86400});
            setCookie("principal_email",data.email,{path:"/",maxAge:86400});
            setCookie("principal_avatar",`${host}/upload/viewFile/${data.avatar}`,{path:"/",maxAge:86400});
            setCookie("principal_role",data.role,{path:"/",maxAge:86400});

            setRole(data.role);
            history.push("/");
        }).catch((err)=>{
            console.log(err.message);
            setError(err.message);
        });
        
    }
    
        return (
        <div className="container mt-5">
            <form onSubmit={signIn}>
            {error && <h4 className="text-danger">{error}</h4>}
            <div className="form-group mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            </div>
            <div className="form-group mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <div className="form-group mb-3">
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
            <span>you dont have an account ? <Link to="/signup">register here</Link></span>
        </form>
        </div>  
        );
    
}
export default Login;
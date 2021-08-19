import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { UserContext } from "../hooks/UserContext";
import properties from "../properties";
import {Spin } from "antd";
const Signup = ()=>{

    const [role,] = useContext(UserContext);
    const history = useHistory();
    const {host} = properties;
    if(role)
        history.push("/");

    const url = `${host}/api/v1/users/register`;
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirm,setConfirm] = useState("");
    const [isPending,setIsPending] = useState();
    const [error,setError] = useState(null);
    const [data,setData] = useState(null);
    const [isButtonLoading,setIsButtonLoading] = useState(false);

    function sleep(seconds){
        return new Promise((resolve)=>setTimeout(resolve,seconds));
    }

    const register = (e)=>{
        setIsButtonLoading(true);
        setIsPending(true);
        e.preventDefault();
        if(password===confirm){
        fetch(url , {
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({firstName,lastName,email,password})
        }).then(response=>{
            if(!response.ok){ throw Error("something went wrong")}
            setIsButtonLoading(false);
            return response.json()})
            .then(data=>{
                setData(data);
                setIsPending(false);
                setError(null);
                sleep(1500).then(()=>{history.push("/login")});
            }).catch((err)=>{
                setIsPending(false);
                setError(err.message);
            })
        }
        else
            setError("Mmmmm seriously!! did you just try to change disabled through inspect to see what happens")
    }

    return (
        <div className="card" style={{ margin:"auto", width:"30rem"}}>
            <div className="card-header">
                <h4>Sign Up</h4>
            </div>
            <div className="card-body">
                

                
            <div className="container">
                {data ? <h3 className="text-success">done</h3>:""}
                {isPending && error ==null ? <h3 className="text-info">loading...</h3>:""}
                {isPending && error ==null ? <Spin></Spin>:""}
                {error!==null ? <h3 className="text-danger">{error}</h3>:""}
            <form  onSubmit={register}>
            <div className="row g-2">
                <div className="form-group mb-3 col-md">
                    <label className="control-label" htmlFor="firstName">first name</label>
                    <input id="firstName" className="form-control" required autoFocus="autofocus" name="firstName" value={firstName} onChange={e=>setFirstName(e.target.value)}/>
                </div>

                <div className="form-group mb-3 col-md">
                    <label className="control-label" htmlFor="lastName">last name</label>
                    <input id="lastName" className="form-control" required autoFocus="autofocus" name="lastName" value={lastName} onChange={e=>setLastName(e.target.value)}/>
                </div>

                <div className="form-group mb-3">
                    <label className="control-label" htmlFor="email">email</label>
                    <input id="email" className="form-control" required autoFocus="autofocus" name="email" value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>

                <div className="form-group mb-3">
                    <label className="control-label" htmlFor="password">password</label>
                    <input type="password" id="password" className="form-control" required autoFocus="autofocus" name="password" value={password} onChange={e=>setPassword(e.target.value)}/>
                </div>

                <div className="form-group mb-3">
                    <label className="control-label" htmlFor="confirm">confirm password</label>
                    <input type="password" required id="confirm" className="form-control" autoFocus="autofocus" name="confirm" value={confirm} onChange={e=>setConfirm(e.target.value)}/>
                    {password!==confirm && confirm?<span className="text-danger">incorrect</span>:""}
                </div>

                <div className="form-group mb-2">
                    {password===confirm 
                    ? 
                        <button type="submit" className="btn btn-primary">{isButtonLoading ? <Spin>loading..</Spin>:"registered"}</button>
                    :
                        <button disabled type="submit" className="btn btn-success">registered</button>}
                        
                </div>
            </div>
            </form>
            </div>



            </div>
            <div className="card-footer text-muted">
                <span>Already registered? <Link to="/login">login here</Link></span>
            </div>
        </div>
    )

}
export default Signup;
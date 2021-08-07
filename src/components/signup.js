import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { UserContext } from "../hooks/UserContext";
import properties from "../properties";
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

    function sleep(seconds){
        return new Promise((resolve)=>setTimeout(resolve,seconds));
    }

    const register = (e)=>{
        setIsPending(true);
        e.preventDefault();
        fetch(url , {
            method:"POST",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({firstName,lastName,email,password})
        }).then(response=>{
            if(!response.ok){ throw Error("something went wrong")}
            return response.json()})
            .then(data=>{
                console.log(data);
                setData(data);
                setIsPending(false);
                setError(null);
                sleep(1500).then(()=>{history.push("/login")});
            }).catch((err)=>{
                setIsPending(false);
                setError(err.message);
            })
    }

    return (
            <div className="container">
                <h1>Sing up</h1>
                {data ? <h3 className="text-success">done</h3>:""}
                {isPending ? <h3 className="text-info">loading...</h3>:""}
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
                    {password===confirm ? <button type="submit" className="btn btn-success">registered</button>:<button disabled type="submit" className="btn btn-success">registered</button>}
                </div>
                <span>Already registered? <Link to="/login">login here</Link></span>
            </div>
            </form>
            </div>
    )

}
export default Signup;
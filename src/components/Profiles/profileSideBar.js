import Avatar from "antd/lib/avatar/avatar";
import { Badge } from 'antd';
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import properties from "../../properties";
import { useCookies } from "react-cookie";

const {host} = properties;
//const url = `${host}/api/v1/users/page/0`;
const fetchData = async (key)=>{
    const page = key.queryKey[1];
    const token = key.queryKey[2];
    const res = await fetch(`${host}/api/v1/users/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}
const ProfileSideBar = ()=>{
    const [cookies] = useCookies([]);
    let token = "";
        //className="col-lg-4 col-xl-3" for previous div
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;

    const {data,isLoading} = useQuery(['page',0,token],fetchData,{keepPreviousData:true});
    console.log(data);
    return(
    <>
    <div className="container" style={{ background:"#edeff0", borderRadius:"10px", padding:"1rem",marginBottom:"1rem", marginTop:"1rem"}}>
    {/* show friends but for now i will show all users */}
    {isLoading && <div>loadning....</div>}
    {data && 
        data.content.map((user)=>{
            return (<div><Badge status="success"><Avatar>{user.firstName}</Avatar></Badge> <b><Link to={`/profile/${user.id}`}>{user.firstName} {user.lastName}</Link></b> </div>)
        })
    }
    </div>
    </>
    );
}
export default ProfileSideBar;
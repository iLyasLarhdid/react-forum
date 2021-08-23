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
        
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;

    const {data,isLoading} = useQuery(['page',0,token],fetchData,{keepPreviousData:true})
    console.log("my dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    console.log(data);
    return(
    <>
    {/* show friends but for now i will show all users */}
    {isLoading && <div>loadning....</div>}
    {data && 
        data.content.map((user)=>{
            return (<div><b><Link to={`/profile/${user.id}`}>{user.firstName} {user.lastName}</Link></b> <Badge status="success"><Avatar>IS</Avatar></Badge></div>)
        })
    }
    </>
    );
}
export default ProfileSideBar;
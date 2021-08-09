import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import properties from "../../properties";
const {host} = properties;

const fetchData = async (key)=>{
    const forumId = key.queryKey[1];
    const res = await fetch(`${host}/api/v1/forums/id/${forumId}`)
    return res.json();
}

const ProfileDetails = ({profileData})=>{
    const [cookies,] = useCookies();


    const {data,isLoading} = useQuery(['forumId',profileData],fetchData,{keepPreviousData:false})

    console.log(data);
    console.log(isLoading);

    console.log("inside profile details and the data is :",profileData);
    return(<div className="container">
    <div className="row">
        
        {cookies.principal_avatar?<span className="col-6">
            <img src={cookies.principal_avatar} className="img-thumbnail"  width="300px" alt="avatar"/>
        </span>:<></>}
        <div  className="container col-6">
            <div>{profileData.id}</div><div>{profileData.firstName}</div>
            <div>{profileData.email}</div>
        </div>

        <div>here we show all the posts for this user // with the possibility to update fields </div>
    </div>
    </div>)
}   

export default ProfileDetails;
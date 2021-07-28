import { useCookies } from "react-cookie";
const ProfileDetails = ({profileData})=>{
    const [cookies,] = useCookies();
    console.log("inside profile details and the data is :",profileData);
    return(<div className="container">
    <div className="row">
        
        <span className="col-6"><img src={cookies.principal_avatar} className="img-thumbnail"  width="300px" alt="avatar"/></span>
        <div  className="container col-6"><div>{profileData.id}</div><div>{profileData.firstName}</div><div>{profileData.email}</div></div>

        <div>here we show all the posts for this user // with the possibility to update fields </div>
    </div>
    </div>)
}   

export default ProfileDetails;
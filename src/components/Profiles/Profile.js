import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import ProfileDetails from "./ProfileDetails";

const Profile = ()=>{
    const {id} = useParams();
    const {host} = properties;
    const url = `${host}/api/v1/users/id/${id}`;
    const [data,isPending]= useFetch(url);
    //todo here we sould display the profile of users based on their id
    //1-check if the id is for the principal if it is show more informations and the ability to update if not show the informations the user set to public (if you want to implement that otherwise just show all inforamtions)
    //2-give the ability to set the avatar.
    //3- after updating the avatar we update the cookie so it displays the updated updated picture

    return (
    <div className="forums-container">
        <h2>profile</h2>
        {isPending? <div>loading.....</div>:<></>}
        {data?<ProfileDetails profile={data}/>:<></>}
    </div>);
}
export default Profile;
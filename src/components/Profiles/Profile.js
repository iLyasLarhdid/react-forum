import { useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";
import ProfileDetails from "./ProfileDetails";

const Profile = ()=>{
    const {id} = useParams();
    const {host} = properties;
    const url = `${host}/api/v1/users/id/${id}`;
    const [data,isPending]= useFetch(url);
    const [file, setFile] = useState(null);
    const [cookies,SetCookies] = useCookies();
    const uploadFile = (e)=>{
        e.preventDefault();
        console.log(file);
        const formData = new FormData();
        formData.append("file",file);
        const url = `${host}/upload`;
        fetch(url,{
            method:"post",
            headers: {
                'Authorization': cookies.cyberpunk
            },
            body:formData
        })
        .then(response => response.json().then(data=>{
            console.log(data);
            SetCookies("principal_avatar",data.fileUri);
            //const index = JSON.stringify(data);
        }));
    }
    console.log(data);
    //todo here we sould display the profile of users based on their id
    //1-check if the id is for the principal if it is show more informations and the ability to update if not show the informations the user set to public (if you want to implement that otherwise just show all inforamtions)
    //2-give the ability to set the avatar.
    //3- after updating the avatar we update the cookie so it displays the updated updated picture

    return (
    <div className="forums-container">
        <h2>profile</h2>
        <form onSubmit={uploadFile}>
            <input type="file" name="inpFile" onChange={(e)=>{setFile(e.target.files[0])}}/>
            <button type="submit">upload</button>
        </form>
        {isPending? <div>loading.....</div>:<></>}
        {data?<ProfileDetails profileData={data}/>:<></>}
    </div>);
}
export default Profile;
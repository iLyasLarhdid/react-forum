import properties from "../../properties";
const {host} = properties;

const ProfileDetails = ({profileData})=>{

    console.log("inside profile details and the data is :",profileData);
    return(<div className="container">
    <div className="row">
        
        <span className="col-6">
            {profileData.avatar ? 
                <img src={`${host}/upload/viewFile/${profileData.avatar}`} width="250" alt="avatar"/>
            :
                <img src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" width="250" alt="avatar"/>
                            }
        </span>
        <div  className="container col-6">
            <div>{profileData.id}</div><div>{profileData.firstName}</div>
            <div>{profileData.email}</div>
        </div>

        <div>here we show all the posts for this user // with the possibility to update fields </div>
    </div>
    </div>)
}   

export default ProfileDetails;
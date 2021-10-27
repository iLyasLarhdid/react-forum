import { useState } from "react";
import { useCookies } from "react-cookie";
import properties from "../../properties";
import { Button,message } from 'antd';
import { useQuery } from "react-query";

const {host} = properties;

const fetchData = async (key)=>{
    const token = key.queryKey[1];
    const id = key.queryKey[2];
    const res = await fetch(`${host}/api/v1/friendships/userId/${id}/isFriend`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } );
    return res.json();
}

const AddFriend = ({profileData})=>{
    const [isRequested, setIsRequested] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [showUploadField,setShowUploadField] = useState(false);
    const [cookie,setCookie] = useCookies([]);

    const {data,isLoading,error} = useQuery(['forums',cookie.ilyToken,profileData.id],fetchData,{keepPreviousData:true});

    console.log("my friends are ",data);

    const addFriend = ()=>{
        // add user with the this profileData.id
        message.loading('Adding friend....',"addingFriend");
        const url = `${host}/api/v1/friendships`;
        const receiverId = profileData.id;
        console.log("profile data dot id is ",profileData.id);
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookie.ilyToken
            },
            body:JSON.stringify({receiverId})
        })
        .then(response =>{ 
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json();
        }).then(data=>{
            console.log("adding friend=>");
            console.log(data);
            setIsRequested(true);
            message.success({content:'added successfully', key:"addingFriend", duration:2});
        }).catch(err=>{
            console.log("err ",err);
            message.error({content:"something went wrong", key:"addingFriend", duration:2});
        });
    }

    const removeRequest = ()=>{
        // add user with the this profileData.id
        message.loading('deleting request....',"addingFriend");
        const url = `${host}/api/v1/friendships/deleteRequest/id/${profileData.id}`;
        const id = data.id;
        console.log("profile data dot id is ",profileData.id);
        fetch(url,{
            method:"delete",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookie.ilyToken
            },
            body:JSON.stringify({id})
        })
        .then(response =>{ 
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json();
        }).then(data=>{
            console.log("adding friend=>");
            console.log(data);
            setIsRequested(false);
            message.success({content:'deleted successfully', key:"addingFriend", duration:2});
        }).catch(err=>{
            console.log("err ",err);
            message.error({content:"something went wrong", key:"addingFriend", duration:2});
        });
    }

    const acceptRequest = ()=>{
        message.loading('accepting request....',"addingFriend");
        const id = data.id;
        const url = `${host}/api/v1/friendships/acceptFriendRequest/id/${id}`;
        
        console.log("profile data dot id is ",profileData.id);
        fetch(url,{
            method:"put",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookie.ilyToken
            }
        })
        .then(response =>{ 
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json();
        }).then(data=>{
            console.log("adding friend=>");
            console.log(data);
            setIsRequested(false);
            message.success({content:'accepted successfully', key:"addingFriend", duration:2});
        }).catch(err=>{
            console.log("err ",err);
            message.error({content:"something went wrong", key:"addingFriend", duration:2});
        });
    }

    return (<>
        <div>
            {profileData.id !== cookie.principal_id && data && data.accepted === undefined && !isRequested &&
            <Button type="link" onClick={()=>addFriend()}>Add Friend</Button>}
        </div>
        <div>
            {profileData.id !== cookie.principal_id 
            && data 
            && data.accepted === false 
            && data.sender.id === cookie.principal_id
            &&<Button type="link" onClick={()=>removeRequest()}>Remove request</Button>}
        </div>
        <div>
            {profileData.id !== cookie.principal_id 
            && data
            && data.accepted === false 
            && data.receiver.id === cookie.principal_id
            &&<Button type="link" onClick={()=>acceptRequest()}>Accept request</Button>}
        </div>
        <div>
            {profileData.id !== cookie.principal_id 
            && data
            && data.accepted === true 
            &&<Button type="link" onClick={()=>removeRequest()}>Remove friend</Button>}
        </div>
    </>)
}

export default AddFriend;
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import properties from "../../properties";
import { Button,message, Skeleton } from 'antd';
import { useInfiniteQuery } from "react-query";
import { Link } from "react-router-dom";

const {host} = properties;
const fetchData = async (key)=>{
    const page = key.queryKey[1];
    const token = key.queryKey[2];
    const getFriendRequests = key.queryKey[3];
    const res = await fetch(`${host}/api/v1/friendships/${getFriendRequests}/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } );
    return res.json();
}

const FriendRequest =()=>{
    const [cookie,] = useCookies([]);
    const [isSentFriendRequests, setIsSentFriendrequests] = useState(false);
    const [getFriendRequests, setGetFriendRequests] = useState("upcomingFriendRequests");
    let token ;
    if(cookie.ilyToken)
        token = cookie.ilyToken;
    //else return to login

    useEffect(()=>{

        if(isSentFriendRequests){
            setGetFriendRequests("unAcceptedRequests");
        }
        else 
            setGetFriendRequests("upcomingFriendRequests");
    },[isSentFriendRequests,setGetFriendRequests]);

    const {
        data,
        isLoading
      } = useInfiniteQuery(['posts',0,token,getFriendRequests], fetchData, {
        getNextPageParam: (lastPage, pages) => {
            console.log(pages);
            console.log("next page number : ",lastPage);        
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      });

      function removeRequest(id){
        // add user with the this profileData.id
        message.loading('deleting request....',"addingFriend");
        const url = `${host}/api/v1/friendships/deleteRequest/id/${id}`;
        console.log("profile data dot id is ",id);
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
            message.success({content:'deleted successfully', key:"addingFriend", duration:2});
        }).catch(err=>{
            console.log("err ",err);
            message.error({content:"something went wrong", key:"addingFriend", duration:2});
        });
    }

    function acceptRequest(id){
        message.loading('accepting request....',"addingFriend");
        const url = `${host}/api/v1/friendships/acceptFriendRequest/id/${id}`;
        
        console.log("profile data dot id is ",id);
        fetch(url,{
            method:"put",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': token
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
            message.success({content:'accepted successfully', key:"addingFriend", duration:2});
        }).catch(err=>{
            console.log("err ",err);
            message.error({content:"something went wrong", key:"addingFriend", duration:2});
        });
    } 

    console.log("my friend requests are ",data);

    return(<>
        <div className="container">
            <h3>Friend requests</h3>
            {isLoading && <><Skeleton/><Skeleton/></>}
            <Link to={`/friends/${cookie.principal_id}`} style={{ margin:'1emp' }}><Button type="primary">see friends</Button></Link>
            {isSentFriendRequests && <Button onClick={()=>setIsSentFriendrequests(false)}>see upcoming friend requets</Button>}
            {!isSentFriendRequests && <Button onClick={()=>setIsSentFriendrequests(true)}>See sent Friend requests</Button>}
            
            {data && data.pages.map((page)=>{
                return page.content.map((friendRequest)=>{
                    return (<>
                        <div>{friendRequest.id} {isSentFriendRequests 
                        ? 
                        <Button type="primary" onClick={()=>removeRequest(friendRequest.id)}>remove</Button> 
                        :
                        <><Button type="primary" onClick={()=>acceptRequest(friendRequest.id)}>accept</Button> 
                        <Button type="danger" onClick={()=>removeRequest(friendRequest.id)}>remove</Button></>
                        }</div>
                    </>)
                })
            })}
        </div>
    </>)

}

export default FriendRequest;
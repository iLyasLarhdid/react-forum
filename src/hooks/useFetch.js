import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import properties from "../properties";

const useFetch = (url) =>{
    const history = useHistory();
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [cookies,setCookie] = useCookies([]);
    const {host} = properties;
    
    let token = "";
    let refreshToken="";
    
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;
    if(cookies.ilyRefreshToken != null)
        refreshToken = cookies.ilyRefreshToken;
   
    useEffect(()=>{
        fetch(url,
            {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': token
                }
            }   
        )
        .then(response => {
            if(response.status === 403){
                response.json().then(data=>{
                    console.log(data.error);
                    if(data.error==="Forbidden".toLowerCase)
                        return history.push('/logout');
                    if(data.error.startsWith("The Token has expired")){
                        fetch(`${host}/api/v1/users/refresh`,{
                            headers: {
                                'Content-Type' : 'application/json',
                                'Authorization': refreshToken
                            }
                        } ).then(response=>{
                            const accessToken = response.headers.get("accessToken");
                            const refreshToken = response.headers.get("refreshToken");
                            setCookie("ilyToken",accessToken,{path:"/",maxAge:86400});
                            setCookie("ilyRefreshToken",refreshToken,{path:"/",maxAge:604800});
                            window.location.reload();
                            //history.goBack();
                            return response.json();
                        }).then(data=>{
                            console.log(data);
                        });
                        console.log("hello");
                    }
                });
            }
            if(!response.ok){
                throw Error("couldn't get data");
            }
            return response.json()})
            .then(data => {
                //console.log("for : "+url+" : "+data)
                setData(data);
                setIsPending(false);
                setError(null);
            }).catch((err)=>{
                setIsPending(false);
                setError(err.message);
            })}
            ,[url,token,history,host,refreshToken,setCookie]);

    //we use this empty erray [] to depend on so that useEffect can only be fired once, or when the empty array changes(which is wont happen)
    
    return [data,isPending,error]
}
export default useFetch;
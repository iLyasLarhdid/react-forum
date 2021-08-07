import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";

const useFetch = (url) =>{
    const history = useHistory();
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const [cookies] = useCookies([]);
    
    let token = "";
    
    if(cookies.ilyToken != null)
        token = cookies.ilyToken;
   
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
                history.push("/logout");
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
                console.log("token = ",token);
            }).catch((err)=>{
                setIsPending(false);
                setError(err.message);
            })}
            ,[url,token,history]);

    //we use this empty erray [] to depend on so that useEffect can only be fired once, or when the empty array changes(which is wont happen)
    
    return [data,isPending,error]
}
export default useFetch;
import { useHistory } from 'react-router';
//import ForumList from './components/Fourms/ForumList';
import properties from './properties';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { Skeleton } from 'antd';
import React, {useState, Suspense, lazy} from 'react';
const {host} = properties;
const ForumList = lazy(()=>import ('./components/Fourms/ForumList'));
const Pagination = lazy(()=>import ('antd').then(mod=>({default:mod.Pagination})));

const fetchData = async (key)=>{
    const page = key.queryKey[1];
    const token = key.queryKey[2];
    const res = await fetch(`${host}/api/v1/forums/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } );
    
    console.log(res);
    //for infinite scrolling instead of returning just the data that we have got from the back end we should return the oldData+newdata so that we dont lose old data
    return res.json();
}

const Home = ()=>{
    const history = useHistory();
    const [cookie,setCookie] = useCookies([]);
    const [pageNumber, setPageNumber] = useState(0);

    if(!cookie.ilyToken || cookie.ilyToken===null || !cookie.ilyToken.startsWith("Bearer "))
        history.push("/logout");

    const changePage = (page)=>{
        setPageNumber(page-1)
    }
    const {data,isLoading,error} = useQuery(['forums',pageNumber,cookie.ilyToken],fetchData,{keepPreviousData:true});

    console.log(data);
    if(data && data.error !== undefined){
            console.log("===========>"+data.error);
            if(data.error==="Forbidden"){
                console.log("push logout");
                history.push('/logout');
            }
            if(data.error.startsWith("The Token has expired")){
                console.log("refresh");
                console.log(cookie);
                fetch(`${host}/api/v1/users/refresh`,{
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization': cookie.ilyRefreshToken
                    }
                } ).then(response=>{
                    const accessToken = response.headers.get("accessToken");
                    const refreshToken = response.headers.get("refreshToken");
                    console.log("access"+accessToken);
                    setCookie("ilyToken",accessToken,{path:"/",maxAge:604800});
                    setCookie("ilyRefreshToken",refreshToken,{path:"/",maxAge:604800});
                    window.location.reload();
                    //history.push('/login');
                    //return response.json();
                }).then(data=>{
                    console.log(data);
                });
                console.log("hello");
            };
    }
    

    return (
        <div className="container">
            
            {error && <div>{error}</div>}
            <div>{isLoading && 
                <><Skeleton active/>
                <Skeleton active/>
                <Skeleton active/></>}</div>
            {data && data.error === undefined &&
                <Suspense fallback={<div><Skeleton/></div>}>
                    <ForumList forumData={data.content}/>
                </Suspense>}

            {data && data.error === undefined &&
            <Suspense fallback={<div><Skeleton/></div>}>
                <Pagination pageSize={data.size} defaultCurrent={data.number+1} total={data.totalElements} onChange={changePage} style={{paddingBottom:"2rem"}}/>
            </Suspense>}

        </div>
    );
}
export default React.memo(Home);
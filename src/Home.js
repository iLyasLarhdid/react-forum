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
    const res = await fetch(`${host}/api/v1/forums/page/${page}`);
    //for infinite scrolling instead of returning just the data that we have got from the back end we should return the oldData+newdata so that we dont lose old data
    return res.json();
}

const Home = ()=>{
    const history = useHistory();
    const [cookie,] = useCookies([]);
    const [pageNumber, setPageNumber] = useState(0);

    if(!cookie.ilyToken)
        history.push("/login");

    const changePage = (page)=>{
        setPageNumber(page-1)
    }
    const {data,isLoading,error} = useQuery(['forums',pageNumber],fetchData,{keepPreviousData:true});

    console.log(data);
    return (
        <div className="container">
            
            {error && <div>{error}</div>}
            <div>{isLoading && 
                <><Skeleton active/>
                <Skeleton active/>
                <Skeleton active/></>}</div>
            {data && 
                <Suspense fallback={<div><Skeleton/></div>}>
                    <ForumList forumData={data.content}/>
                </Suspense>}

            {data && 
            <Suspense fallback={<div><Skeleton/></div>}>
                <Pagination pageSize={data.size} defaultCurrent={data.number+1} total={data.totalElements} onChange={changePage} style={{paddingBottom:"2rem"}}/>
            </Suspense>}

        </div>
    );
}
export default React.memo(Home);
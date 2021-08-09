import { useHistory } from 'react-router';
import ForumList from './components/Fourms/ForumList';
import properties from './properties';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { useState } from 'react';
import { Pagination, Skeleton } from 'antd';
const {host} = properties;

const fetchData = async (key)=>{
    const page = key.queryKey[1];
    const res = await fetch(`${host}/api/v1/forums/page/${page}`)
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
    const {data,isLoading,error} = useQuery(['forums',pageNumber],fetchData,{keepPreviousData:true})

    console.log(data);
    return (
        <div className="container">
            
            {error && <div>{error}</div>}
            <div>{isLoading && <><Skeleton active/><Skeleton active/><Skeleton active/></>}</div>
            {data && <ForumList forumData={data.content}/>}

            {data && <Pagination pageSize={data.size} defaultCurrent={data.number+1} total={data.totalElements} onChange={changePage} style={{paddingBottom:"2rem"}}/>}

        </div>
    );
}
export default Home;
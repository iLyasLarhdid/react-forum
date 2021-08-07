import { useHistory } from 'react-router';
import ForumList from './components/Fourms/ForumList';
import properties from './properties';
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
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
    const queryClient = useQueryClient()

    if(!cookie.ilyToken)
        history.push("/login");

    const {data,isLoading,error,status} = useQuery(['forums',pageNumber],fetchData,{keepPreviousData:false})

    return (
        <div className="container">
            <nav aria-label="Page navigation example">
            <ul class="pagination">
                    <li className="page-item">
                        <button className="page-link">Previous</button>
                    </li>
                    <li className="page-item" onClick={()=>{setPageNumber(0);queryClient.removeQueries("forums")}}>
                        <button className="page-link">1</button>
                    </li>
                    <li className="page-item" onClick={()=>{setPageNumber(1);queryClient.removeQueries("forums")}}>
                        <button className="page-link">2</button>
                    </li>
                    <li className="page-item" onClick={()=>setPageNumber(4)}>
                        <button className="page-link">Next</button>
                    </li>
                </ul>
            </nav>
            {error && <div>{error}</div>}
            {isLoading && <div>loading ...</div>}
            {data && <ForumList forumData={data.content}/>}
        </div>
    );
}
export default Home;
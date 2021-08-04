import { useHistory } from 'react-router';
import ForumList from './components/Fourms/ForumList';
import useFetch from './hooks/useFetch';
import properties from './properties';
import { useCookies } from 'react-cookie';
const Home = ()=>{
    const history = useHistory();
    const {host} = properties;
    const [cookie,] = useCookies([]);

    if(!cookie.cyberpunk)
        history.push("/login");

    const url = `${host}/api/v1/forums`;
    const {data,isPending,error} = useFetch(url);
    
    return (
        <div className="container">
            {error && <div>{error}</div>}
            {isPending && <div>loading ...</div>}
            {data && <ForumList forumData={data}/>}
        </div>
    );
}
export default Home;
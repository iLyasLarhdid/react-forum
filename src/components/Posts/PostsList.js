import { useParams } from "react-router";
import Posts from "./Posts";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";

const ForumDetails = () =>{
    const {id} = useParams();
    const {host} = properties;
    const url = `http://${host}/api/v1/posts/forum/id/${id}`;
    const {data,isPending} = useFetch(url);
    return (
    <div className="container">
        <div>{isPending && <div>loading ...</div>}</div>
        <div>{data && <Posts postsData={data}/>}</div>
    </div>)
}
export default ForumDetails;
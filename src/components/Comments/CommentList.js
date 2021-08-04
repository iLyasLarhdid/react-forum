import { useParams } from "react-router";
import Comments from "./Comments";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";

const CommentList = ()=>{

    const {id} = useParams();
    const {host} = properties;
    const url = `${host}/api/v1/comments/post/id/${id}`;
    const {data,isPending,error} = useFetch(url);
    console.log(data);

    return (
        <div className="container">
        <div>{error && <div>{error}</div>}</div>
        <div>{isPending && <div>loading ...</div>}</div>
        <div>{data && <Comments commentsData={data}/>}</div>
        </div>
    );
}
export default CommentList;
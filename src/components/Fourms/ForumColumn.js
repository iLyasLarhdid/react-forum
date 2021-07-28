import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import properties from "../../properties";

const ForumColumn = ({forum})=>{
    const {host} = properties;
    const url = `http://${host}/api/v1/forums/id/${forum.id}/numberOfPostsAndComments`;
    const {data,isPending} = useFetch(url);
    
    return (<>
            <td>
                <b className="h6"><Link to={`/forums/${forum.id}`} className="text-success">{forum.title}</Link></b>
            </td>
            <td>
                {forum.content}
            </td>
            <td>
                {isPending && <>loading ...</>}
                {data && <>{data[1]}</>}
            </td>
            <td>
                {isPending && <>loading ...</>}
                {data && <>{data[0]}</>}
            </td>
        </>)
}
export default ForumColumn;
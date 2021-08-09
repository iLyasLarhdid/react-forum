import useFetch from "../../hooks/useFetch";
import properties from "../../properties";

const ForumColumn = ({forum})=>{
    const {host} = properties;
    const url = `${host}/api/v1/forums/id/${forum.id}/numberOfPostsAndComments`;
    const [data,isPending] = useFetch(url);
    console.log(data +" / "+isPending);
    return (<div>
        
            </div>)
}
export default ForumColumn;
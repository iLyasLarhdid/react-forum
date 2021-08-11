import useFetch from "../../hooks/useFetch";
import properties from "../../properties";

function writeNumber(number){
    if(number === null)
        return 0;
    if(number>=1000000000000)
        return number/1000000000000+"T";
    if(number>=1000000000)
        return number/1000000000+"B";
    if(number>=1000000)
        return number/1000000+"M";
    if(number>=1000)
        return number/1000+"K";  
    
    return number;
}

const ForumColumn = ({forumId})=>{
    const {host} = properties;
    const url = `${host}/api/v1/forums/id/${forumId}/numberOfPostsAndComments`;
    const [data,isPending] = useFetch(url);
    console.log(data +" / "+isPending);
    return (<>{data && writeNumber(data[1])}</>)
}
export default ForumColumn;
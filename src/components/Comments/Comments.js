import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router";
import { UserContext } from "../../hooks/UserContext";
import { Link } from "react-router-dom";
import properties from "../../properties";

const Comments =({commentsData})=>{
    const {id} = useParams();
    const postId=id;
    let [doCommentsExist,setDoCommentsExist] = useState(false);

    const [comments, setComments] = useState(commentsData);
    const [role,] = useContext(UserContext);
    const [comment, setComment] = useState("");
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const history = useHistory();
    const {host} = properties;

    useEffect(()=>{
        if(comments.length === 0)
            setDoCommentsExist(false);
        else
            setDoCommentsExist(true);
    },[comments,commentsData]);

    if(!role)
        history.push("/login");
    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    //adding new comment
    const addComment = (e)=>{
        e.preventDefault();
        const url = `${host}/api/v1/comments`
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({comment,postId,userId})
        })
        .then(response => response.json().then(data=>{
            //const index = JSON.stringify(data);
            setComments([...comments,data]);
            setComment("");
        }));
    }

    return (
        <div className="forums-container">
        <h2>Comments</h2>
        <div>{!doCommentsExist && <>no comments for this forum yet</>}</div>
        {doCommentsExist && <div><h4> forum : {comments[0].post.forum.content}</h4><h5>post : {comments[0].post.content}</h5></div>}
        <table className="table table-responsive table-hover table-bordered table-striped">
            <thead>
            <tr>
                <th>avatar</th>
                <th>title</th>
                <th>posted by</th>
                <th>role</th>
                <th>posted</th>
            </tr>
            </thead>
            <tbody>
            <>{doCommentsExist && 
                <>
                {comments.map((comment)=>{
                    return (
                    <tr key={comment.id}>
                        <td name={comment.user.avatar}><img src={`${host}/viewFile/${comment.user.avatar}`} width="50" alt="avatar"/></td>
                        <td>{comment.comment}</td>
                        <td><Link to={`/profile/${comment.user.id}`}>{comment.user.firstName}</Link></td>
                        <td>{comment.user.role}</td>
                        <td>{comment.commentDate}</td>
                    </tr>
                    )
                })}
                </>
            }</>
            </tbody>

        </table>
        
        {/* form for leaving messages */}
        {role==="ADMIN" ? <>

            <button className="btn btn-outline-success mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#addComment" aria-expanded="false" aria-controls="addComment" onClick={()=>{sleep(300).then(()=>{window.scrollTo(0,document.body.scrollHeight)})}}>Comment</button>

            <form className="collapse multi-collapse" id="addComment" onSubmit={addComment}>
            <div className="row g-2">
                <div className="col-md-7">
                    <textarea minLength="10" required className="form-control" id="comment" placeholder="content" value={comment} onChange={(e)=>setComment(e.target.value)} rows="5" maxLength="255"></textarea>
                </div>
                <div>
                    <button className="btn btn-success mb-5" type="submit">submit</button>
                </div>            
            </div>
            </form>
            </>:""}
    </div>
    );
}
export default Comments;
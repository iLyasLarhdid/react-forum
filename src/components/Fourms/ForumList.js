import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { UserContext } from "../../hooks/UserContext";
import properties from "../../properties";
import ForumColumn from "./ForumColumn";

const ForumList = ({forumData}) =>{
    const [forums,setForums] =  useState(forumData);
    const [role,] = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [cookies,] = useCookies([]);
    const userId = cookies.principal_id;
    const [doForumsExist,setDoForumsExist] = useState(false);
    const {host} = properties;

    useEffect(()=>{
        if(forums.length === 0)
            setDoForumsExist(false);
        else
            setDoForumsExist(true);
    },[forums,forumData]);

    // sleep time expects milliseconds
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    //filling the state variables for edit
    const fillStateVariables = (e)=>{
        const docOfRow=document.querySelector("#row"+e.target.value);
        let row = null;
        if(docOfRow){
            row = docOfRow.children;
            //console.log(row);
            setTitle(row[0].innerText);
            setContent(row[1].innerText);
        }
        
    }
    //update forum
    const updateForum = (e)=>{
        e.preventDefault();
        const id = e.target.name;
        document.querySelector("#updateForum"+id).click();
        console.log(id);
        if(title.length < 5||content.length < 10)
            return;
        const url = `${host}/api/v1/forums`;
        fetch(url,{
            method:"put",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({id,title,content,userId})
        })
        .then(response => response.json()
        .then(data=>{
            console.log(data);
            setForums([...forums,data])
            let updatedForums = forums.map((forum)=>{
                if(forum.id !== data.id)
                    return forum;
                return  data;
            });
            console.log(updatedForums);
            setForums(updatedForums);
            setTitle("");
            setContent("");
        }));

    }
    //delete forum 
    const deleteForum = (e)=>{
        //console.log(e.target.value);
        const url = `${host}/api/v1/forums/id/${e.target.value}`;
        fetch(url,{
            method:"delete",
            headers: {
                'Authorization': cookies.ilyToken
            }
        })
        .then(response => {
            document.querySelector("#row"+e.target.value).remove();
            return response});
    }
    //adding forum 
    const addForum = (e)=>{
        e.preventDefault();
        console.log("title : "+title+" content : "+content + " user : "+ userId);
        if(title.length < 5||content.length < 10)
            return;
        const url = `${host}/api/v1/forums`;
        fetch(url,{
            method:"post",
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': cookies.ilyToken
            },
            body:JSON.stringify({title,content,userId})
        })
        .then(response => response.json().then(data=>{
            console.log(data);
            setForums([...forums,data]);
            setTitle("");
            setContent("");
        }));
    }
    return (
        <div className="forums-container">
            <h2>Forums</h2>
            <table className="table table-responsive table-hover table-striped table-bordered">
                <thead>
                <tr>
                    <th>title</th>
                    <th className="w-50">content</th>
                    <th>posts</th>
                    <th>comments</th>
                    {role==="ADMIN" ? <th>actions</th> :""}
                </tr>
                </thead>
                <tbody>
                {doForumsExist && forums.map((forum)=>{ 
                    return (
                        <tr className="forums-details" key={forum.id} id={"row"+forum.id}>
                        <ForumColumn forum={forum}/>
                        {role==="ADMIN" ? 
                        <td>
                        <button className="btn btn-danger me-2 mb-1 w-100" value={forum.id} onClick={deleteForum}>Delete</button>
                        <button className="btn btn-success w-100" data-bs-toggle="modal" data-bs-target={"#updateForum"+forum.id} value={forum.id} onClick={fillStateVariables}>Edit</button>
                        {/* modal for uodating the forum                     */}
                        <form onSubmit={updateForum} name={forum.id}>
                        <div className="modal fade" id={"updateForum"+forum.id} tabIndex="-1" aria-labelledby="updateForumLable" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateForumLable">Edit forum {forum.id}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/* form in my body */}
                                <div className="row g-2">
                                    <div>
                                        <div className="form-floating">
                                        <input type="text" required minLength="5" className="form-control" id="title" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                                        <label htmlFor="title">Title</label>
                                        </div>
                                    </div>
                                    <div>
                                        <textarea minLength="10" required className="form-control" id="content" placeholder="content" value={content} onChange={(e)=>setContent(e.target.value)} rows="5" maxLength="255"></textarea>
                                    </div>  
                                      
                                </div>
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button className="btn btn-outline-success" type="submit" >Update</button>
                            </div>
                             
                            </div>
                        </div>
                        </div>
                        </form>
                        </td>:""}
                        </tr>
                    )     
                })}
                </tbody>
            </table>
            {role==="ADMIN" ? <>

            <button className="btn btn-outline-success mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#addForum" aria-expanded="false" aria-controls="addForum" onClick={()=>{sleep(250).then(()=>{window.scrollTo(0,document.body.scrollHeight)})}}>Add forum</button>

            <form className="collapse multi-collapse" id="addForum" onSubmit={addForum}>
            <div className="row g-2">
                <div className="col-md-7">
                    <div className="form-floating">
                    <input type="text" required minLength="5" className="form-control" id="title" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
                    <label htmlFor="title">Title</label>
                    </div>
                </div>
                <div className="col-md-7">
                    <textarea minLength="10" required className="form-control" id="content" placeholder="content" value={content} onChange={(e)=>setContent(e.target.value)} rows="5" maxLength="255"></textarea>
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
export default ForumList;
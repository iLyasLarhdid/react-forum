import properties from "../../properties";
import React, { useState } from 'react';
import { Upload,Button,Tooltip,message,Image, Skeleton } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useCookies } from "react-cookie";
import useFetch from "../../hooks/useFetch";
import Posts from "../Posts/Posts";
const {host,avatarProp} = properties;

const ProfileDetails = ({profile})=>{

    const [showUploadButton, setShowUploadButton] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [showUploadField,setShowUploadField] = useState(false);
    const [cookies,setCookies] = useCookies();
    const [profileData,] = useState(profile)

    const url = `${host}/api/v1/posts/userId/${profileData.id}`;
    const [posts,isPending,error] = useFetch(url);

    console.log(posts);
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setShowUploadButton(true);
        console.log("file list");
        console.log(fileList[0]);
      };

    const onPreview = async file => {
        let src = file.url;
        if (!src) {
          src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
      };

    const uploadFile = (e)=>{
        e.preventDefault();
        message.loading('uploading....',"updating");
        console.log("file");
        console.log(fileList[0]);
        const formData = new FormData();
        formData.append("file",fileList[0].originFileObj);
        const url = `${host}/upload`;
        fetch(url,{
            method:"post",
            headers: {
                'Authorization': cookies.ilyToken
            },
            body:formData
        })
        .then(response =>{ 
            if(!response.ok){
                throw Error("somethign went wrong");
            }
            return response.json();
        }).then(data=>{
            console.log("upload=>");
            console.log(data);
            setCookies("principal_avatar",data.fileUri);
            message.success({content:'Updated successfully', key:"updating", duration:2});
            //const index = JSON.stringify(data);
            setFileList([]);
            setShowUploadField(false);
            setShowUploadButton(false);
        }).catch(err=>{
            setFileList([]);
            setShowUploadField(false);
            setShowUploadButton(false);
            console.log("err ",err);
            message.error({content:err, key:"updating", duration:2});
        });
    }

    console.log("inside profile details and the data is :",profileData);
    return(
    <div className="container">
    <div className="row">
        
        <div className="col-lg-4 col-xl-3" style={{ background:"#edeff0", borderRadius:"10px", marginRight:"1rem", padding:"1rem",marginBottom:"1rem"}}>
        <Tooltip key="comment-basic-like" title="click to change avatar"><Button type="link" onClick={()=>setShowUploadField(!showUploadField)}>upload picture </Button></Tooltip>

            {profileData.avatar ? 
                    <Image
                    width={250}
                    src={`${host}/upload/viewFile/${profileData.avatar}`}
                    alt="avatar"
                    />
            :
                <Image
                    width={250}
                    src={avatarProp}
                    alt="avatar"
                    />}
            
            {showUploadField && <>
            <ImgCrop rotate>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    style={{ width:"250" }}
                >
                    {fileList.length < 1 && '+ Upload'}
                </Upload>
            </ImgCrop>
            {showUploadButton &&
            <Button
                    type="primary"
                    disabled={fileList.length === 0}
                    style={{ marginTop: 16 }}
                    onClick={uploadFile}
                    >
                    Start Upload
            </Button>}</>}
            <div>{profileData.firstName}</div>
            <div>{profileData.email}</div>
        </div>
        <div  className="col-lg-6 col-xl-5" style={{ background:"#FDFAF9", borderRadius:"10px", marginRight:"1rem", padding:"1rem",marginBottom:"1rem"}}>
            
            <div>{error && <div>{error}</div>}</div>
            <div>{isPending && <div><Skeleton active/><Skeleton active/><Skeleton active/></div>}</div>
            <div>{posts && <Posts postsData={posts} isFromProfile={true}/>} {posts&& <>Pagination here {posts.numberOfElements}</>}</div>
        </div>

        <div className="col-lg-4 col-xl-3" style={{ background:"#edeff0", borderRadius:"10px", padding:"1rem",marginBottom:"1rem"}}>
            <div>online friends</div>
            <div>online friends</div>
            <div>online friends</div>
            <div>online friends</div>
            <div>online friends</div>
            <div>online friends</div>
            <div>online friends</div>
        </div>
        
    </div>
    </div>)
}   

export default ProfileDetails;
import properties from "../../properties";
import React, { lazy, Suspense, useState } from 'react';
import { Upload,Button,Tooltip,message,Image, Skeleton, Statistic } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useCookies } from "react-cookie";
import { CommentOutlined } from '@ant-design/icons';
import { useInfiniteQuery } from "react-query";
import InfiniteScroll from "react-infinite-scroller";
import { Link } from "react-router-dom";
import AddFriend from "./Addfriend";
const Posts = lazy(()=>import ('../Posts/Posts'));

const {host,avatarProp} = properties;

const fetchData = async (key)=>{
    const userId = key.queryKey[1];
    const token = key.queryKey[2];
    let page;
    if(typeof key.pageParam === "undefined")
        page=0;
    else
        page = key.pageParam;
    console.log(key);
    const res = await fetch(`${host}/api/v1/posts/userId/${userId}/page/${page}`,{
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        }
    } )
    return res.json();
}

const ProfileDetails = ({profile})=>{

    const [showUploadButton, setShowUploadButton] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [showUploadField,setShowUploadField] = useState(false);
    const [cookie,setCookie] = useCookies([]);
    const [profileData,] = useState(profile);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage
      } = useInfiniteQuery(['posts',profileData.id,cookie.ilyToken], fetchData, {
        getNextPageParam: (lastPage, pages) => {
            console.log(pages);
            console.log("next page number : ",lastPage);        
            let nextPage = undefined;
            if(lastPage.number<lastPage.totalPages-1)
                nextPage = lastPage.number+1;
            return (nextPage)
        },
      })

      console.log("data ....... ",data);
      console.log(hasNextPage);
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
                'Authorization': cookie.ilyToken
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
            message.success({content:'Updated successfully', key:"updating", duration:2});
            //const index = JSON.stringify(data);
            setCookie("principal_avatar",data.fileUri,{path:"/",maxAge:604800});
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
        
        <div className="col-12 col-md-3 col-lg-4 col-xl-3" style={{ background:"#edeff0", borderRadius:"10px", marginRight:"1rem", padding:"1rem",marginBottom:"1rem"}}>

            {profileData.avatar ? 
                    <Image
                    src={`${host}/upload/viewFile/${profileData.avatar}`}
                    alt="avatar"
                    />
            :
                <Image
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
            <div>
            {profileData.id === cookie.principal_id && <Tooltip key="comment-basic-like" title="click to change avatar"><Button type="link" onClick={()=>setShowUploadField(!showUploadField)}>upload picture </Button></Tooltip>}
            </div>
            {/* Component for adding friends */}
            <AddFriend profileData={profileData}/>

            <div><b>{profileData.firstName} {profileData.lastName}</b></div>
            <div>{profileData.email}</div>
            <div><Link to={`/friends/${profileData.id}`}>Friends</Link></div>
            {data && <div><Statistic title="Total number of posts" value={data.pages[0].totalElements} prefix={<CommentOutlined />} /></div>}
        </div>
        
        <div  className="col-12 col-md-8 col-lg-7 col-xl-8" style={{ background:"#FDFAF9", borderRadius:"10px", marginRight:"1rem", padding:"1rem",height:"100vh",marginBottom:"1rem"}}>
            <div>{isLoading && <div><Skeleton active/><Skeleton active/><Skeleton active/></div>}</div>

            <InfiniteScroll
            pageStart={0}
            loadMore={fetchNextPage}
            hasMore={hasNextPage}
            loader={<div className="loader"><Skeleton/></div>}
            >
            {data && data.pages.length && data.pages.map((post,index)=>{
                return(
                    <Suspense fallback={<Skeleton/>}>
                        <Posts postsData={post} showForm={false}/>
                    </Suspense>
                )
            })}
            </InfiniteScroll>
        </div>
        

        
        
    </div>
    </div>)
}   

export default ProfileDetails;
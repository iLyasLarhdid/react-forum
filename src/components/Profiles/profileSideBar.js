import Avatar from "antd/lib/avatar/avatar";
import { Badge } from 'antd';
const ProfileSideBar = ()=>{

    return(
    <>
    {/* show friends but for now i will show all users */}
    <div><b>Ilyas Said 1</b> <Badge status="success"><Avatar>IS</Avatar></Badge></div>
    <div><b>Said ilyas 2</b> <Badge><Avatar>SI</Avatar></Badge></div>
    <div><b>Said ilyas 3</b> <Badge status="success"><Avatar>SI</Avatar></Badge></div>            
    <div><b>Ilyas Said 4</b> <Badge><Avatar>IS</Avatar></Badge></div>
    <div><b>Ilyas Said 1</b> <Badge status="success"><Avatar>IS</Avatar></Badge></div>
    <div><b>Said ilyas 2</b> <Badge status="success"><Avatar>SI</Avatar></Badge></div>
    <div><b>Said ilyas 3</b> <Badge><Avatar>SI</Avatar></Badge></div>
    <div><b>Ilyas Said 4</b> <Badge><Avatar>IS</Avatar></Badge></div>
    </>
    );
}
export default ProfileSideBar;
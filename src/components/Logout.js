import { useContext } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { UserContext } from "../hooks/UserContext";

const Logout = ()=>{

    const [cookies,,removeCookie] = useCookies([]);
    const history = useHistory();
    const [role, setRole] = useContext(UserContext);

    if(cookies.cyberpunk){
        removeCookie("cyberpunk");
        removeCookie("principal_id");
        removeCookie("principal_first_name");
        removeCookie("principal_last_name");
        removeCookie("principal_email");
        removeCookie("principal_avatar");
        removeCookie("principal_role");
        }
    if(role){
        setRole(null);
    }
    history.push("/login");
    return (<>there is an error in this page</>)
}
export default Logout;
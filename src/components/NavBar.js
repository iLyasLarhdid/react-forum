import { useContext } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { UserContext } from "../hooks/UserContext";

const NavBar = () =>{
    const [cookies,] = useCookies();
    const [role,] = useContext(UserContext);
    return (<>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">Navbar</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/hi">Link</Link>
          </li>
          {!role ? <li className="nav-item"><Link className="nav-link" to="/signup">sign up</Link></li>:""}
          <li className="nav-item">
            {!role ? <Link className="nav-link" to="/login">login</Link> : <Link className="nav-link" to="/logout">logout</Link>}
          </li>
          <li className="nav-item">
          
          {role ? <span className="nav-link">welcome {cookies.principal_first_name} : {role.avatar}<img src={cookies.principal_avatar} width="20" alt="avatar"/></span> : ""
          //this doesnt work when you logout or login!!!
          }
          </li>
        </ul>
        <form className="d-flex">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav></>)
}
export default NavBar;
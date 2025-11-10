import "./Sidenav.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Assets/logo-1500x400.png";

const Sidenav = () => {
  let history = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    history("/login");
  };

  return (
    <div className="Sidenav">
      <div className="Sidenav-icon">
        <Link to={"/"}>
          <img src={logo} alt="" />
        </Link>
      </div>
      <div className="Sidenav-box">
        <ul>
          <li>
            <Link to={"/"}>Dashboard</Link>
          </li>
          <li>
            <Link to={"/blog"}>Blog</Link>
          </li>
          <li>
            <Link to={"/blog/add"}>Add Blog</Link>
          </li>
        </ul>
      </div>
      <div className="Sidenav-logout">
        <Link to={"/login"} onClick={handleLogout}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidenav;

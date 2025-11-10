import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../Assets/logo-1500x400.png";
import Host from "../../Host/Host";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${Host}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    // console.log(json);
    if (json.success) {
      localStorage.setItem("token", json.authToken);
      //   props.showAlert("Logedin successfully", "success");
      history("/");
    } else {
      //   props.showAlert("Invalid Details", "danger");
      console.log("error");
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-box-imag">
          <img src={logo} alt="" />
        </div>
        <h4>Login</h4>
        <form onSubmit={handleSubmit}>
          <div className="user-box">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={onChange}
              name="email"
              id="email"
              required
            />
          </div>
          <div className="user-box">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={onChange}
              name="password"
              id="password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
      </div>
      <div
        className="modal-backdrop"
        // onClick={closeModal}
        style={{ background: "#fff7f1" }}
      ></div>
    </div>
  );
};

export default Login;

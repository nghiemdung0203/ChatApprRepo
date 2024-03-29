import React, { useState } from "react";
import "../Style/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    await axios
      .post("http://localhost:4000/User/signin", {
        Email,
        Password,
      })
      .then((result) => {
        localStorage.setItem("user", result.data);
        navigate('/chat');
      });
  };
  return (
    <div className="container">
      <div className="wrapper">
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <a href="#" className="forget-pass">
          Forget password
        </a>

        <button onClick={handleLogin}>Login</button>
        <div className="register-site">
          <p>
            Don't have account yet? <a href="/register">Register Now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

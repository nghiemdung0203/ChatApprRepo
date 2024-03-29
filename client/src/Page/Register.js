import React, { useState } from "react";
import "../Style/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [Name, setName] = useState("");
  const formData = new FormData();
  const [file, setFile] = useState();
  formData.append("Email", Email);
  formData.append("Password", Password);
  formData.append("Avatar", file);
  formData.append("Name", Name);
  const navigate = useNavigate();
  const handleRegister = async () => {
    console.log(file);
    if (Password !== confirmPassword) {
      console.log('password doesn"t match');
    } else {
      await axios
        .post("http://localhost:4000/User/signup", formData)
        .then((result) => {
          localStorage.setItem("user", result.data);
          navigate("/chat");
        });
    }
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
        <div className="input-box">
          <input
            type="password"
            placeholder="ConfirmPassword"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="Name...."
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="image-forget_pass">
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <a href="#" className="forget-pass">
            Forget password
          </a>
        </div>
        <button onClick={handleRegister}>Register</button>
        <div className="register-site">
          <p>
            Don't have account yet? <a href="/login">Login Now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import "../Style/Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";
const Login = ({socket}) => {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState();
  const formData = new FormData();
  formData.append("Email", Email);
  formData.append("Password", Password);
  formData.append("Avatar", file);
  formData.append("Name", Name);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios
        .post("http://localhost:4002/User/signin", {
          Email,
          Password,
        })
        .then((result) => {
          localStorage.setItem("user", result.data);
          socket.emit('join', jwtDecode(localStorage.getItem("user")).user_id)
          toast.success("login successfully");
          navigate("/chat");
        });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      console.log(file);
      if (Password !== confirmPassword) {
        console.log('password doesn"t match');
      } else {
        await axios
          .post("http://localhost:4002/User/signup", formData)
          .then((result) => {
            localStorage.setItem("user", result.data);
            toast.success("Register successfully");
            navigate("/chat");
          });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };
  return (
    <div className='body'>
    <div
      className={`container ${isSignUp ? "right-panel-active" : ""}`}
      id="container"
    >
      <div className="form-container sign-up-container">
        <div className="Login">
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social">
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="#" className="social">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span>or use your email for registration</span>
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="ConfirmPassword"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <button className="button" onClick={handleRegister}>Sign Up</button>
        </div>
      </div>
      <div className="form-container sign-in-container">
        <div className="Login">
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="#" className="social">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social">
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="#" className="social">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          <span>or use your account</span>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <a href="#">Forgot your password?</a>
          <button className="button" onClick={handleLogin}>Sign In</button>
        </div>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button className="ghost button" id="signIn" onClick={handleSignInClick}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost button" id="signUp" onClick={handleSignUpClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;

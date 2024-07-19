// src/pages/LoginNew.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDTO } from "../api/dto/user.js";
import { loginS } from "../api/login.jsx";
import GLogin from "../components/GLogin";
import { gsap } from "gsap/gsap-core";
import { TextPlugin } from "gsap/all";

import "./LoginNew.css";

const LoginNew = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const textRef = useRef(null);
  const cursorRef = useRef(null);
  const [index, setIndex] = useState(0);
  const textToType = ["중고거래에 경매를 더하다."];

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    gsap.to(textRef.current, { duration: 0, text: " " });

    gsap.to(textRef.current, {
      duration: 3,
      text: {
        value: textToType[index],
        delimiter: "",
      },
      ease: "none",
      onUpdate: () => {},
    });
  }, [index]);

  const handleLogin = async () => {
    const user = new UserDTO(username, password);
    const res = await loginS(user);
    if (res === "success") {
      navigate("/main");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-page-container">
        <div className="login-page-left">
          <div className="logo">
            <img src="./PIXELLER.png" alt="PIXELLER Logo" />
          </div>
          <div className="text-center">
            <p className="text-center main" ref={textRef}></p>
            <p className="text-center sub">당신의 물건, 최고의 가치로</p>
          </div>
          <div>
            <img src="apple-icon-180x180.png" alt="Bunny Character" />
          </div>
        </div>
        <div className="login-page-right">
          <h2 className="login-page-header">Login</h2>
          <form className="login-form">
            <label htmlFor="username">Email Address</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Enter username"
              onChange={handleUsernameChange}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter password"
              onChange={handlePasswordChange}
            />
            <button type="button" onClick={handleLogin}>
              Login
            </button>
            <div className="footer-create">
              <Link to="/register" className="register">
                Create Account
              </Link>
            </div>
          </form>
          <div className="login-google">
            <GLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginNew;

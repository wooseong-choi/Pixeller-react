import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GLogin from "./GLogin";
import "../static/css/ModalLogin.css";
import { setCookie } from "./Cookies.ts";
import { jwtDecode } from "jwt-decode";
import { UserDTO } from "../api/dto/user.js";
import { login } from "../api/login.jsx";

const ModalLogin = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const user = new UserDTO(username, password);

    try {
      const response = await login(user);
      if (response === null || response === "")
        return alert("로그인이 실패하였습니다.");
      if (response.msg === "Ok") {
        if (response.jwt) {
          const option = {
            Path: "/",
            HttpOnly: true,
            SameSite: "None",
            Secure: true,
            expires: new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 14),
          };
          setCookie("refresh_token", response.jwt, option);
        }
        
        sessionStorage.setItem("user", response.jwt);
        sessionStorage.setItem("username", username);
        navigate("/main");
      } else {
        alert(response.msg);
      }
    } catch (error) {
      console.log(error);
      alert("에러가 발생했습니다.");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="modal-wrapper">
        <div className="modal">
          <div className="body">
            <form className="form-login">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleUsernameChange}
              ></input>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
              ></input>
              <div className="login-google">
                <GLogin />
              </div>
            </form>
          </div>
          <div className="footer">
            <button onClick={handleLogin}>Login</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalLogin;

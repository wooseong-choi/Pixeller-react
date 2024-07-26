// src/pages/LoginNew.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserDTO } from "../api/dto/user.js";
import { loginS } from "../api/login.jsx";
import GLogin from "../components/GLogin";
import { gsap } from "gsap/gsap-core";
import { TextPlugin } from "gsap/TextPlugin";
import CustomButton from "../components/alert/CustomButton.jsx";
import axios from "axios";

import "../static/css/LoginNew.css";
gsap.registerPlugin(TextPlugin);
const LoginNew = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createUsername, setCreateUsername] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [isLoginView, setIsLoginView] = useState(true); // 상태 추가
  const [animationDone, setAnimationDone] = useState(false);
  const navigate = useNavigate();

  const textRef = useRef(null);
  const [index, setIndex] = useState(0);
  const textToType = ["중고거래에 경매를 더하다."];

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCreateUsernameChange = (e) => {
    setCreateUsername(e.target.value);
  };

  const handleCreatePasswordChange = (e) => {
    setCreatePassword(e.target.value);
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
  const handleregist = () => {
    // Perform login logic here

    const user = {
      id: createUsername,
      name: createUsername,
      pw: createPassword,
      user_type: "U",
    };
    axios
      .post("https://api.pixeller.net/user/create", { user })
      .then(async (response) => {
        console.log(response);
        if (response.data === null || response.data === "")
          return alert("회원가입이 실패하였습니다.");
        if (response.data.msg === "Ok") {
          const user = new UserDTO(createUsername, createPassword);

          const res = await loginS(user);
          if (res === "success") {
            navigate("/main");
          }
        } else {
          alert(response.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return alert("에러가 발생했습니다.");
      });
  };

  const handleTransitionEnd = (e) => {
    if (animationDone) {
      if (isLoginView) {
        document.getElementById("registerView").style.display = "none";
        document.getElementById("loginView").style.display = "flex";
      } else {
        document.getElementById("loginView").style.display = "none";
        document.getElementById("registerView").style.display = "flex";
      }
      setAnimationDone(false);
    }
  };

  useEffect(() => {
    setAnimationDone(false);
    if (isLoginView) {
      setTimeout(() => {
        setAnimationDone(true);
      }, 500);
    } else {
      setTimeout(() => {
        setAnimationDone(true);
      }, 500);
    }
  }, [isLoginView]);

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
        <div
          id="loginView"
          className={`login-page-right ${isLoginView ? "fade-in" : "fade-out"}`}
          onTransitionEnd={handleTransitionEnd}
        >
          <h2 className="login-page-header">Login</h2>
          <form className="login-form">
            <label htmlFor="username">Username</label>
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
            <div
              className="footer-create"
              onClick={() => setIsLoginView(false)}
            >
              Create Account
            </div>
          </form>
          <div className="login-google">
            <GLogin />
          </div>
          {/* <div>
            <CustomButton />
          </div> */}
        </div>
        <div
          id="registerView"
          className={`login-page-right ${
            isLoginView ? "fade-out" : "fade-in"
          } hide`}
          onTransitionEnd={handleTransitionEnd}
        >
          <h2 className="login-page-header">Create Account</h2>
          <form className="create-form">
            <label htmlFor="create-username">Username</label>
            <input
              type="text"
              id="create-username"
              name="create-username"
              value={createUsername}
              placeholder="Enter username"
              onChange={handleCreateUsernameChange}
            />
            <label htmlFor="create-password">Password</label>
            <input
              type="password"
              id="create-password"
              name="create-password"
              value={createPassword}
              placeholder="Enter password"
              onChange={handleCreatePasswordChange}
            />
            <button type="button" onClick={handleregist}>
              Create
            </button>
            <div className="footer-create">
              Already have an account?{" "}
              <span onClick={() => setIsLoginView(true)}>Login</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginNew;

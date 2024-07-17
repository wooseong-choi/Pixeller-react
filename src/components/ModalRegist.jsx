import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../static/css/ModalLogin.css";
import { loginS } from "../api/login";
import { UserDTO } from "../api/dto/user";

const ModalRegist = ({ isRegistOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleregist = () => {
    // Perform login logic here

    const user = {
      id: username,
      name: username,
      pw: password,
      user_type: "U",
    };
    axios
      .post("https://api.pixeller.net/user/create", { user })
      .then(async (response) => {
        console.log(response);
        if (response.data === null || response.data === "")
          return alert("회원가입이 실패하였습니다.");
        if (response.data.msg === "Ok") {
          const user = new UserDTO(username, password);

          const res = await loginS(user);
          if (res === "success") {
            navigate("/main");
          }
          // sessionStorage.setItem("user", JSON.stringify(response.data));
          // sessionStorage.setItem("username", username);

        } else {
          alert(response.data.msg);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        return alert("에러가 발생했습니다.");
      });
  };

  if (!isRegistOpen) {
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
            </form>
          </div>
          <div className="footer">
            <button onClick={handleregist}>Regist</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalRegist;

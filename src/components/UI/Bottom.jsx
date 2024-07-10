import React, { useState } from "react";
import Logout from "./Logout";
import "../../static/css/bottom.css";

const App = ({
  isOpen,
  setIsOpen,
  isChatOpen,
  setIsChatOpen,
  isNotiOpen,
  setIsNotiOpen,
  totalProductCounts,
  setIsMicOpen,
  setIsCamOpen,
}) => {
  const currentUser = sessionStorage.getItem("username");

  const [isLogoutClicked, setIsLogoutClicked] = useState(false);

  const toggleLogout = () => {
    setIsLogoutClicked((prev) => !prev);
  };

  return (
    <div className="navbar">
      <div className="left-section">
        <div className="user-info">
          <img
            src="svg/user-icon.svg"
            alt="User Icon"
            className="user-icon"
            onClick={toggleLogout}
          />
          <span className="username">{currentUser}</span>
          <span className="status">활동중</span>
          <span className="status-dot on"></span>
        </div>
        {isLogoutClicked && <Logout setIsLogoutClicked={setIsLogoutClicked} />}
        <div className="center-section">
          <button className="nav-button">
            <img
              src="svg/microphone-icon.svg"
              alt="Microphone"
              onClick={setIsMicOpen}
            />
          </button>
          <button className="nav-button">
            <img src="svg/video-icon.svg" alt="Video" onClick={setIsCamOpen} />
          </button>
          <button className="nav-button">
            <img src="svg/emoji-icon.svg" alt="emoji" />
          </button>
        </div>
      </div>
      <div className="right-section">
        <button
          className="nav-button"
          onClick={() => {
            setIsNotiOpen((prev) => !prev);
            if (isOpen) setIsOpen((prev) => !prev);
            if (isChatOpen) setIsChatOpen((prev) => !prev);
          }}
        >
          <img src="svg/bell-icon.svg" alt="Bell" />
        </button>
        <button
          className="nav-button"
          onClick={() => {
            setIsChatOpen((prev) => !prev);
            if (isOpen) setIsOpen((prev) => !prev);
            if (isNotiOpen) setIsNotiOpen((prev) => !prev);
          }}
        >
          <img src="svg/chat-icon.svg" alt="Chat" />
        </button>
        <button
          className="nav-button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            if (isOpen) setIsOpen((prev) => !prev);
            if (isNotiOpen) setIsNotiOpen((prev) => !prev);
          }}
        >
          <img src="svg/i_wont_product.svg" alt="Group" />
          <span className="status-dot on"></span>
          <div className="notification-count">{totalProductCounts}</div>
        </button>
      </div>
    </div>
  );
};

export default App;

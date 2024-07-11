import React, { useState } from "react";
import Logout from "./Logout";
import "../../static/css/bottom.css";
import UserInfo from "./UserInfo";

const App = ({
  isOpen,
  setIsOpen,
  isChatOpen,
  setIsChatOpen,
  // isNotiOpen,
  // setIsNotiOpen,
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
        <UserInfo user={sessionStorage.getItem('user')} />
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
        {/* <button
          className="nav-button"
          onClick={() => {
            setIsNotiOpen((prev) => !prev);
            if (isOpen) setIsOpen((prev) => !prev);
            if (isChatOpen) setIsChatOpen((prev) => !prev);
          }}
        >
          <img src="svg/bell-icon.svg" alt="Bell" />
        </button> */}
        <button
          className="nav-button"
          onClick={() => {
            setIsChatOpen((prev) => !prev);
            if (isOpen) setIsOpen((prev) => !prev);
          }}
        >
          <img src="svg/chat-icon.svg" alt="Chat" />
        </button>
        <button
          className="nav-button"
          onClick={() => {
            setIsOpen((prev) => !prev);
            if (isChatOpen) setIsChatOpen((prev) => !prev);
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

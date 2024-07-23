import React, { useEffect, useState } from "react";
import Logout from "./Logout";
import "../../static/css/bottom.css";
import UserInfo from "./UserInfo";
import AlertAuction from "../alert/AlertAuction";

const App = ({
  isOpen,
  setIsOpen,
  isChatOpen,
  setIsChatOpen,
  totalProductCounts,
  setIsMicOpen,
  isMicOpen,
  setIsCamOpen,
  isCamOpen,
  setIsAuctionAlert,
  setAuctionProduct,
}) => {
  const currentUser = sessionStorage.getItem("username");
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);

  const toggleLogout = () => {
    setIsLogoutClicked((prev) => !prev);
  };

  const handleDEBUG = () => {
    setIsAuctionAlert(true);
    // setAuctionProduct()
  };

  return (
    <div className="navbar">
      <div className="left-section">
        <UserInfo user={currentUser} />
        {isLogoutClicked && <Logout setIsLogoutClicked={setIsLogoutClicked} />}
        <div className="center-section">
          <button className="nav-button" onClick={setIsMicOpen}>
            {isMicOpen ? (
              <img src="svg/video-icon.svg" alt="Video" />
            ) : (
              <img src="svg/video-x-icon.svg" alt="Video" />
            )}
          </button>
          {/* <button className="nav-button" onClick={setIsCamOpen}>
            {isCamOpen ? (
              <img src="svg/video-icon.svg" alt="Video" />
            ) : (
              <img src="svg/video-x-icon.svg" alt="Video" />
            )}
          </button> */}
        </div>
      </div>
      <div className="right-section">
        <button onClick={handleDEBUG}>안녕</button>
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

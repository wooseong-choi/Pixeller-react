import React, { useEffect, useState } from "react";
import "../static/css/List.css";
import Chat from "../socket/chat_direct";
import "../components/Boards/PL.css";
import ProductList from "./Boards/ProductList";

// 이걸로 유저목록 만들어서 포문돌릴것
function getConnectedUser() {}

const List = ({ isOpen, setIsOpen, isChatOpen, setIsChatOpen, isNotiOpen, setIsNotiOpen }) => {
  getConnectedUser();
  
  const [chatComponent, setChatComponent] = useState(null);

  useEffect(() => {
    if (!chatComponent) {
      setChatComponent(<Chat />);
    }
  }, [chatComponent]);


  const toggleMenu = (val, method) => {
    method(!val);
  };
  return (
    <>
      <div className={`sidebar-container side-menu ${isOpen ? "open" : ""}`}>
        <ProductList />
      </div>

      <div className={`side-menu-chat ${isChatOpen ? "open" : ""}`}>
        <button
          className="menu-toggle"
          onClick={() => {
            toggleMenu(isChatOpen, setIsChatOpen);
          }}
        >
          <img src="svg/exit.svg" />
        </button>
        <div className="chatDivWrap">
          <div className="chatDiv">
            <h1>Chat</h1>
          </div>
        </div>
        
        <nav className="chat-content">

            {chatComponent}

        </nav>
        <div className="chat-rooms"></div>
      </div>
      
      <div className={`side-menu-noti ${isNotiOpen ? "open" : ""}`}>
        <button
          className="menu-toggle"
          onClick={() => {
            toggleMenu(isNotiOpen, setIsNotiOpen);
          }}
        >
          <img src="svg/exit.svg" />
        </button>
        <div className="notiDivWrap">
          <div className="notiDiv">
            <h1>noti</h1>
          </div>
        </div>
        <nav className="noti-content">
          <div>
            <div className="noti-info">
              <span className="noti-profile">
                <img
                  src="svg/user-icon.svg"
                  alt="User Icon"
                  className="user-icon"
                />
              </span>
              <span className="noti-name">최우성</span>
              <span className="noti-message">안녕하세요</span>
            </div>
            <div className="noti-info me">
              <span className="noti-profile">
                <img
                  src="svg/user-icon.svg"
                  alt="User Icon"
                  className="user-icon"
                />
              </span>
              <span className="noti-name">류강현</span>
              <span className="noti-message">안녕하세요</span>
            </div>
            <div className="noti-info">
              <span className="noti-profile">
                <img
                  src="svg/user-icon.svg"
                  alt="User Icon"
                  className="user-icon"
                />
              </span>
              <span className="noti-name">최우성</span>
              <span className="noti-message">안녕하세요</span>
            </div>
          </div>
        </nav>
        <div className="noti-rooms"></div>
      </div>
    </>
  );
};
export default List;

import React, { useEffect, useState } from "react";
import "../static/css/List.css";
import Chat from "../socket/chat_direct";

// 이걸로 유저목록 만들어서 포문돌릴것
function getConnectedUser() {}

const List = ({ isOpen, setIsOpen, isChatOpen, setIsChatOpen, isNotiOpen, setIsNotiOpen }) => {
  getConnectedUser();
  
  const [chatComponent, setChatComponent] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  // useEffect(() => {
  //   if (!chatComponent) {
  //     setChatComponent(<Chat tempStompClient={stompClient} setStompClient={setStompClient} />);
  //   }
  // }, [chatComponent]);

  const toggleMenu = (val, method) => {
    method(!val);
  };
  return (
    <>
      <div className={`side-menu ${isOpen ? "open" : ""}`}>
        <button
          className="menu-toggle"
          onClick={() => {
            toggleMenu(isOpen, setIsOpen);
          }}
        >
          <img src="svg/exit.svg" />
        </button>
        <div className="searchDivWrap">
          <div className="searchDiv">
            <img
              src="svg/search-icon.svg"
              alt="Search Icon"
              className="search-icon"
            />
            <input placeholder="Search" type="text" />
          </div>
        </div>
        <nav className="menu-items">
          <div className="user-info">
            <img
              src="svg/user-icon.svg"
              alt="User Icon"
              className="user-icon"
            />
            <span className="username">류강현</span>
            <span className="status">활동중</span>
            <span className="status-dot on"></span>
          </div>
          <div className="user-info">
            <img
              src="svg/user-icon.svg"
              alt="User Icon"
              className="user-icon"
            />
            <span className="username">류강현</span>
            <span className="status">활동중</span>
            <span className="status-dot on"></span>
          </div>
          <div className="user-info">
            <img
              src="svg/user-icon.svg"
              alt="User Icon"
              className="user-icon"
            />
            <span className="username">류강현</span>
            <span className="status">활동중</span>
            <span className="status-dot on"></span>
          </div>
          <div className="user-info">
            <img
              src="svg/user-icon.svg"
              alt="User Icon"
              className="user-icon"
            />
            <span className="username">류강현</span>
            <span className="status">활동중</span>
            <span className="status-dot on"></span>
          </div>
        </nav>
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
          <div>
            <div className="chat-info">
              <span className="chat-profile">
                <img
                  src="svg/user-icon.svg"
                  alt="User Icon"
                  className="user-icon"
                />
              </span>
              <span className="chat-name">최우성</span>
              <span className="chat-message">안녕하세요</span>
            </div>
            <div className="chat-info me">
              <span className="chat-profile">
                <img
                  src="svg/user-icon.svg"
                  alt="User Icon"
                  className="user-icon"
                />
              </span>
              <span className="chat-name">류강현</span>
              <span className="chat-message">안녕하세요</span>
            </div>
            <div className="chat-info">
              <span className="chat-profile">
                <img
                  src="svg/user-icon.svg"
                  alt="User Icon"
                  className="user-icon"
                />
              </span>
              <span className="chat-name">최우성</span>
              <span className="chat-message">안녕하세요</span>
            </div>
          </div>
          <div>
            {/* {chatComponent} */}

          </div>
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

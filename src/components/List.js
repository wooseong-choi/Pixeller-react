import React, { useEffect, useState } from "react";
import "../static/css/List.css";
import Chat from "../socket/chat_direct";
import "../components/Boards/PL.css";
import ProductList from "./Boards/ProductList";
import { axiosCRUDInstance } from "../api/axios";
import { jwtDecode } from "jwt-decode";

// 이걸로 유저목록 만들어서 포문돌릴것
function getConnectedUser() {}

const List = ({
  isOpen,
  setIsOpen,
  isChatOpen,
  setIsChatOpen,
  // isNotiOpen,
  // setIsNotiOpen,
  openPDModal,
  openPCModal,
  setTotalProductCounts
}) => {
  getConnectedUser();

  const [chatComponent, setChatComponent] = useState(null);

  const [chatType, setChatType] = useState("public");

  useEffect(() => {
    if (!chatComponent) {
      setChatComponent(<Chat openType={chatType}/>);
    }
  }, [chatComponent]);

  const toggleMenu = (val, method) => {
    method(!val);
  };

  const chatRoomHandler = (e) => {
    if(e.target.className.indexOf("public") > -1) {
      document.getElementsByClassName("private")[0].classList.remove("active");
      e.target.classList.add("active");
      setChatType("public");
    }else if(e.target.className.indexOf("private") > -1) {
      document.getElementsByClassName("public")[0].classList.remove("active");
      e.target.classList.add("active");

      setChatType("private");
    }
  };

  const user = jwtDecode(sessionStorage.getItem("user"));


  return (
    <>
      <div className={`sidebar-container side-menu ${isOpen ? "open" : ""}`}>
        <ProductList openPDModal={openPDModal} openPCModal={openPCModal} setTotalProductCounts={setTotalProductCounts}/>
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

        <nav className="chat-content">{chatComponent}</nav>
        <div className="chat-rooms">
          <div className="chat-room public" onClick={chatRoomHandler}></div>
          <div className="chat-room private" onClick={chatRoomHandler}></div>
        </div>
      </div>

    </>
  );
};
export default List;

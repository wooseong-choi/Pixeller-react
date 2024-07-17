import React, { useEffect, useState } from "react";
import "../static/css/List.css";
import ChatDirect from "../socket/chat_direct";
import ChatPublic from "../socket/chat_public";
import "../components/Boards/PL.css";
import ProductList from "./Boards/ProductList";
import { axiosCRUDInstance } from "../api/axios";
import { jwtDecode } from "jwt-decode";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Alert from "./alert/sweetAlert2";

// const URL = '//192.168.0.100:8080/chat';
const URL = '//lionreport.pixeller.net/chat';
const PUBLIC_ROOM_NO = '1';


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

  const [chatPublicComponent, setChatPublicComponent] = useState(null);
  const [chatPrivateComponent, setChatPrivateComponent] = useState(null);

  const [chatType, setChatType] = useState("public");

  const [stompClient, setStompClient] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  useEffect(() => {
    if (!stompClient) {
        const connect = () => {
            const socket = new SockJS(URL);
            const client = Stomp.over(socket);
    
            // Retrieve the token (this is a simplified example, you might get it from an auth context or API)
            const token = sessionStorage.getItem('user');
            // Connect with token in headers
            client.connect(
                { 'Authorization': `Bearer ${token}` },
                (frame) => {
                    console.log('Connected: ' + frame);
                    setStompClient(client);
                },
                (error) => {
                    console.error('Connection error: ', error);
                }
            );
    
            return () => {
                if (client.connected) {
                    client.disconnect();
                }
            };
        };
        connect();
    }
  }, [stompClient]);
  
  useEffect(() => {
    if (stompClient) {
      if (!chatPublicComponent) {
        setChatPublicComponent(<ChatPublic stompClient={stompClient} />);
      }
      if (!chatPrivateComponent) {
        setChatPrivateComponent(<ChatDirect stompClient={stompClient} />);
      }
    }
  }, [stompClient, chatPublicComponent, chatPrivateComponent]);


  const toggleMenu = (val, method) => {
    method(!val);
  };

  const chatRoomHandler = (e) => {
    if(e.target.className.indexOf("public") > -1) {
      document.querySelector(".chat-rooms .private").classList.remove("active");
      e.target.classList.add("active");
      setChatType("public");
      document.querySelector('.chat-content.private').classList.remove('active');
      document.querySelector(".chat-content.public").classList.add("active");
    }else if(e.target.className.indexOf("private") > -1) {
      document.querySelector(".chat-rooms .public").classList.remove("active");
      e.target.classList.add("active");
      setChatType("private");
      document.querySelector('.chat-content.public').classList.remove('active');
      document.querySelector(".chat-content.private").classList.add("active");
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

        <nav className="chat-content public active">{chatPublicComponent}</nav>
        <nav className="chat-content private ">{chatPrivateComponent}</nav>
        <div className="chat-rooms">
          <div className="chat-room public" onClick={chatRoomHandler}></div>
          <div className="chat-room private" onClick={chatRoomHandler}></div>
        </div>
      </div>
      <Alert/>
    </>
  );
};
export default List;

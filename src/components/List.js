import React, { useEffect, useState } from "react";
import "../static/css/List.css";
import ChatDirect from "../socket/chat_direct";
import ChatPublic from "../socket/chat_public";
import ChatUserList from "../socket/chat_user_list";

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
  openPDModal,
  openPCModal,
  setTotalProductCounts
}) => {
  getConnectedUser();

  const [chatPublicComponent, setChatPublicComponent] = useState(null);
  const [chatPrivateComponent, setChatPrivateComponent] = useState(null);
  const [chatUserListComponent, setChatUserListComponent] = useState(null);

  const [chatType, setChatType] = useState("public");

  const [stompClient, setStompClient] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [chatUserList, setChatUserList] = useState([]);

  const [sendChatId, setSendChatId] = useState(null);

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
    const handleUserList = (e) => {
      // alert('receive-userlist 이벤트 발생!');
      console.log(e.detail.users);  // 사용자 목록 확인
      setChatUserList(e.detail.users);
    };

    window.addEventListener('receive-userlist', handleUserList);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('receive-userlist', handleUserList);
    };
  }, []);

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

  useEffect(() => {
    // if (!chatUserListComponent) {
    setChatUserListComponent(<ChatUserList stompClient={stompClient} chatUserList={chatUserList} setSendChatId={setSendChatId} />);
    // }
  },[chatUserList, sendChatId]);

  const toggleMenu = (val, method) => {
    method(!val);
  };

  const chatRoomHandler = (e) => {
    if(e.target.className.indexOf("room-list-navi") == -1){
      const chatRooms = document.querySelectorAll(".chat-room");
      for (let i = 0; i < chatRooms.length; i++) {
        chatRooms[i].classList.remove("active");
      }
      
      const chatContents = document.querySelectorAll('.chat-content');
      for (let i = 0; i < chatContents.length; i++) {
        chatContents[i].classList.remove("active");
      }

    }

    if(e.target.className.indexOf("public") > -1) {
      e.target.classList.add("active");
      setChatType("public");
      document.querySelector(".chat-content.public").classList.add("active");
    }else if(e.target.className.indexOf("private") > -1 
          &&  e.target.className.indexOf("room-list-navi") > -1){
      // 재로딩을 위해 컴포넌트를 null로 설정 후 다시 설정
      e.target.classList.remove("room-list-navi");
      e.target.classList.remove("active");
      setChatPrivateComponent(null);
      setTimeout(() => {
        setChatPrivateComponent(<ChatDirect stompClient={stompClient} />);
      }, 0);

      if(document.querySelector('.chat-room.public').className.indexOf('active') > -1){
        const chatRooms = document.querySelectorAll(".chat-room");
        for (let i = 0; i < chatRooms.length; i++) {
          chatRooms[i].classList.remove("active");
        }
        const chatContents = document.querySelectorAll('.chat-content');
        for (let i = 0; i < chatContents.length; i++) {
          chatContents[i].classList.remove("active");
        }


        e.target.classList.add("active");
        setChatType("private");
        document.querySelector(".chat-content.private").classList.add("active");
      }

    }else if(e.target.className.indexOf("private") > -1) {
      e.target.classList.add("active");
      setChatType("private");
      document.querySelector(".chat-content.private").classList.add("active");
    }else if(e.target.className.indexOf("user-list") > -1){
      document.querySelector(".chat-content.user-list").classList.add("active");
      e.target.classList.add("active");
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

        {/* <nav className="chat-content public active">{chatPublicComponent}</nav> */}
        <nav className="chat-content private ">{chatPrivateComponent}</nav>
        <nav className="chat-content user-list ">{chatUserListComponent}</nav>
        <div className="chat-rooms">
          <div className="chat-room public active" onClick={chatRoomHandler}></div>
          <div className="chat-room private" onClick={chatRoomHandler}></div>
          <div className="chat-room user-list " onClick={chatRoomHandler}></div>
        </div>
      </div>
      <Alert stompClient={stompClient}/>
    </>
  );
};
export default List;

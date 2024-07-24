// SidebarSection.js
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import ChatDirect from "../../socket/chat_direct";
import ChatPublic from "../../socket/chat_public";

const URL = '//lionreport.pixeller.net/chat';

const ChatBox = ({roomIdFirstSend, setRoomIdFirstSend, setAlertMessage}) => {
    const [chatPublicComponent, setChatPublicComponent] = useState(null);
    const [chatPrivateComponent, setChatPrivateComponent] = useState(null);
    const [stompClient, setStompClient] = useState(null);
    const [chatPrivateShow, setChatPrivateShow] = useState(false);


    useEffect(() => {
        if (!stompClient) {
            const connect = () => {
                const socket = new SockJS(URL);
                const client = Stomp.over(socket);
        
                // Retrieve the token (this is a simplified example, you might get it from an auth context or API)
                const token = sessionStorage.getItem('user');
                const user = jwtDecode( token );
                // Connect with token in headers
                client.connect(
                    { 'Authorization': `Bearer ${token}` },
                    (frame) => {
                        console.log('Connected: ' + frame);
                        setStompClient(client);
                        client.subscribe(`/sub/chat-room/info/${user.uid}`, (message) => {
                            console.log('알람 확인',JSON.parse(message.body));
                            setAlertMessage(JSON.parse(message.body));
                        });
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
        if (stompClient && !chatPublicComponent) {
          setChatPublicComponent(<ChatPublic stompClient={stompClient} />);
        }
    }, [stompClient, chatPublicComponent]);
    
    useEffect(() => {
        if (stompClient && roomIdFirstSend != null) {
            setChatPrivateComponent(null);
            setTimeout(() => {
                setChatPrivateComponent(<ChatDirect stompClient={stompClient} roomIdFirstSend={roomIdFirstSend} setRoomIdFirstSend={setRoomIdFirstSend}  />);
            },0);
            setChatPrivateShow(true);
        }   
    }, [roomIdFirstSend]);
    
    useEffect(() => {
        if (stompClient && !chatPrivateComponent) {
            setChatPrivateComponent(<ChatDirect stompClient={stompClient} roomIdFirstSend={roomIdFirstSend} setRoomIdFirstSend={setRoomIdFirstSend} />);
            // setChatPrivateShow(true);
        }   
    }, [stompClient, chatPrivateComponent]);
    

    const resetRoomId = () => {
        setRoomIdFirstSend(null);
        setChatPrivateComponent(null);
        setTimeout(() => {
            setChatPrivateComponent(<ChatDirect stompClient={stompClient} roomIdFirstSend={null} setRoomIdFirstSend={setRoomIdFirstSend}  />);
        }, 0);
    }

    const chatDivMinimize = () => {
        const target = document.getElementsByClassName('chat_list');
        const isRemove = target[0].classList.contains('minimize');
        for(let i=0; i<target.length; i++) {
            if(isRemove){
                target[i].classList.remove('minimize');
            }else{
                target[i].classList.add('minimize');
            }
        }
    }

    const showPrivateRoom = () => {
        setChatPrivateShow(!chatPrivateShow);
    }


    return (
        <>  
            <div className="chat_list">
                {chatPublicComponent}
                <div className="chat-room-btn-box">
                    <div className="chat-room-btn-box-inner">
                        {roomIdFirstSend != null ? 
                            <div className="return-menu" onClick={resetRoomId}></div>:
                            <div className="show-private" onClick={showPrivateRoom}></div>
                        }
                        <div className="win-minimize" onClick={chatDivMinimize}></div>
                    </div>
                </div>
            </div>
            <div className={`chat_list private ${chatPrivateShow ? "active":""}`} >
                {chatPrivateComponent}
            </div>
        </>
    );
};

export default ChatBox;

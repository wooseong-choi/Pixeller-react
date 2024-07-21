// SidebarSection.js
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import ChatDirect from "../../socket/chat_direct";
import ChatPublic from "../../socket/chat_public";

const URL = '//lionreport.pixeller.net/chat';

const ChatBox = ({roomIdFirstSend}) => {
    const [chatPublicComponent, setChatPublicComponent] = useState(null);
    const [chatPrivateComponent, setChatPrivateComponent] = useState(null);
    const [stompClient, setStompClient] = useState(null);
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
        if (stompClient && roomIdFirstSend) {
            setChatPrivateComponent(<ChatDirect stompClient={stompClient} roomIdFirstSend={roomIdFirstSend} />);
        }   
    }, [stompClient, roomIdFirstSend]);

    return (
        <>  
            <div className="chat_list">
                {chatPublicComponent}
            </div>
            <div className="chat_list private">
                {chatPrivateComponent}
            </div>
        </>
    );
};

export default ChatBox;

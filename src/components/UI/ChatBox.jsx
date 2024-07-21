// SidebarSection.js
import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import ChatDirect from "../../socket/chat_direct";
import ChatPublic from "../../socket/chat_public";

const URL = '//lionreport.pixeller.net/chat';
const PUBLIC_ROOM_NO = '1';

const ChatBox = () => {
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


    return (
        <>  
            <div className="chat_list">
                {chatPublicComponent}
            </div>
            <div>
                
            </div>
        </>
    );
};

export default ChatBox;

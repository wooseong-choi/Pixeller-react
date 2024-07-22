import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import ChatDivComponent from './chat_div_component';

const PUBLIC_ROOM_NO = '1';

const Chat = ({stompClient}) => {
    // const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const user = jwtDecode(sessionStorage.getItem('user') );

    useEffect(() => {
        if (stompClient) {
            const subscribe = () => {
                stompClient.subscribe(`/sub/message/${PUBLIC_ROOM_NO}`, (message) => {
                    showMessage(JSON.parse(message.body));
                });
            };
            subscribe();
        }
    }, [stompClient]);

    const showMessage = (message) => {
        // console.log(message);
        setMessages(prevMessages => [...prevMessages, message]);

        // 게임 씬에 채팅 메시지 이벤트 발생
        window.dispatchEvent(new CustomEvent('chat-message', {
            detail: { sender: message.senderName, message: message.message }
        }));
    }; 
     
    return (
        <>
            <ChatDivComponent stompClient={stompClient} messages={messages} />
        </>
    );
};

export default Chat;
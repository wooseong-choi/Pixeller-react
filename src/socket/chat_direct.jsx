import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import ChatDivComponent from './chat_div_component';

// const URL = 'http://192.168.0.100:8080/chat';
const URL = '//lionreport.pixeller.net/chat';
const PUBLIC_ROOM_NO = '1';

const Chat = ({openType}) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const user = jwtDecode(sessionStorage.getItem('user') );

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
                        // 전체 메시지 경로 구독
                        client.subscribe(`/sub/message/`+PUBLIC_ROOM_NO, (message) => {
                            // alert('메세지왔다. 받아라.');
                            showMessage(JSON.parse(message.body));
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
    }, [stompClient,setStompClient]);

    const showMessage = (message) => {
        // let temp = messages;
        // temp.push(message);
        // console.log("Direct Message: ", message);
        // setMessages(temp);
        console.log(message);
        setMessages(prevMessages => [...prevMessages, message]);
    }; 

    // stompClient.send(`/sub/chat-room/`+user.uid, {}, JSON.stringify({content: 'Hello'});

    stompClient.subscribe(`/sub/chat-room/`+user.uid, (res) => {
        console.log(res);
    });

    return (
        <>
            <ChatDivComponent stompClient={stompClient} messages={messages} />
        {/* <div>
            {messages.map((message, index) => (
                <div key={index} className={`chat-info ${ message.senderName===user.id?"me":"" }`}>
                    <span className="chat-profile">
                    <img
                        src="svg/user-icon.svg"
                        alt="User Icon"
                        className="user-icon"
                    />
                    </span>
                    <span className="chat-name">{message.senderName}</span>
                    <span className="chat-message">{message.message}</span>
                </div>
            ))}
            <div ref={messageEndRef}></div>
        </div>
        <div className="inputBox">                
            <input type="text" id="message" placeholder="메세지를 입력하세요!"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={(e)=>{ if( e.key === 'Enter') sendMessage(); }} />
        </div> */}
        </>
    );
};

export default Chat;
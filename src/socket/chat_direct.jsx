import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const URL = 'http://192.168.0.100:8080/chat';
const PUBLIC_ROOM_NO = '1';

const Chat = () => {
    const [stompClient, setStompClient] = useState(null);
    // const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
    const [messages, setMessages] = useState([]);
    console.log('Chat component is loaded');
    useEffect(() => {
        if (!stompClient) {
            alert('왜 두번 되냐고');
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

                        // 전체 메시지 경로 구독
                        client.subscribe(`/sub/message/`+PUBLIC_ROOM_NO, (message) => {
                            alert('메세지왔다. 받아라.');
                            showMessage(JSON.parse(message.body));
                        });

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
    }, []);

    const sendMessage = () => {
        const message = {
            content: document.getElementById("message").value,
        };
        stompClient.send("/pub/message/"+PUBLIC_ROOM_NO, {}, JSON.stringify(message));
    };

    const showMessage = (message) => {
        console.log("Direct Message: ", message);
        setMessages(prevMessages => [...prevMessages, message]);
    };

    return (
        <div>
            <h1>WebSocket Chat Example</h1>
            <div>
                {messages.map((message, index) => (
                    <div key={index}>Direct: {message.content}</div>
                ))}
            </div>
            <input type="text" id="message" placeholder="Type your message here..." />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import ChatDivComponent from './chat_div_component';

const URL = '//192.168.0.100:8080/chat';
// const URL = '//lionreport.pixeller.net/chat';
const PUBLIC_ROOM_NO = '1';

const Chat = ({openType}) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const user = jwtDecode(sessionStorage.getItem('user') );

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
                        // 전체 메시지 경로 구독
                        client.subscribe(`/sub/message/`+PUBLIC_ROOM_NO, (message) => {
                            // alert('메세지왔다. 받아라.');
                            showMessage(JSON.parse(message.body));
                        });

                        client.send(`/pub/message/1/enter`);
                        client.subscribe(`/sub/message/1/enter`, (res) => {
                            // console.log(res);
                            showMessage(JSON.parse(res.body));
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

    if( openType === 'public' ) {
    }else if ( openType === 'private' ) {
        stompClient.subscribe(`/sub/chat-room/`+user.uid+'?page='+page+'&size='+size, (res) => {
            console.log(JSON.parse(res.body));
        });
    }
        
    return (
        <>
            <ChatDivComponent stompClient={stompClient} messages={messages} />
        </>
    );
};

export default Chat;
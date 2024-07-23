import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import ChatDivComponentDirect from './chat_div_component_direct';

const Chat = ({stompClient, roomIdFirstSend, setRoomIdFirstSend}) => {
    const [messages, setMessages] = useState([]);
    const [chatList, setChatList] = useState([]);
    const user = jwtDecode(sessionStorage.getItem('user') );

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const [chatPage, setChatPage] = useState(0);
    const [chatsize, setChatSize] = useState(10);

    const [chatRoomId, setChatRoomId] = useState(roomIdFirstSend);

    useEffect(() => {
        if (stompClient) {
            const subscribe = () => {
                // stompClient.send(`/sub/chat-room/${user.uid}?page=${page}&size=${size}`);
                stompClient.subscribe(`/sub/chat-room/${user.uid}`, (res) => {
                    console.log('TㅅT',res);
                    showChatList(JSON.parse(res.body));
                });
                stompClient.send(`/pub/chat-room/${user.uid}`,{},JSON.stringify({
                    page:page,
                    size:size,
                }));
            };

            subscribe();
        }
    }, [stompClient]);

    useEffect(() => {
        if(chatRoomId) {
            const subscribe = () => {
                stompClient.subscribe(`/sub/message/direct/${chatRoomId}`, (res) => {
                    console.log('ㅗVㅗ',res);
                    showMessage(JSON.parse(res.body));
                });
                stompClient.send(`/pub/message/direct/${chatRoomId}`,{},JSON.stringify({
                    page:chatPage,
                    size:chatsize,
                }));
            };
            subscribe();
        }
    }, [chatRoomId]);

    const showChatList = (cl) => {
        console.log('showChatList',cl);
        if(cl.content.length > 0){
            console.log(cl.content);
            if(cl.currentPage === 0) setChatList(cl.content);
            else if(cl.currentPage > 0) setChatList(prevList => [...cl.content, ...prevList]);
        }
        // setMessages(prevMessages => [...prevMessages, message]);
        console.log(chatList);
    }; 

    const joinRoomHandler = (e) => {
        const roomId = e.currentTarget.getAttribute('id');
        console.log(roomId);
        const splitedRoomId = roomId.split('-')[1];
        setChatRoomId(splitedRoomId);
        setRoomIdFirstSend(splitedRoomId);
        // setRoomListNavigater();
    }

    const setRoomListNavigater = () => {
        // document.querySelector('.chat-room.private').classList.add('room-list-navi');
    }
    
    const showMessage = (message) => {
        console.log(message);

        if(message.isBulk){
            if(message.content.length > 0){
                if(message.currentPage === 0 ) setMessages(message.content);
                else if(message.currentPage > 0){
                    const temp = [...messages];
                    for (let i = 0; i < message.content.length; i++) {
                        temp.push(message.content[i]);
                    }
                    setMessages(temp);
                }       
            }
        }else{
            setMessages(prevMessage => [...prevMessage,message]);
        }
            
    }; 
   

    return (
        <>
            {chatRoomId!=null? 
                <ChatDivComponentDirect stompClient={stompClient} messages={messages} private_room_no={chatRoomId} />
            :
            <div className="chatList">
                {chatList.map((chat, index) => (
                    <div key={index} id={`roomid-${chat.chatRoomId}`} className={`chatbox `} onClick={joinRoomHandler}>
                        <span className="chat-room-id">{chat.chatRoomId}</span>
                        <span className="chat-room-name">{chat.name}</span>
                        <span className="chat-room-message">{chat.message}</span>
                    </div>
                ))}
            </div>
            }
        </>
    );
};

export default Chat;
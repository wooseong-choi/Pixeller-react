import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const PUBLIC_ROOM_NO = '1';

const ChatDivComponent = ({stompClient,messages}) => {
    const [message, setMessage] = useState('');
    const messageEndRef = useRef(null);

    const user = jwtDecode(sessionStorage.getItem('user') );
    
    const handleMessageChange = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMessage(e.target.value);
    };
    const sendMessage = () => {
        // alert('메세지 보내기');
        // const msg = document.getElementById("message").value;
        if(message.trim() === "") return;
        const msg = {
            content: message,
        };
        try {
            stompClient.send("/pub/message/"+PUBLIC_ROOM_NO, {}, JSON.stringify(msg));

            // Phaser에 채팅 메시지 이벤트 생성
            window.dispatchEvent(new CustomEvent('chat-message', {
                detail: { sender: user.id, message: message }
            }));
        } catch (error) {
            console.error('Error sending message: ', error);
        }
        // document.getElementById("message").value = "";
        setMessage(''); // 메시지 전송 후 입력 필드 초기화
    };
    useEffect(() => {
        // 일단은 이걸로 했는데 나중에는 서버에서 채팅을 받아올거니 수정해야함
        if (messages.length > 0) {
            // if( document.getElementsByClassName('side-menu-chat')[0].classList.contains('open') ) {
                messageEndRef.current.scrollIntoView({ behavior: "smooth" });
            // }
        }
    },[messages]);

    return (
        <>
            <div>
                {messages.map((message, index) => (
                    <div key={index} className={`chat-info ${ message.senderName===user.id?"me":"" }`}>
                        <span className="chat-name">{message.senderName}</span>
                        <span className="chat-message">{message.message}</span>
                    </div>
                ))}
                <div ref={messageEndRef}></div>
            </div>
            <div className="inputBox">
                <div className="inputDiv">
                    <input type="text" id="message" placeholder="메세지를 입력하세요!"
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={(e)=>{ if( e.key === 'Enter') sendMessage(); }} />
                    <span className='sendBtn' onClick={sendMessage}></span>
                </div>                
            </div>
        </>
    );

}

export default ChatDivComponent;
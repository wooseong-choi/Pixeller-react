import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import UserInfo from '../components/UI/UserInfo';
import { axiosCRUDInstance } from '../api/axios';

const UserList = ({stompClient, chatUserList, setSendChatId}) => {

    console.log(chatUserList);

    const sendChat = (e) => {
        console.log(e.currentTarget.getAttribute('data-uid'));
        setSendChatId(e.currentTarget.getAttribute('data-uid'));
        


    };

    return (
        <>
            <div className="userList">
                {chatUserList.map((user, index) => (
                    <div key={index} onClick={sendChat} data-uid={user.uid} >
                        <UserInfo user={user.username} />
                    </div>
                ))}
            </div>
        </>
    );
};

export default UserList;
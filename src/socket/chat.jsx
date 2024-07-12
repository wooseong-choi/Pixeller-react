import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

// STOMP 클라이언트 설정
const URL = '//lionreport.pixeller.net/chat';
const PUBLIC_ROOM = '/sub/message/1';
const PRIVATE_ROOM_PREFIX = '/sub/message/private/';
const DIRECT_ROOM_PREFIX = '/sub/message/member/';
const CREATE_DIRECT_ROOM_URL = '/api/chat/direct';

const useStompClient = (token) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS(URL);
    const stompClient = new Client({
      headers:{'Authorization': `Bearer ${token}`},
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected');
        stompClient.subscribe(URL+PUBLIC_ROOM, (message) => {
          console.log('Public message received: ', JSON.parse(message.body));
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  return client;
};

const createDirectRoom = async (token, receiverId) => {
  try {
    const response = await axios.post(
        URL + CREATE_DIRECT_ROOM_URL,
      { receiverId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data.roomId;
  } catch (error) {
    console.error('Failed to create direct room: ', error);
  }
};

const useDirectChat = (client, token, receiverId, sender) => {
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const checkOrCreateRoom = async () => {
      const room = await createDirectRoom(token, receiverId);
      setRoomId(room);
      client.subscribe(`${DIRECT_ROOM_PREFIX}${receiverId}`, (message) => {
        console.log('Direct message received: ', JSON.parse(message.body));
      });
    };

    if (client) {
      checkOrCreateRoom();
    }
  }, [client, token, receiverId]);

  const sendDirectMessage = (content) => {
    if (roomId) {
      client.publish({
        destination: '/pub/message/direct',
        body: JSON.stringify({ sender, content, receiverId }),
      });
    }
  };

  return sendDirectMessage;
};

const usePrivateChat = (client, roomId) => {
  useEffect(() => {
    if (client && roomId) {
      client.subscribe(`${PRIVATE_ROOM_PREFIX}${roomId}`, (message) => {
        console.log('Private message received: ', JSON.parse(message.body));
      });

      return () => {
        client.unsubscribe(`${PRIVATE_ROOM_PREFIX}${roomId}`);
      };
    }
  }, [client, roomId]);
};

const Socket = ({ token, userId, receiverId }) => {
  const client = useStompClient(token);
//   const sendDirectMessage = useDirectChat(client, token, receiverId, userId);

//   const handleSendDirectMessage = () => {
//     const message = "Hello, this is a direct message!";
//     sendDirectMessage(message);
//   };

  return (
    <div>
      {/* <button onClick={handleSendDirectMessage}>Send Direct Message</button> */}
    </div>
  );
};

export default Socket;
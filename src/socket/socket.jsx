import * as StompJs from "@stomp/stompjs";

const clientData = new StompJs.Client({
  brokerURL: "ws://localhost:8080/ws",
  connectHeaders: {
    login: "",
  },
  debug: function (str) {
    console.log(str);
  },
});

// direct(1:1) 채팅
// 기존 1:1 채팅방 존재유무를 확인해야 한다.
// 기존 채팅방이 존재하지 않다면 : 새로운 direct room을 생성
// 기존 채팅방이 존재한다면 : 기존 채팅방을 사용한다.
// 메시지를 처음 보낼 때(publish) sender도 direct room을 구독한다.
// 그럼 메시지를 받는 사람은 해당 방을 언제 구독해야 하는가??? => 고민해보기!
// public 채팅
// public room에서 한 이야기는 모든 사용자가 볼 수 있다.
// public room은 해당 방에 참여했는지 여부가 필요없다.
// 해당 서비스에 들어오자마자 모든 사용자는 public room을 구독한다.
// private 채팅
// 유저가 private room에 참여한 시간동안의 채팅 내역만 확인할 수 있다.
// join time과 left time 사이의 내역만 확인할 수 있다.
// private room에 들어올 때 사용자는 private room을 구독한다.
// private room을 나갈 때 사용자는 private room 구독을 해제한다.

// public message
// public message 요청
// SEND
// destination:/pub/message/1
// content-length:63

// {"sender":"username","content":"내용이다","receiverId":"1"}
// public message 응답
// MESSAGE
// destination:/sub/message/1
// content-type:application/json
// subscription:sub-0
// message-id:2diko0dk-0
// content-length:63

// {"roomId":1,"senderName":"receiverId","message":"내용이다"}

// direct message
// direct message 요청
// SEND
// destination:/pub/message/direct
// content-length:63

// {"sender":"username","content":"내용이다","receiverId":"1"}
// direct message 응답
// MESSAGE
// destination:/sub/message/member/receiverId}
// content-type:application/json
// subscription:sub-0
// message-id:2diko0dk-0
// content-length:63

// {"roomId":1,"senderName":"receiverId","message":"내용이다"}


// direct room 생성
// direct room 생성 요청
// url : /api/chat/direct
// method : post

// header
// Authorization 에 token 값 필요

// {
//     receiverId : 1
// }
// direct room 생성 응답
// {
//   "isSuccess": true,
//   "code": "R-001",
//   "data": {
//     "roomId": 1
//   },
//   "message": "채팅방 생성을 성공했습니다."
// }

// Chatting Socket Connect
// http://{주소}/chat
// Http Header Authorization에 token을 담아서 보낸다.
// 이때 subscribe를 2개해야 한다.
// 개인 메시지 구독
// public 메시지 구독
// 개인 메시지 구독
// /sub/message/member/{receiverId}
// 응답을 json으로 변환 시 값은 아래와 같다.(JSON.parse(message.body))
// {
//   "MESSAGE": {
//     "destination": "/sub/message/member/receiverId}",
//     "content-type": "application/json",
//     "subscription": "sub-0",
//     "message-id": "2diko0dk-0",
//     "content-length": 63,
//     "payload": {
//       "roomId": 1,
//       "senderName": "receiverId",
//       "message": "내용이다"
//     }
//   }
// }
// public 메시지 구독
// /sub/message/1
// 응답을 json으로 변환 시 값은 아래와 같다.(JSON.parse(message.body))
// {
//   "MESSAGE": {
//     "destination": "/sub/message/member/receiverId}",
//     "content-type": "application/json",
//     "subscription": "sub-0",
//     "message-id": "2diko0dk-0",
//     "content-length": 63,
//     "payload": {
//       "roomId": 1,
//       "senderName": "receiverId",
//       "message": "내용이다"
//     }
//   }
// }
// public 메시지 전송
// /pub/message/1
// request 형식
// {
//   "content": "메시지 내용"
// }
// direct 메시지 전송
// /pub/message/direct
// request 형식
// {
//   "receiverId": 1,
//   "content": "메시지 내용"
// }

// Connect to the WebSocket server
clientData.activate();

// Function to send a public message
const sendPublicMessage = (content) => {
  const message = {
    content: content,
  };
  clientData.publish({
    destination: "/pub/message/1",
    body: JSON.stringify(message),
  });
};

// Function to send a direct message
const sendDirectMessage = (receiverId, content) => {
  const message = {
    receiverId: receiverId,
    content: content,
  };
  clientData.publish({
    destination: "/pub/message/direct",
    body: JSON.stringify(message),
  });
};

// Function to create a direct room
const createDirectRoom = (receiverId) => {
  const roomData = {
    receiverId: receiverId,
  };
  fetch("/api/chat/direct", {
    method: "POST",
    headers: {
      Authorization: "Bearer <TOKEN>", // Replace <TOKEN> with the actual token
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roomData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.isSuccess) {
        const roomId = data.data.roomId;
        console.log(`Direct room created with roomId: ${roomId}`);
      } else {
        console.error("Failed to create direct room");
      }
    })
    .catch((error) => {
      console.error("Error creating direct room:", error);
    });
};

// Subscribe to personal messages
const personalMessageSubscription = clientData.subscribe(
  `/sub/message/member/receiverId`,
  (message) => {
    const payload = JSON.parse(message.body).payload;
    const roomId = payload.roomId;
    const senderName = payload.senderName;
    const messageContent = payload.message;
    console.log(`Received personal message in roomId ${roomId} from ${senderName}: ${messageContent}`);
  }
);

// Subscribe to public messages
const publicMessageSubscription = clientData.subscribe(
  `/sub/message/1`,
  (message) => {
    const payload = JSON.parse(message.body).payload;
    const roomId = payload.roomId;
    const senderName = payload.senderName;
    const messageContent = payload.message;
    console.log(`Received public message in roomId ${roomId} from ${senderName}: ${messageContent}`);
  }
);

// Example usage
sendPublicMessage("Hello, everyone!");
sendDirectMessage(1, "Hi there!");
createDirectRoom(2);
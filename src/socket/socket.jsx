// import websocket from 'websocket';

// const socket = new WebSocket('ws://localhost:8080'); // Server End Point

// const data = {
//   type: 'login',
//   data: {
//     username: 'test',
//   }
// };

// // socket connection
// socket.addEventListener('open', (event) => {
//   socket.send(data);
// });

// // socket message
// socket.addEventListener('message', (event) => {
//   console.log('Message from server ', event.data);
// });

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

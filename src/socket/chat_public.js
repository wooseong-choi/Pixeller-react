import { Client } from '@stomp/stompjs';

export function setupChatConnection() {
    const socket = new SockJS(URL);
    const client = Stomp.over(socket);
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

    client.activate();
    return client;
}

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
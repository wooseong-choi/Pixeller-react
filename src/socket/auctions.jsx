import React, { useEffect } from "react";
import { io } from "socket.io-client";

const Auction = (auctionId, productId, setMaxBidPrice, setText) => {
  // const URL = "ws://localhost:3333/auction";
  const URL = "ws://api.pixeller.net/auction";
  const token = sessionStorage.getItem("user");
  const username = sessionStorage.getItem("username");

  const socket = io(URL, {
    // autoConnect: false,
    transportOptions: {
      polling: {
        extraHeaders: {
          Authentication: "Bearer " + token,
        },
      },
      auth: {
        token: token,
      },
    },
  });

  useEffect(() => {
    socket.emit("join", { username: username, room: auctionId });
    console.log("DEBUG: Auction 서버에 join 실행", auctionId, username);
    return () => {
      socket.emit("leave", { username: username });
      socket.disconnect();
    };
  }, []);

  socket.on("connect", () => {
    console.log("DEBUG: Connected to AUCTION server");
  });

  socket.on("disconnect", () => {
    socket.emit("leave", { username: username });
    console.log("Disconnected from server");
  });

  socket.on("message", (data) => {
    console.log("DEBUG: auction.jsx: message event received");
    console.log(data);

    switch (data.type) {
      case "bid":
        console.log("Bid received");
        setMaxBidPrice(data.bid_price);
        break;
      case "message":
        console.log("Message received");
        break;
      case "join":
        console.log("User joined");
        console.log(data.message);
        break;
      case "leave":
        console.log("User left");
        console.log(data.message);
        break;
      case "start":
        console.log("Auction started");
        console.log(data.message);
        setText("경매 중");
        break;
      case "end":
        console.log("Auction ended");
        console.log(data.message);
        alert(
          `경매가 종료되었습니다. 낙찰자: ${data.winner}, 낙찰가: ${data.bid_price}`
        );
        break;
      default:
        break;
    }
  });

  return socket;
};
export default Auction;

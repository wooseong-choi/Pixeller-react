import React, { useEffect } from "react";
import { io } from "socket.io-client";

const URL = "http://localhost:3333/auction";

const Auction = (auctionId, productId) => {
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
    socket.emit("join", { payload: { username: username, room: auctionId } });

    return () => {
      socket.emit("leave", { payload: { username: username } });
      socket.disconnect();
    };
  }, []);

  socket.on("connect", () => {
    console.log("*****Connected to server");
  });

  socket.on("disconnect", () => {
    socket.emit("leave", { payload: { username: username } });
    console.log("Disconnected from server");
  });

  socket.on("message", (data) => {
    switch (data.type) {
      case "bid":
        console.log("Bid received");
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
        break;
      case "end":
        console.log("Auction ended");
        console.log(data.message);
        break;
      default:
        break;
    }
  });

  return <></>;
};
export default Auction;

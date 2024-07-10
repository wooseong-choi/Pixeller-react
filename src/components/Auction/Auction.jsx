import React from "react";
import { useState } from "react";
import "./Auction.css";

const Auction = (isSeller) => {
  const [text, setText] = useState("경매 시작");

  const startAuction = (e) => {
    e.preventDefault();

    if (isSeller) {
      console.log("start auction");
      setText("경매 중");
    }
  };
  const user = sessionStorage.getItem("user");

  return (
    <>
      <div className="auction-wrapper">
        <div className="auction-container">
          <div className="auction-container-left">
            <div>
              <button className="btn-auction-start" onClick={startAuction}>
                {text}
              </button>
              <div className="auction-seller-video-container">
                <div className="auction-seller-video-icon"></div>
                <div className="auction-seller-video-name"></div>
              </div>
              <div className="user-info">
                <img src="svg/user-icon.svg" alt="User Icon" className="user-icon" />
                <span className="username">{user.username}</span>
                <span className="status">활동중</span>
                <span className="status-dot on"></span>
              </div>
            </div>
          </div>
          <div className="auction-container-right">
            <div className="auction-buyer-video-container">
              <div className="auction-buyer-video-icon"></div>
              <div className="auction-buyer-video-name"></div>
            </div>
            <div className="auction-buyer-video-container">
              <div className="auction-buyer-video-icon"></div>
              <div className="auction-buyer-video-name"></div>
            </div>
            <div className="auction-buyer-video-container">
              <div className="auction-buyer-video-icon"></div>
              <div className="auction-buyer-video-name"></div>
            </div>
            <div className="auction-buyer-video-container">
              <div className="auction-buyer-video-icon"></div>
              <div className="auction-buyer-video-name"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auction;

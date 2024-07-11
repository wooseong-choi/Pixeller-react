import React from "react";
import { useState } from "react";
import "./Auction.css";
import UserInfo from "../UI/UserInfo";

const Auction = ( {handleClose, auctionProduct} ) => {
  const [text, setText] = useState("경매 시작");

  const startAuction = (e) => {
    e.preventDefault();

    // if (isSeller) {
    //   console.log("start auction");
    //   setText("경매 중");
    // }
  };
  const user = sessionStorage.getItem("user");

  return (
    <>
      <div className="auction-wrapper">
        <div className="auction-container">
          <div className="auction-container-left">
            <div>
              <div className="auction-product">
                <button className="btn-auction-start" onClick={startAuction}>
                  {text}
                </button>
                <p className="bid-price"><img src="svg/Dollar.svg"/>현재 가격 <span className="rtp"></span></p>
              </div>
              <div className="auction-seller-video-container">
                <div className="auction-seller-video-icon"></div>
                <div className="auction-seller-video-name"></div>
              </div>
              <UserInfo user={user}/>
            </div>
          </div>
          <div className="auction-container-right">
            <div>

              <div className="auction-buyer-video-container">
                <div className="auction-buyer-video-icon"></div>
                <div className="auction-buyer-video-name"></div>
              </div>
              <UserInfo user={user}/>
            </div>
            <div>

              <div className="auction-buyer-video-container">
                <div className="auction-buyer-video-icon"></div>
                <div className="auction-buyer-video-name"></div>
              </div>
              <UserInfo user={user}/>
            </div>
            <div>

              <div className="auction-buyer-video-container">
                <div className="auction-buyer-video-icon"></div>
                <div className="auction-buyer-video-name"></div>
              </div>
              <UserInfo user={user}/>
            </div>
            <div>

              <div className="auction-buyer-video-container">
                <div className="auction-buyer-video-icon"></div>
                <div className="auction-buyer-video-name"></div>
              </div>
              <UserInfo user={user}/>
            </div>
          </div>
          <div>
            <button
                className="close-button"
                onClick={handleClose}
              >
                <img src="svg/exit.svg" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auction;

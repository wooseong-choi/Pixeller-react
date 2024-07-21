import React from "react";
import "../../static/css/AlertAuction.css";

const AlertAuction = ({ auctionStart, auctionClose, product }) => {
  const handleClose = () => {
    auctionClose(false);
  };

  return (
    <>
      <div className="alert-auction">
        <div>
          <img
            src="./svg/attention.svg"
            alt=""
            className="alert-auction-bell"
          />
        </div>
        <div className="auction-alert-container">
          <div className="alert-text">
            <h2>경매 시작</h2>
            <p>{product?.name}의 경매가 시작됩니다.</p>
          </div>
          <div className="alert-buttons">
            <button className="btn-close" onClick={handleClose}>
              취소하기
            </button>
            <button className="btn-start" onClick={auctionStart}>
              시작하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertAuction;

import React from "react";
import "../../static/css/AlertAuction.css";

const AlertAuction = (handlerStart, handleClose) => {
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
            <p>해당 물건으로 경매를 시작하실건가요?</p>
          </div>
          <div className="alert-buttons">
            <button className="btn-close" onClick={handleClose}>
              취소하기
            </button>
            <button className="btn-start" onClick={handlerStart}>
              시작하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AlertAuction;

import React, { useState, useEffect } from "react";
import "./Auction.css";
import UserInfo from "../UI/UserInfo";
import useSpeechRecognition from './useSpeechRecognition';
import { analyzeBid, convertToWon } from './bidAnalyzer';

const Auction = ({ handleClose, auctionProduct }) => {
  const [text, setText] = useState("경매 시작");
  const initialPrice = 5000; // 초기 금액 설정
  
  const {
    listening,
    lastResult,
    confidence,
    currentPrice,
    handleStart,
    handleStop,
    resetTranscript,
    resetPrice,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition(initialPrice);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [handleClose]);

  const startAuction = (e) => {
    e.preventDefault();
    setText("경매 중");
    handleStart();
  };

  const stopAuction = (e) => {
    e.preventDefault();
    setText("경매 종료");
    handleStop();
  };

  const user = sessionStorage.getItem("user");

  // 금액을 올바른 형식으로 표시하는 함수
  const formatAmount = (amount) => {
    const wonAmount = typeof amount === 'number' ? amount : convertToWon(amount);
    return wonAmount.toLocaleString() + '원';
  };

  const bidAnalysis = analyzeBid(lastResult);

  if (!browserSupportsSpeechRecognition) {
    return <span>크롬을 사용해 주세요</span>;
  }

  return (
    <>
      <div className="auction-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="auction-container">
          <div className="auction-container-left">
            <div>
              <div className="auction-product">
                <button className="btn-auction-start" onClick={text === "경매 시작" ? startAuction : stopAuction}>
                  {text}
                </button>
                <p className="bid-price"><img src="svg/Dollar.svg"/>현재 가격 <span className="rtp">{formatAmount(currentPrice)}</span></p>
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

// src/pages/Main.jsx
import React, { useEffect, useState } from "react";
import GameApp from "../games/GameApp";
import Bottom from "../components/UI/Bottom.jsx";
import List from "../components/List";
import VideoCanvas from "./../components/OpenVidu/VideoCanvas.tsx";
import ProductDetail from "../components/Boards/ProductDetail.jsx";
import ProductCreate from "../components/Boards/ProductCreate.jsx";
import "./Main.css";
import Auction from "../components/Auction/Auction.jsx";

const Main = ({ isListOpen, setIsListOpen }) => {
  const userName = sessionStorage.getItem("username");
  const auctionRoomId = "localRooms";
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  // const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isViduOpen, setIsViduOpen] = useState(false);
  const [isProductDetailOpen, setProductDetailOpen] = useState(false);
  const [isProductCreateOpen, setProductCreateOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [totalProductCounts, setTotalProductCounts] = useState(0);
  const [isCamOpen, setIsCamOpen] = useState(false);
  const [isMicOpen, setIsMicOpen] = useState(false);
  // 화상회의 모달
  const [auctionProduct, setAuctionProductState] = useState(null);
  // 화상회의 모달끗
  useEffect(() => {
    if (isOpen || isChatOpen) {
      if (!isListOpen) setIsListOpen(true);
    } else {
      if (isListOpen) setIsListOpen(false);
    }
  }, [isOpen, isChatOpen]);

  const startVideoStream = (e) => {
    e.preventDefault();
    console.log("startVideoStream");
    isViduOpen ? setIsViduOpen(false) : setIsViduOpen(true);
  };

  const openPDModal = (product) => {
    setProductDetailOpen(true);
    setProductId(product);
  };

  const closePDModal = () => {
    setProductDetailOpen(false);
  };

  const openPCModal = () => {
    setProductCreateOpen(true);
  };

  const closePCModal = () => {
    setProductCreateOpen(false);
  };


  const closeAuctionModal = () => {
    const auctionContainer =document.getElementsByClassName("auction-wrapper");
    if(auctionContainer.length > 0)
      auctionContainer[0].classList.remove("on");
  };

  const setAuctionProduct = (product) => {
    setAuctionProductState(product);
    const auctionContainer =document.getElementsByClassName("auction-wrapper");
    if(auctionContainer.length > 0)
      auctionContainer[0].classList.add("on");
  }

  const toggleMIC = () => {
    setIsMicOpen((prev) => !prev);
    isMicOpen ? console.log("MIC ON") : console.log("MIC OFF");
  };

  const toggleCam = () => {
    setIsCamOpen((prev) => !prev);
    isCamOpen ? console.log("CAM ON") : console.log("CAM OFF");
  };

  useEffect(() => {
    window.addEventListener("start-video", startVideoStream);
  });

  return (
    <>
      <div>
        <div id="GameApp" className="flex">
          <div id="canvas-parent" className="flex main">
            <div className={`cam-div ${isViduOpen ? "active" : ""}`}>
              <button
                className="video-button"
                onClick={startVideoStream}
              ></button>
              {isViduOpen ? (
                <VideoCanvas
                  userName={userName}
                  auctionRoomId={auctionRoomId}
                />
              ) : null}
            </div>
            <div className="Modals">
              {isProductDetailOpen ? (
                <div className="modal-background">
                  <div className="modal-content">
                    <ProductDetail
                      productId={productId}
                      handleClose={closePDModal}
                      setAuctionProduct={setAuctionProduct}
                    />
                  </div>
                </div>
              ) : null}
              {isProductCreateOpen ? (
                <div className="modal-background">
                  <div className="modal-content">
                    <ProductCreate handleClose={closePCModal} />
                  </div>
                </div>
              ) : null}
              <Auction 
                handleClose={closeAuctionModal} 
                auctionProduct={auctionProduct}
              />
            </div>
            <div id="gameMain" className="game">
              <GameApp />
            </div>
            <div className={`lists ${isListOpen ? "open" : ""}`}>
              <List
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                // isNotiOpen={isNotiOpen}
                // setIsNotiOpen={setIsNotiOpen}
                openPDModal={openPDModal}
                openPCModal={openPCModal}
                setTotalProductCounts={setTotalProductCounts}
              />
            </div>
          </div>
          <Bottom
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            // isNotiOpen={isNotiOpen}
            // setIsNotiOpen={setIsNotiOpen}
            totalProductCounts={totalProductCounts}
            setIsMicOpen={toggleMIC}
            setIsCamOpen={toggleCam}
          />
        </div>
      </div>
    </>
  );
};

export default Main;

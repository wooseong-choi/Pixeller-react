// src/pages/Main.jsx
import React, { useEffect, useState, useRef } from "react";
import GameApp from "../games/GameApp";
import Bottom from "../components/UI/Bottom.jsx";
import List from "../components/List";
import VideoCanvas from "./../components/OpenVidu/VideoCanvas.tsx";
import ProductDetail from "../components/Boards/ProductDetail.jsx";
import ProductCreate from "../components/Boards/ProductCreate.jsx";
import "./Main.css";
import Auction from "../components/Auction/Auction.jsx";
import Auction_OpenVidu from "../components/Auction/Auction_seller.tsx";
// import Auction_OpenVidu from "../components/Auction/Auctions.tsx";

const Main = ({ isListOpen, setIsListOpen }) => {
  const userName = sessionStorage.getItem("username");
  const auctionRoomId = "localRooms";
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isViduOpen, setIsViduOpen] = useState(false);
  const [isProductDetailOpen, setProductDetailOpen] = useState(false);
  const [isProductCreateOpen, setProductCreateOpen] = useState(false);
  const [productId, setProductId] = useState(null);
  const [totalProductCounts, setTotalProductCounts] = useState(0);
  const [isCamOpen, setIsCamOpen] = useState(false);
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [auctionProduct, setAuctionProductState] = useState(null);

  const OpenViduRef = useRef(null);

  useEffect(() => {
    if (isOpen || isChatOpen) {
      if (!isListOpen) setIsListOpen(true);
    } else {
      if (isListOpen) setIsListOpen(false);
    }
  }, [isOpen, isChatOpen]);

  const startVideoStream = async (e) => {
    e.preventDefault();
    if (isViduOpen && OpenViduRef.current) {
      OpenViduRef.current.leaveRoom();
    }
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
    setIsAuctionOpen(false);
  };

  const setAuctionProduct = (product) => {
    console.log("main product: ", product);
    setAuctionProductState(product);
  };

  const toggleMIC = () => {
    setIsMicOpen((prev) => !prev);
    if (OpenViduRef.current) OpenViduRef.current.micController(isMicOpen);
  };

  const toggleCam = () => {
    setIsCamOpen((prev) => !prev);
    if (OpenViduRef.current) OpenViduRef.current.camController(isCamOpen);
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
              {/* {isViduOpen ? (
                <VideoCanvas
                  userName={userName}
                  auctionRoomId={auctionRoomId}
                  isMicOpen={isMicOpen}
                  isCamOpen={isCamOpen}
                  ref={OpenViduRef}
                />
              ) : null} */}
            </div>
            <div className="Modals">
              <div>
                {isProductDetailOpen ? (
                  <div className="modal-background" onClick={closePDModal}>
                    <div
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ProductDetail
                        productId={productId}
                        handleClose={closePDModal}
                        setAuctionProduct={setAuctionProduct}
                        setIsAuctionOpen={setIsAuctionOpen}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
              <div>
                {isProductCreateOpen ? (
                  <div className="modal-background" onClick={closePCModal}>
                    <div
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ProductCreate handleClose={closePCModal} />
                    </div>
                  </div>
                ) : null}
              </div>
              <div>
                {isAuctionOpen ? (
                  <Auction_OpenVidu
                    isSeller={true}
                    auctionRoomId={auctionProduct.id}
                    handleClose={closeAuctionModal}
                    auctionProduct={auctionProduct.id}
                    userName={userName}
                    auctionPrice={auctionProduct.price}
                    ref={OpenViduRef}
                  />
                ) : null}
              </div>
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
            totalProductCounts={totalProductCounts}
            isMicOpen={isMicOpen}
            setIsMicOpen={toggleMIC}
            isCamOpen={isCamOpen}
            setIsCamOpen={toggleCam}
          />
        </div>
      </div>
    </>
  );
};

export default Main;

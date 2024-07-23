// src/pages/Main.jsx
import React, { useEffect, useState, useRef } from "react";
import GameApp from "../games/GameApp";
import Bottom from "../components/UI/Bottom.jsx";
import List from "../components/List";
import ProductDetail from "../components/Boards/ProductDetail.jsx";
import ProductCreate from "../components/Boards/ProductCreate.jsx";
import "./Main.css";
import "../static/css/VideoComponent.css";
import VideoCanvas from "../components/OpenVidu/VideoCanvas.tsx";
import Auction_new from "../components/Auction/Auction_new.tsx";
import BottomMenu from "../components/UI/BottomMenu.jsx";
import ProductBox from "../components/UI/ProductBox.jsx";
import AlertAuction from "../components/alert/AlertAuction.jsx";
import SellerProducts from "../components/UI/SellerProducts.jsx";
import ChatBox from "../components/UI/ChatBox.jsx";
import { jwtDecode } from "jwt-decode";
import { Room } from "livekit-client";

const Main = ({ isListOpen, setIsListOpen }) => {
  const userName = sessionStorage.getItem("username");
  // const userName = jwtDecode(sessionStorage.getItem("user")).username;

  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isViduOpen, setIsViduOpen] = useState(false);
  const [isProductDetailOpen, setProductDetailOpen] = useState(false);
  const [isProductCreateOpen, setProductCreateOpen] = useState(false);
  const [totalProductCounts, setTotalProductCounts] = useState(0);
  const [productId, setProductId] = useState(null);
  const [isCamOpen, setIsCamOpen] = useState(false);
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [auctionProduct, setAuctionProductState] = useState(null);
  const [isPLListOpen, setIsPLListOpen] = useState(false);
  const [isAuctionAlert, setIsAuctionAlert] = useState(false);
  const [isSellector, setIsSellector] = useState(false);
  const [roomIdFirstSend, setRoomIdFirstSend] = useState(null);

  const [room, setRoom] = useState(undefined); // Room 객체 화상 회의에 대한 정보를 담고 있는 객체

  const AuctionVidRef = useRef(null);
  const MainVidRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Nanum+Gothic&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    console.log("room", room);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (isOpen || isChatOpen) {
      if (!isListOpen) setIsListOpen(true);
    } else {
      if (isListOpen) setIsListOpen(false);
    }
  }, [isOpen, isChatOpen]);

  const startVideoStream = async (e) => {
    e.preventDefault();
    console.log("debug: ", isViduOpen);
    console.log("room: ", room);
    if (isViduOpen) {
      if (MainVidRef.current) MainVidRef.current.leaveRoom();
      setIsViduOpen(false);
    } else {
      setIsViduOpen(true);
    }
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
    if (AuctionVidRef.current) AuctionVidRef.current.leaveRoom();
  };

  const setAuctionProduct = (product) => {
    setAuctionProductState(product);
  };

  const toggleMIC = () => {
    setIsMicOpen((prev) => !prev);
    if (AuctionVidRef.current) AuctionVidRef.current.micController(isMicOpen);
    if (MainVidRef.current) MainVidRef.current.micController(isMicOpen);
  };

  const toggleCam = () => {
    setIsCamOpen((prev) => !prev);
    if (AuctionVidRef.current) AuctionVidRef.current.camController(isCamOpen);
    if (MainVidRef.current) MainVidRef.current.camController(isCamOpen);
  };

  const closePLModal = () => {
    setIsPLListOpen(false);
  };

  const openPLModal = () => {
    setIsPLListOpen(true);
  };

  const closeAlert = () => {
    setIsAuctionAlert(false);
  };

  const startAuction = () => {
    // setIsAuctionAlert(true);
    setIsSellector(true);
  };

  useEffect(() => {
    window.addEventListener("start-video", startVideoStream);
    window.addEventListener("start-auction", startAuction);
  }, []);

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
                  auctionRoomId={"wholeMap"}
                  isMicOpen={isMicOpen}
                  isCamOpen={isCamOpen}
                  ref={MainVidRef}
                  setRoom={setRoom}
                  Room={room}
                />
              ) : null}
            </div>
            <div className="Modals">
              <div>
                {isSellector ? (
                  <div
                    className="modal-background auction-alert"
                    onClick={setIsSellector}
                  >
                    <div
                      className="modal-alert-wrapper"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SellerProducts
                        sellerOpen={setIsSellector}
                        sellectProduct={setAuctionProduct}
                        alertAuction={setIsAuctionAlert}
                      />
                    </div>
                  </div>
                ) : null}
                {isAuctionAlert ? (
                  <div
                    className="modal-background auction-alert"
                    onClick={closeAlert}
                  >
                    <div
                      className="modal-alert-wrapper"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <AlertAuction
                        product={auctionProduct}
                        auctionStart={setIsAuctionOpen}
                        auctionClose={closeAlert}
                      />
                    </div>
                  </div>
                ) : null}
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
                {isAuctionOpen && auctionProduct ? (
                  <Auction_new
                    handleClose={closeAuctionModal}
                    userName={userName}
                    isSeller={true}
                    auctionRoomId={auctionProduct.productId}
                    auctionProduct={auctionProduct.productId}
                    auctionPrice={auctionProduct.price}
                    ref={AuctionVidRef}
                    setAuctionRoom={setRoom}
                    AuctionRoom={room}
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
            <div className="bottom_menu_div ">
              <BottomMenu
                closePLModal={closePLModal}
                openPLModal={openPLModal}
                setIsCamOpen={toggleCam}
                setIsMicOpen={toggleMIC}
              />
            </div>
            <div className="product_list_div">
              {isPLListOpen ? (
                <ProductBox
                  closePLModal={closePLModal}
                  setRoomIdFirstSend={setRoomIdFirstSend}
                />
              ) : null}
            </div>
            <div className="chat_list_div">
              <ChatBox
                roomIdFirstSend={roomIdFirstSend}
                setRoomIdFirstSend={setRoomIdFirstSend}
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
            setIsAuctionAlert={setIsAuctionAlert}
          />
        </div>
      </div>
    </>
  );
};

export default Main;

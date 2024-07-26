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
import Alert from "../components/UI/chatalert/Alert.jsx";

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

  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = () => {
    // setAlertMessage('This is an alert message!');
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000); // 3초 후에 alert를 숨깁니다.
  };

  useEffect(() => {
    if (alertMessage != null) {
      showAlert();
    }
  }, [alertMessage]);

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
    // console.log("startVideoStream", isViduOpen);
    
    const detail = e.detail;
    const isViduDivOpen = document.querySelector(".cam-div");
    
    if(detail.method === 'join' && isViduDivOpen) {
      return false;
    }
    
    setIsViduOpen((prev) => !prev);
    
    // toggleCamDiv();
    if (MainVidRef.current) await MainVidRef.current.leaveRoom();
    console.log("end of startVideoStream", isViduOpen);
  };

  const endVideoStream = async (e) => {
    e.preventDefault();
    if (MainVidRef.current) await MainVidRef.current.leaveRoom();
    // console.log("endVideoStream", isViduOpen);
    setIsViduOpen(false);
    // toggleCamDiv();
    // console.log("end of endVideoStream", isViduOpen);
  };

  const toggleCamDiv = () => {
    const camdiv = document.querySelector(".cam-div");
    if (camdiv.classList.contains("active")) {
      camdiv.classList.remove("active");
    } else {
      camdiv.classList.add("active");
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
    window.addEventListener("end-video", endVideoStream);
    
    return () => {
      window.removeEventListener("start-video", startVideoStream);
      window.removeEventListener("start-auction", startAuction);
      window.removeEventListener("end-video", endVideoStream);
    };
  }, []);

  return (
    <>
      <div>
        <div id="GameApp" className="flex">
          <div id="canvas-parent" className="flex main">
            {/* <div className={"cam-div " + isViduOpen ? "active" : ""}> */}
            {isViduOpen && !isAuctionOpen ? (
              <div className={`cam-div active`}>
                <VideoCanvas
                  userName={userName}
                  auctionRoomId={"wholeMap"}
                  isMicOpen={isMicOpen}
                  isCamOpen={isCamOpen}
                  ref={MainVidRef}
                  setRoom={setRoom}
                  Room={room}
                />
              </div>
            ) : null}
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
                    isSeller={false}
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
            {/* <div className={`lists ${isListOpen ? "open" : ""}`}>
              <List
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                openPDModal={openPDModal}
                openPCModal={openPCModal}
                setTotalProductCounts={setTotalProductCounts}
              />
            </div> */}
            <div className="bottom_menu_div ">
              <BottomMenu
                closePLModal={closePLModal}
                openPLModal={openPLModal}
                setIsCamOpen={toggleCam}
                setIsMicOpen={toggleMIC}
                isAuctionOpen={isAuctionOpen}
              />
            </div>
            <div className="product_list_div">
              {isPLListOpen && !isAuctionOpen ? (
                <ProductBox
                  closePLModal={closePLModal}
                  setRoomIdFirstSend={setRoomIdFirstSend}
                  setAuctionProduct={setAuctionProduct}
                  setIsAuctionOpen={setIsAuctionOpen}
                />
              ) : null}
            </div>
            <div className="chat_list_div">
              <ChatBox
                roomIdFirstSend={roomIdFirstSend}
                setRoomIdFirstSend={setRoomIdFirstSend}
                setAlertMessage={setAlertMessage}
              />
              {alertMessage != null ? (
                <Alert
                  message={alertMessage.message}
                  senderName={alertMessage.senderName}
                  duration={3000}
                  roomId={alertMessage.roomId}
                  setRoomIdFirstSend={setRoomIdFirstSend}
                />
              ) : null}
            </div>
          </div>
          {/* <Bottom
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
            setAuctionProduct={setAuctionProduct}
          /> */}
        </div>
      </div>
    </>
  );
};

export default Main;

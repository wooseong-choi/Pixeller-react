// src/pages/Main.jsx
import React, { useEffect, useState, useRef } from "react";
import GameApp from "../games/GameApp";
import Bottom from "../components/UI/Bottom.jsx";
import List from "../components/List";
import ProductDetail from "../components/Boards/ProductDetail.jsx";
import ProductCreate from "../components/Boards/ProductCreate.jsx";
import "./Main.css";
// import { gsap } from "gsap/gsap-core";
// import Auction from "../components/Auction/Auction.jsx";
// import Auction_OpenVidu from "../components/Auction/Auction_seller.tsx";
import VideoCanvas from "../components/OpenVidu/VideoCanvas.tsx";
import Auction_new from "../components/Auction/Auction_new.tsx";
import "../static/css/VideoComponent.css";
import BottomMenu from "../components/UI/BottomMenu.jsx";
import ProductBox from "../components/UI/ProductBox.jsx";
import AlertAuction from "../components/alert/AlertAuction.jsx";
import SellerProducts from "../components/UI/SellerProducts.jsx";
import ChatBox from "../components/UI/ChatBox.jsx";
import Alert from "../components/UI/chatalert/Alert.jsx";

const Main = ({ isListOpen, setIsListOpen }) => {
  const userName = sessionStorage.getItem("username");
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
  const [isPLListOpen, setIsPLListOpen] = useState(false);
  const [isAuctionAlert, setIsAuctionAlert] = useState(false);
  const [isSellector, setIsSellector] = useState(false);

  const [roomIdFirstSend, setRoomIdFirstSend] = useState(null);

  const OpenViduRef = useRef(null);
  const MainVidRef = useRef(null);

  
  const [alertMessage, setAlertMessage] = useState(null);

  const showAlert = () => {
      // setAlertMessage('This is an alert message!');
      setTimeout(() => {
          setAlertMessage(null);
      }, 3000); // 3초 후에 alert를 숨깁니다.
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
    console.log("이벤트 발생");
    e.preventDefault();
    if (isViduOpen && MainVidRef.current) {
      MainVidRef.current.leaveRoom();
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
                  auctionRoomId={"wholeMap"}
                  isMicOpen={isMicOpen}
                  isCamOpen={isCamOpen}
                  ref={MainVidRef}
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
                {isAuctionOpen ? (
                  <Auction_new
                    handleClose={closeAuctionModal}
                    isSeller={true}
                    userName={userName}
                    auctionRoomId={auctionProduct.productId}
                    auctionProduct={auctionProduct.productId}
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
            <div className="bottom_menu_div ">
              <BottomMenu
                closePLModal={closePLModal}
                openPLModal={openPLModal}
                setIsCamOpen={toggleCam}
                setIsMicOpen={toggleMIC}
              />
            </div>
            <div className="product_list_div">
              {isPLListOpen ? <ProductBox closePLModal={closePLModal} setRoomIdFirstSend={setRoomIdFirstSend} /> : null}
            </div>
            <div className="chat_list_div">
              <ChatBox roomIdFirstSend={roomIdFirstSend} setRoomIdFirstSend={setRoomIdFirstSend} setAlertMessage={setAlertMessage}/>
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
          {alertMessage != null ? 
          <Alert message={alertMessage.message} senderName={alertMessage.senderName} duration={3000} roomId={alertMessage.roomId} setRoomIdFirstSend={setRoomIdFirstSend} />
          :null}
        </div>
      </div>
    </>
  );
};

export default Main;

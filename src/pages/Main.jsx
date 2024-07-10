// src/pages/Main.jsx
import React, { useEffect, useState } from "react";
import GameApp from "../games/GameApp";
import Bottom from "../components/UI/Bottom.jsx";
import List from "../components/List";
import VideoCanvas from "./../components/OpenVidu/VideoCanvas.tsx";
import ProductDetail from "../components/Boards/ProductDetail.jsx";
import ProductCreate from "../components/Boards/ProductCreate.jsx";
import "./Main.css";

const Main = ({ isListOpen, setIsListOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isProductDetailOpen, setProductDetailOpen] = useState(false);
  const [isProductCreateOpen, setProductCreateOpen] = useState(false);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    if (isOpen || isChatOpen || isNotiOpen) {
      if (!isListOpen) setIsListOpen(true);
    } else {
      if (isListOpen) setIsListOpen(false);
    }
  }, [isOpen, isChatOpen, isNotiOpen]);

  const startVideoStream = (e) => {
    e.preventDefault();
    console.log("startVideoStream");
    isVideoOpen ? setIsVideoOpen(false) : setIsVideoOpen(true);
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

  useEffect(() => {
    window.addEventListener("start-video", startVideoStream);
  });

  return (
    <>
      <div>
        <div id="GameApp" className="flex">
          <div id="canvas-parent" className="flex main">
            <div className={`cam-div ${isVideoOpen ? "active" : ""}`}>
              <button
                className="video-button"
                onClick={startVideoStream}
              ></button>
              {isVideoOpen ? <VideoCanvas /> : null}
            </div>
            <div className="Modals">
              {isProductDetailOpen ? (
                <div className="modal-background">
                  <div className="modal-content">
                    <ProductDetail
                      productId={productId}
                      handleClose={closePDModal}
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
                isNotiOpen={isNotiOpen}
                setIsNotiOpen={setIsNotiOpen}
                openPDModal={openPDModal}
                openPCModal={openPCModal}
              />
            </div>
          </div>
          <Bottom
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isChatOpen={isChatOpen}
            setIsChatOpen={setIsChatOpen}
            isNotiOpen={isNotiOpen}
            setIsNotiOpen={setIsNotiOpen}
          />
        </div>
      </div>
    </>
  );
};

export default Main;

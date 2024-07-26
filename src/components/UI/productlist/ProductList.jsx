// SidebarSection.js
import React, { useEffect, useRef, useState } from "react";
// import Swiper JS
import Swiper from 'swiper/bundle';
// import Swiper styles
import '../../../static/css/swiper-bundle.min.css';
import { axiosCRUDInstance } from "../../../api/axios.jsx";

const ProductList = ({products, setRoomIdFirstSend, setAuctionProduct, setIsAuctionOpen, goProductId}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Throttle function to limit the execution of the event handler
  const throttle = (func, delay) => {
    let lastCall = 0;
    return (...args) => {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        lastCall = now;
        return func(...args);
      }
    };
  };

  useEffect(() => {
    const handleSwipe = throttle((e) => {
      if (e.deltaY > 0) {
        // 스와이프 아래로
        setSelectedIndex((prevIndex) =>
          prevIndex < products.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else {
        // 스와이프 위로
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      }
    },300); // 1 second delay

    window.addEventListener("wheel", handleSwipe);

    if (products.length > 0) {
        const swiper = new Swiper('.product-bottom .swiper-container', {
            navigation: {
                nextEl: ".product-bottom .swiper-button-next",
                prevEl: ".product-bottom .swiper-button-prev",
            },
        });
    }
    return () => {
      window.removeEventListener("wheel", handleSwipe);
    };
  }, [products]);

  const comma3number = (num) => {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  const dmHandler = async (e) => {
    const oppositeId = e.currentTarget.getAttribute('data-uid');
  
    try {
      const response = await axiosCRUDInstance.post("/api/chat-room/opposite/"+oppositeId,{}, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("user"),
        },
      });
      const result = response.data;
      console.log('result',result );
      if (result.success) {
        const roomId = result.data["roomId"];
        setRoomIdFirstSend(roomId);
      } else {
        console.error("Failed to start chat:", result.message);
      }
    } catch (error) {
      console.error("Error during DM API call:", error);
    }
  }

  const handleSetAuctionProduct = (productId) => {
    setAuctionProduct(productId);
    setIsAuctionOpen(true);
  };

  useEffect(() => {
    if (goProductId ) {
      document.querySelectorAll('.product-item-card' ).forEach((item, index) => {
        if (item.id === `product-${goProductId}`) {
          setSelectedIndex(index);
        }
      });
    }
  }, [goProductId]);

  return (
    <>
        {products.map((item, index) => (
          <div
            key={item.productId}
            id={`product-${item.productId}`}
            className={`product-item-card ${
              index === selectedIndex ? "selected" : ""
            }`}
            style={{ transform: `translateY(${(index - selectedIndex) * 100}%)` }}
          >
            
            <div className="product-bottom">
                <div className="swiper-container swiper">
                    <div className="swiper-wrapper">
                    {item.imageFileUrls.map((url, index) => (
                        <>
                        <div key={index} className="swiper-slide">
                        <img key={index} src={url} alt="product" />
                        </div>
                        </>
                    ))}
                    </div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-button-prev"></div>
                </div>
                <div className="new-product-info">
                  <div className="new-product-info-div">
                    <div className="product-name">
                        <span>{item.name}</span>
                    </div>
                    <div className="product-price">
                        <span>{comma3number ( item.price )}원</span>
                    </div>
                  </div>
                  <div className="new-product-seller">
                      <span>판매자 : {item.memberDto.id}</span>
                  </div>
                  <div className="new-product-DM-div">
                    <div onClick={dmHandler} data-uid={item.memberDto.memberId} >
                      <span>판매자에게 DM 보내기</span>
                    </div>
                    <div onClick={()=>{handleSetAuctionProduct(item);}} data-uid={item.memberDto.memberId}>
                      <span  >경매하러가기</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
            ))}
    </>
  );
};

export default ProductList;

import React, { useEffect, useState } from "react";
import UserInfo from "../UI/UserInfo";
import { getProductById, createPurchaseWish } from "../../api/products";
import "./PD.css";
import { HttpStatusCode } from "axios";
// import Swiper JS
import Swiper from "swiper/bundle";
// import Swiper styles
import "../../static/css/swiper-bundle.min.css";

const ProductDetailNew = ({ productData }) => {
  
  // 이미지 swiper
  useEffect(() => {
    if (productData.fileImage.length > 0) {
      const swiper = new Swiper(".product-detail-div .swiper-container", {
        navigation: {
          nextEl: ".product-bottom .swiper-button-next",
          prevEl: ".product-bottom .swiper-button-prev",
        },
      });
    }
  }, [productData.fileImage]);

  return (
    <div className="product-detail-new">
      <h2>{productData.name}</h2>
      <div className="product-detail-div">
        <div className="swiper-container swiper">
          <div className="swiper-wrapper">
            {productData.fileImage.map((url, index) => (
              <>
                <div key={index} className="swiper-slide">
                  <img src={url} alt={`product-${index}`} />
                </div>
              </>
            ))}
          </div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
      </div>
      <h1>Description</h1>
      {productData.description.split("\n").map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      <div className="starting-price">
        <span>Starting price</span>
        <span>₩ {productData.price}</span>
      </div>
    </div>
  );
};

export default ProductDetailNew;

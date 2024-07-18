import React, { useEffect, useState } from "react";
import UserInfo from "../UI/UserInfo";
import { getProductById, createPurchaseWish } from "../../api/products";
import "./PD.css";
import { HttpStatusCode } from "axios";
// import Swiper JS
import Swiper from 'swiper';
// import Swiper styles
import '../../static/css/swiper-bundle.min.css';


const ProductDetailNew = ({ productId }) => {

  useEffect(() => {
    
  }, [productId]);

  const user = sessionStorage.getItem("username");

  return (
    <div className="product-detail-new">
      <h2>트랙패드 by Ryuu</h2>
      <h1>Description</h1>
      <p>맥북 사용하시는 분! 아니면 윈도우 사용하시는 분이더라도</p>
      <p>트랙패드는 꼭꼭꼭! 필요할거에요!!!</p>
      <br/>
      <p>진짜 트랙패드 한 번 사용해보시면 마우스 절대로 사용하지 못 하실거에요</p>  
      <br/>
      <p>저는 이거 전남자친구한테 선물 받았는데요</p>  
      <p>헤어져서 팔게요....</p>  
      <br/>
      <p>다른 분들이 잘 사용해주세요.,. ㅜㅜ</p>  
      <div className="starting-price">
        <span>Starting price</span>
        <span>$5,000</span>
      </div>
    </div>
  );
};

export default ProductDetailNew;

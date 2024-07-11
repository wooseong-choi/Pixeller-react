import React, { useEffect } from "react";
import { getProductById } from "../../api/products";
import "./PD.css";
import UserInfo from "../UI/UserInfo";

const ProductDetail = ({ productId, handleClose, setAuctionProduct }) => {
  console.log("in PD: ", productId);
  useEffect(() => {
    // getProductById(productId).then((res) => {
    //   console.log("Product Detail: ", res);
    // });
  }, []);
  
  const handleSetAuctionProduct = (productId) => {
    setAuctionProduct(productId);
  };
  const user = sessionStorage.getItem("user");
  return ( 
    <div className="board-wrapper">
      <div className="board-container">
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
        <div className="img-container">
          <img src="https://via.placeholder.com/400x300" alt="product" />
        </div>
        <div className="product-detail">
          <div className="product-seller">
            <span>판매자:</span>
            <UserInfo user={user}/>
          </div>
          <div className="product-container">
            <div className="product-info">
              <div className="product-title">상품 제목</div>
              <div className="product-price">상품 가격</div>
              <div className="product-content">
                상품 설명 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Etiam auctor eros ac dapibus consectetur.
              </div>
            </div>
            <div className="product-wantBuyer">
              <p>구매 요청자 목록</p>
              <div className="buyer-list">
                
                <UserInfo user={user}/>
                <UserInfo user={user}/>
              </div>
            </div>
            <div className="product-button">
              <button className="join-auction" onClick={() => {
                  handleSetAuctionProduct(productId);
              } }>
                경매 참여하기
              </button>
              <button className="product-request">구매 요청하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

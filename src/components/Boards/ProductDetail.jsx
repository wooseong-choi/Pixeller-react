import React from "react";
import { useState } from "react";
import "./PC.css";
import productDTO from "../../api/dto/productDTO";
import { createProduct } from "../../api/products";

const ProductDetail = () => {
  const productDTO = new productDTO();
  const [imgFiles, setImgFiles] = useState([]);
  const [product, setProduct] = useState(productDTO);

  return (
    <>
      <div className="board-wrapper">
        <div className="board-container">
          <div className="img-container">
            <img src="여기에 이미지 링크" alt="product" />
          </div>
          <div className="product-detail">
            <div className="product-seller">
              판매자:
              <span>seller(여기에 유저 아이콘)</span>
            </div>
            <div className="product-container">
              <div className="product-title">상품 제목</div>
              <div className="product-price">상품 가격</div>
              <div className="product-content">상품 설명</div>
              <div className="product-wantBuyer">
                구매 요청자 목록
                <div className="buyer-list">
                  <ul>
                    <li>buyer1</li>
                    <li>buyer2</li>
                    <li>buyer3</li>
                  </ul>
                </div>
              </div>
              <div className="product-button">
                <button className="product-request">구매 요청하기</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;

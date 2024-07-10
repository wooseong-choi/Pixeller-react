import React, { useEffect } from "react";
import { getProductById } from "../../api/products";
import "./PD.css";

const ProductDetail = ({ productId, handleClose }) => {
  console.log("in PD: ", productId);
  useEffect(() => {
    // getProductById(productId).then((res) => {
    //   console.log("Product Detail: ", res);
    // });
  }, []);

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
            판매자: <span>seller</span>{" "}
            {/* seller 아이콘이 아직 없으니 수정이 필요 */}
          </div>
          <div className="product-container">
            <div className="product-title">상품 제목</div>
            <div className="product-price">상품 가격</div>
            <div className="product-content">
              상품 설명 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Etiam auctor eros ac dapibus consectetur.
            </div>
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
  );
};

export default ProductDetail;

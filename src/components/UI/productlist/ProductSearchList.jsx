// SidebarSection.js
import React, { useEffect, useState } from "react";

const ProductSearchList = ({products}) => {
  const comma3number = (num) => {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  // console.log(products);
  return (
    <>
        <input type="text" className="searchbox" placeholder="상품을 찾아보세요"/>
        {products.map((item, index) => (
          <div
            key={item.productId}
            id={`product-${item.productId}`}
          >
            
            <div className="product-bottom">
                <img src={item.imageFileUrls[0]} alt="product_img" />
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
                    <div>
                      <span>판매자에게 DM 보내기</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>
            ))}
    </>
  );
};

export default ProductSearchList;

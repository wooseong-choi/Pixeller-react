// SidebarSection.js
import React, { useEffect, useState } from "react";
const ProductSearchList = ({products}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredItems = products.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const comma3number = (num) => {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }
  // console.log(products);
  return (
    <>
        <input type="text" className="searchbox" placeholder="상품을 찾아보세요" onChange={handleSearch}/>
        <div className="search-list">
        {filteredItems.map((item, index) => (
          <div
          key={item.productId}
          id={`search-${item.productId}`}
          className="search-item-card"
          >
            <div className="search-bottom">
                <div className="new-product-search-info">
                  <div className="new-product-search-info-div">
                    <div className="product-name">
                        <span>{item.name}</span>
                    </div>
                    <div className="product-price">
                        <span>{comma3number ( item.price )}원</span>
                    </div>
                  </div>
                </div>
                <img src={item.imageFileUrls[0]} alt="product_img" />
            </div>
          </div>
        ))}
        </div>
    </>
  );
};

export default ProductSearchList;

import React, { useEffect, useState } from "react";
import { checkSellerProduct } from "../../api/products";
import "../../static/css/SellerProduct.css";

const SellerProducts = ({ sellerOpen, sellectProduct, alertAuction }) => {
  const handleClose = () => {
    sellerOpen(false);
  };

  const handleSelector = () => {
    if (selected) {
      sellectProduct(selected);
      alertAuction(true);
    } else {
      alert("상품을 선택해주세요.");
    }
  };

  useEffect(() => {
    getMyProducts();
  }, []);

  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState(null);

  const getMyProducts = async () => {
    const product = await checkSellerProduct();
    setProducts(product);
  };

  return (
    <>
      <div className="seller-product-wrapper">
        <div className="seller-product-container">
          <div className="seller-product-header">
            <h2>상품 선택하기</h2>
            <button onClick={handleClose}>X</button>
          </div>
          <hr className="line" />
          {products &&
            products.map((product) => (
              <div
                key={product.productId}
                className={`seller-product ${
                  selected?.productId === product.productId ? "selected" : ""
                }`}
                onClick={() => setSelected(product)}
              >
                <div className="seller-product-info">
                  <div className="seller-product-name">{product.name}</div>
                  <div className="seller-product-price">{product.price}원</div>
                </div>
                <img
                  src={product.imageFileUrls[0]}
                  className="seller-product-image"
                />
              </div>
            ))}
          {!products && (
            <div>
              <div>
                <img src="icon/Items.png" alt="" />
              </div>
              <div>등록하신 상품이 없습니다.</div>
            </div>
          )}
          <div className="seller-product-footer">
            <button onClick={handleSelector}>선택 완료</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerProducts;

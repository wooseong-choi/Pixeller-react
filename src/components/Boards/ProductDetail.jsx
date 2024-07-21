import React, { useEffect, useState } from "react";
import UserInfo from "../UI/UserInfo";
import {
  getProductById,
  createPurchaseWish,
  deleteProduct,
  checkSellerTrueOrFalse,
} from "../../api/products";
import "./PD.css";
// import Swiper JS
import Swiper from "swiper";
// import Swiper styles
import "../../static/css/swiper-bundle.min.css";

const ProductDetail = ({
  productId,
  handleClose,
  setAuctionProduct,
  setIsAuctionOpen,
}) => {
  const [product, setProduct] = useState({
    productId: "",
    name: "",
    price: "",
    memberId: "",
    imageFileUrls: [],
  });
  const user = sessionStorage.getItem("username");

  const handlePurchaseWish = () => {
    // console.log(createPurchaseWish(productId.id));
    if (createPurchaseWish(productId.id)) {
      alert("구매 요청이 완료되었습니다.");
    }
  };

  useEffect(() => {
    getProductById(productId.id).then((res) => {
      // console.log(res);
      setProduct(res);
      console.log(product);
    });

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose, productId.id]);

  const handleSetAuctionProduct = (productId) => {
    setAuctionProduct(productId);
    setIsAuctionOpen(true);
  };

  const handleSetIsAuctionOpen = () => {
    setIsAuctionOpen(true);
  };

  const handleDelete = async () => {
    if (await checkSellerTrueOrFalse(user, productId.id)) {
      console.log("판매자 확인");
      if (window.confirm("정말 삭제하시겠습니까?")) {
        deleteProduct(productId.id);
      }
    } else {
      alert("판매자만 삭제할 수 있습니다.");
    }
  };

  useEffect(() => {
    const swiper = new Swiper(".swiper-container", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      // allowSlideNext: true,
      // allowSlidePrev: true,
    });
  }, [product.imageFileUrls]);

  return (
    <div className="board-wrapper" onClick={handleClose}>
      <div className="board-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>
          ×
        </button>

        <div className="img-container swiper-container swiper">
          <div className="swiper-wrapper">
            {product.imageFileUrls.map((url, index) => (
              <div key={index} className="swiper-slide">
                <img key={index} src={url} alt="product" />
              </div>
            ))}
          </div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>
        <div className="product-detail">
          <div className="product-seller">
            <span>판매자:</span>
            <UserInfo user={user} />
          </div>
          <div className="product-container">
            <div className="product-info">
              <div className="product-title">상품: {product.name}</div>
              <div className="product-price">￦ {product.price}</div>
              <div className="product-content">
                상품 설명 : {product.description}
              </div>
            </div>
            <div className="product-wantBuyer">
              <p>구매 요청자 목록</p>
              <div className="buyer-list">
                {/* {product.memberDto &&
                  product.memberDto.forEach((buyer) => (
                    <UserInfo user={buyer.username} />
                  ))} */}
              </div>
            </div>
            <div className="product-button">
              <button
                className="join-auction"
                onClick={() => {
                  handleSetAuctionProduct(product);
                  handleSetIsAuctionOpen();
                }}
              >
                경매 참여하기
              </button>
              <button onClick={handlePurchaseWish} className="product-request">
                구매 요청하기
              </button>
              <button onClick={handleDelete} className="product-delete">
                삭제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

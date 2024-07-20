// SidebarSection.js
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/products";
// import Swiper JS
import Swiper from 'swiper/bundle';
// import Swiper styles
import '../../static/css/swiper-bundle.min.css';

const ProductList = ({closePLModal}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sidebarItems, setSidebarItems] = useState([]);

  useEffect(() => {
    getAllProducts().then((res) => {
      console.log(res);
      const products = res;
      setSidebarItems(products);
    });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  useEffect(() => {
    const handleSwipe = (e) => {
      if (e.deltaY > 0) {
        // 스와이프 아래로
        setSelectedIndex((prevIndex) =>
          prevIndex < sidebarItems.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else {
        // 스와이프 위로
        setSelectedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      }
    };

    window.addEventListener("wheel", handleSwipe);

    return () => {
      window.removeEventListener("wheel", handleSwipe);
    };
  }, [sidebarItems]);

  const filteredItems = sidebarItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closePLModalHandler = (e) => {
    closePLModal();
    document.querySelector('.bottom_menu_item.item').classList.add('off');
  }

  useEffect(() => {
    if (sidebarItems.length > 0) {
        const swiper = new Swiper('.product-bottom .swiper-container', {
            navigation: {
                nextEl: ".product-bottom .swiper-button-next",
                prevEl: ".product-bottom .swiper-button-prev",
            },
        });
    }

  }, [sidebarItems]);

  const comma3number = (num) => {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  console.log(filteredItems);
  return (
    <>
        <div className="product_list">
        {filteredItems.map((item, index) => (
          <div
            key={item.productId}
            id={`product-${item.productId}`}
            className={`product-item-card ${
              index === selectedIndex ? "selected" : ""
            }`}
            style={{ transform: `translateY(${(index - selectedIndex) * 100}%)` }}
          >
            <div className="product-top">
                <div>
                    <div className="snp500">
                        <img src="icon/svg/square.and.pencil.svg"/>
                    </div>
                    <div className="search-div">
                        <img src="icon/svg/search.svg"/>
                    </div>
                    <button className="close-button" onClick={closePLModalHandler}>×</button>
                </div>
            </div>
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
                  <div>
                    
                  </div>
                </div>
            </div>
          </div>
        ))}
        </div>
    </>
  );
};

export default ProductList;

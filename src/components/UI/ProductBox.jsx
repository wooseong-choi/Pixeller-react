// SidebarSection.js
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/products";
import {jwtDecode} from "jwt-decode";
import ProductList from "./productlist/ProductList.jsx";
import ProductSearchList from "./productlist/ProductSearchList.jsx";
import ProductCreate from "./productlist/ProductCreate.jsx";

const ProductBox = ({closePLModal}) => {
  const [writeMode, setWriteMode] = useState(false);
  const [sidebarItems, setSidebarItems] = useState([]);

  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    getAllProducts().then((res) => {
      console.log(res);
      const products = res;
      setSidebarItems(products);
    });
  }, []);


  const closePLModalHandler = (e) => {
    closePLModal();
    document.querySelector('.bottom_menu_item.item').classList.add('off');
  }

  const comma3number = (num) => {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  const user = jwtDecode(sessionStorage.getItem("user"));
  
  const searchModeHandler = (e) => {
    setSearchMode(!searchMode);
    if(searchMode){
      document.querySelector('.product_list').classList.remove('search-mode');
    }else{
      document.querySelector('.product_list').classList.add('search-mode');
    }
  }

  const writeModeHandler = (e) => {
    setWriteMode(!writeMode);

  }

  const dmHandler = (e) => {
    

  }

  return (
    <>
      {writeMode? 
        <div className="product_create">
          <div className="product-top">
              <div>
                  <div className="snp500">
                      <span onClick={writeModeHandler}><img src="icon/svg/Vector.svg"/></span>
                  </div>
                  <div className="product-create-top-subject">
                    <span>상품 등록하기</span>
                  </div>
              </div>
          </div>
          <div className="product-create-wrap">
            {/* <div className="product-create-content">
              <div className="product-create-content-top">
                <div className="product-create-content-top-left">
                  <div className="product-create-content-top-left-subject">
                    <span>상품명</span>
                  </div>
                  <div className="product-create-content-top-left-input">
                    <input type="text" placeholder="상품명을 입력해주세요."/>
                  </div>
                </div>
                <div className="product-create-content-top-right">
                  <div className="product-create-content-top-right-subject">
                    <span>상품 가격</span>
                  </div>
                  <div className="product-create-content-top-right-input">
                    <input type="text" placeholder="상품 가격을 입력해주세요."/>
                  </div>
                </div>
              </div>
              <div className="product-create-content-bottom">
                <div className="product-create-content-bottom-subject">
                  <span>상품 설명</span>
                </div>
                <div className="product-create-content-bottom-input">
                  <textarea placeholder="상품 설명을 입력해주세요."></textarea>
                </div>
              </div>
              <div className="product-create-content-button">
                <button>등록하기</button>
              </div>
            </div> */}
            <ProductCreate handleClose={closePLModal} />
          </div>
        </div>

      :
        <div className="product_list">
          <div className="product-top">
              <div>
                  <div className="snp500">
                      {searchMode ?
                      <span onClick={searchModeHandler}><img src="icon/svg/Vector.svg"/></span>:
                      <span onClick={writeModeHandler}><img src="icon/svg/square.and.pencil.svg"/></span>
                      }
                  </div>
                  <div className="search-div">
                      <span onClick={searchModeHandler}><img src="icon/svg/search.svg"/></span>
                  </div>
                  <button className="close-button" onClick={closePLModalHandler}>×</button>
              </div>
          </div>
          <div className="product-list-wrap">
            <ProductList products={sidebarItems} />
          </div>
          <div className="product-search-wrap">
            <ProductSearchList products={sidebarItems} />
          </div>
        </div>
      }  
    </>
  );
};

export default ProductBox;

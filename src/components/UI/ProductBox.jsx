// SidebarSection.js
import React, { useEffect, useState } from "react";
import { getAllProducts } from "../../api/products";
import {jwtDecode} from "jwt-decode";
import ProductList from "./productlist/ProductList.jsx";
import ProductSearchList from "./productlist/ProductSearchList.jsx";

const ProductBox = ({closePLModal}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarItems, setSidebarItems] = useState([]);

  const [searchMode, setSearchMode] = useState(false);

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
  
  const filteredItems = sidebarItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const dmHandler = (e) => {
    

  }

  console.log(user);
  console.log(filteredItems);
  return (
    <>
        <div className="product_list">
          <div className="product-top">
              <div>
                  <div className="snp500">
                      {searchMode ?
                      <span onClick={searchModeHandler}><img src="icon/svg/Vector.svg"/></span>:
                      <span ><img src="icon/svg/square.and.pencil.svg"/></span>
                      }
                  </div>
                  <div className="search-div">
                      <span onClick={searchModeHandler}><img src="icon/svg/search.svg"/></span>
                  </div>
                  <button className="close-button" onClick={closePLModalHandler}>×</button>
              </div>
          </div>
          <div className="product-list-wrap">
            <ProductList products={filteredItems} />
          </div>
          <div className="product-search-wrap">
            <ProductSearchList products={filteredItems} />
          </div>
        </div>
    </>
  );
};

export default ProductBox;

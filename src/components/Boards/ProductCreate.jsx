import React, { useState } from "react";
import "./PC.css";
// import productDTO from "../../api/dto/productDTO.js";
import { createProduct } from "../../api/products";
import UserInfo from "../UI/UserInfo";

const ProductDetail = ({ handleClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // const productDTO = new productDTO();
  const [imgFiles, setImgFiles] = useState([]);
  // const [product, setProduct] = useState(productDTO);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const user = sessionStorage.getItem("user");


  const [value, setValue] = useState('');
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    // Replace all non-numeric characters except for the first decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, '');
    setValue(numericValue);
  };

  return (
    <div className="container">
      <button className="close-button" onClick={handleClose}>
        ×
      </button>
      <div className="left-section">
        <div className="photo-upload">
          <div className="upload-placeholder">
            {selectedFile ? null : (
              <span
                className="plus-icon"
                onClick={() => document.getElementById("file-input").click()}
              >
                +
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              name="product-image"
              id="file-input"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="uploaded-image"
                onClick={() => document.getElementById("file-input").click()}
              />
            ) : (
              <span className="upload-text">사진 등록</span>
            )}
          </div>
        </div>
      </div>
      <div className="product-detail">
        <div className="product-seller">
          <span>판매자:</span>
          <UserInfo user={user}/>
        </div>
        <div className="product-container">
          <div className="product-info">
            <input className="title" type="text" name="title" placeholder="팬이에요!" />
            <textarea className="content" name="content" placeholder="싸인해주세요!"></textarea>
            <input className="price" type="text" name="price" placeholder="가격 입력" onChange={handleInputChange} value={value} />
          </div>
          <div className="product-button">
            <button className="product-request">상품 등록</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

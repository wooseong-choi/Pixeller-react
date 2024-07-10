import React, { useState } from "react";
import "./PC.css";
// import productDTO from "../../api/dto/productDTO.js";
import { createProduct } from "../../api/products";

const ProductDetail = ({ handleClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  // const productDTO = new productDTO();
  const [imgFiles, setImgFiles] = useState([]);
  // const [product, setProduct] = useState(productDTO);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
      <div className="right-section">
        <div className="seller-info">
          <div className="profile-icon"></div>
          <div className="seller-name"></div>
        </div>
        <div className="product-info">
          <input
            type="text"
            className="product-title"
            placeholder="상품 제목을 작성해주세요"
          />
          <textarea
            className="product-description"
            placeholder="상품 소개 글을 작성해주세요"
          ></textarea>
        </div>
        <button className="register-button">상품 등록</button>
      </div>
    </div>
  );
};

export default ProductDetail;

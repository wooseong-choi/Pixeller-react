import React, { useState, useEffect } from "react";
import "./PC.css";
// import productDTO from "../../api/dto/productDTO.js";
import { createProduct } from "../../api/products";
import UserInfo from "../UI/UserInfo";
import { jwtDecode } from "jwt-decode";
import { axiosCRUDInstance } from "../../api/axios";
import axios from "axios";
const ProductDetail = ({ handleClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const uri = "//lionreport.pixeller.net";

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  // const productDTO = new productDTO();
  const [imgFiles, setImgFiles] = useState([]);
  // const [product, setProduct] = useState(productDTO);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    handleFileListChange(event.target.files);
  };

  let selectedFiles = [];

  const handleFileListChange = (files) => {
    const fileList = document.getElementById("file-list");
    for (let i = 0; i < files.length; i++) {
      selectedFiles.push(files[i]);
      const item = document.createElement("div");
      const fileName = document.createTextNode(files[i].name);
      const deleteButton = document.createElement("button");
      deleteButton.addEventListener("click", (event) => {
        item.remove();
        event.preventDefault();
        deleteFile(files[i]);
      });
      deleteButton.innerText = "X";
      item.appendChild(fileName);
      item.appendChild(deleteButton);
      fileList.appendChild(item);
    }
  };

  const deleteFile = (deleteFile) => {
    const inputFile = document.querySelector('input[name="imgFiles"]');
    const dataTransfer = new DataTransfer();
    selectedFiles = selectedFiles.filter((file) => file !== deleteFile);
    selectedFiles.forEach((file) => {
      dataTransfer.items.add(file);
    });
    inputFile.files = dataTransfer.files;
  };

  const user = sessionStorage.getItem("username");
  const userInfo = jwtDecode(sessionStorage.getItem("user"));

  const [value, setValue] = useState("");
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    // Replace all non-numeric characters except for the first decimal point
    const numericValue = inputValue.replace(/[^0-9.]/g, "");
    setValue(numericValue);
  };

  const getUploadUrl = async (file) => {
    // const formData = new FormData();
    // formData.append("file", file);
    const axiosHingInstance = axios.create({
      baseURL: "//192.168.0.46:8080", // Change this to Backend API URL
      timeout: 1000,
    });

    const response = await axiosHingInstance.get("/api/presigned-url/"+file.name, {
      headers: {
        // "Content-Type": "multipart/form-data",
        authorization: "Bearer " + sessionStorage.getItem("user"),
      },
    });
    return response.data;
  };

  const submitHandle = async (event) => {
    const form = document.querySelector('form[name="create_form"');
    const formData = new FormData(form);
    console.log(form.imgFiles.files);

    const files = [];

    for (let i = 0; i < form.imgFiles.files.length; i++) {
      const file = form.imgFiles.files[i];
      const uploadUrl = await getUploadUrl(file);
      console.log(uploadUrl.data.url);
      
      const response = await axios.put(uploadUrl.data.url, file, {
        headers: {
          'Content-Type': 'image/png',
          // authorization: "Bearer " + sessionStorage.getItem("user"),
        },
      });

      files.push({path: uploadUrl.data.url, filename: file.name});

      console.log(response);
    }

    // validation check
    if (!formData.get("name")) {
      alert("제목을 입력해주세요");
      return false;
    }
    if (!formData.get("description")) {
      alert("내용을 입력해주세요");
      return false;
    }
    if (!formData.get("price")) {
      alert("가격을 입력해주세요");
      return false;
    }
    if (!formData.get("category")) {
      alert("카테고리를 입력해주세요");
      return false;
    }
    // if (!formData.get("imgFiles")) {
    var fileCheck = document.getElementById("file-input").value;
    if(!fileCheck){
      alert("사진을 등록해주세요");
      return false;
    }
    if( !formData.get("auction_start_time")){
      alert("경매 시작 시간을 입력해주세요");
      return false;
    }

    // 이거 작동안하는데 왜인지 아시는분?
    if (!formData.get("member_id")) {
      alert("판매자 정보가 없습니다.");
      return false;
    }
    
    const databody = {
      files: files,
      name: formData.get("name"),
      description: formData.get("description"),
      price:formData.get("price"),
      category:formData.get("category"),
      member_id:userInfo.uid,
    };

    // return false;
    try {
      const response = await axiosCRUDInstance.post("/api/products", databody, {
        headers: {
          // "Content-Type": "multipart/form-data",
          "Content-Type": "application/json",
          authorization: "Bearer " + sessionStorage.getItem("user"),
        },
      });

      if (response.status === 201) {
        alert("상품이 등록되었습니다.");
        form.reset();
        handleClose();
      }
      // return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container">
      <form
        className="container"
        id="create_form"
        name="create_form"
        method="POST"
        encType="multipart/form-data"
        action={`${uri}/api/products`}
        onSubmit={() => {
          return false;
        }}
      >
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
                name="imgFiles"
                id="file-input"
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
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
            <div className="file_list_header" style={{ display: "none" }}>
              <div className="file_list_header_task">
                <button type="button" className="button_svg_delete">
                  <span className="blind">전체 삭제</span>
                </button>
              </div>
              <div className="file_list_header_title">
                <span className="text">파일명</span>
              </div>
              <div className="file_list_header_volume">
                <span className="text">용량</span>
                <span id="fileSize">0</span>
              </div>
            </div>
            <div id="file-list" className="file_list"></div>
          </div>
        </div>
        <div className="product-detail">
          <div className="product-seller">
            <span>판매자:</span>
            <UserInfo user={user} />
          </div>
          <div className="product-container">
            <div className="product-info">
              <input type="hidden" value={userInfo.uid} name="member_id" />
              <input
                className="title"
                type="text"
                name="name"
                placeholder="제목을 입력해주세요"
              />
              <textarea
                className="content"
                name="description"
                placeholder="내용을 입력해주세요"
              ></textarea>
              <input
                className="price"
                type="text"
                name="price"
                placeholder="가격을 입력해주세요"
                onChange={handleInputChange}
                value={value}
              />
              <input
                className="category"
                type="text"
                name="category"
                placeholder="카테고리를 입력해주세요"
              />
              <input type="datetime-local" className="aucion_start_time" name="aucion_start_time" />
            </div>
            <div className="product-button">
              <div className="product-request" onClick={submitHandle}>
                상품 등록
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductDetail;

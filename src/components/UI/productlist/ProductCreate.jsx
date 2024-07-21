import React, { useState, useEffect } from "react";
import UserInfo from "../UserInfo";
import { jwtDecode } from "jwt-decode";
import { axiosCRUDInstance } from "../../../api/axios";
import axios from "axios";
const ProductCreate = ({ handleClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const uri = "//lionreport.pixeller.net";

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseHandler();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleClose]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const deleteFile = (deleteFile) => {
    setSelectedFiles(selectedFiles.filter(file => file !== deleteFile));
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
    const response = await axiosCRUDInstance.get("/api/presigned-url/"+file.name, {
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

      files.push({path: uploadUrl.data.url.split('?')[0], filename: file.name});

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

    var fileCheck = document.getElementById("file-input").value;
    if(!fileCheck){
      alert("사진을 등록해주세요");
      return false;
    }

    // 이거 작동안하는데 왜인지 아시는분?
    // if (!formData.get("member_id")) {
    //   alert("판매자 정보가 없습니다.");
    //   return false;
    // }
    
    const databody = {
      files: files,
      name: formData.get("name"),
      description: formData.get("description"),
      price:formData.get("price"),
    };

    // return false;
    try {
      const response = await axiosCRUDInstance.post("/api/products", databody, {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + sessionStorage.getItem("user"),
        },
      });

      if (response.status === 201) {
        alert("상품이 등록되었습니다.");
        form.reset();
        handleCloseHandler();
      }
      // return response.data;
    } catch (error) {
      throw error;
    }
  };

  const handleCloseHandler = (e) => {
    const item = document.querySelector('.bottom_menu_item.item');
    item.setAttribute("class", item.getAttribute("class") + " off");
    handleClose();
  };


  return (
    <div className="product-create-content">
      <form
        className="new-product-form"
        id="create_form"
        name="create_form"
        method="POST"
        encType="multipart/form-data"
        action={`${uri}/api/products`}
        onSubmit={() => {
          return false;
        }}
      >
        <div className="new-product-detail">
          <div className="new-product-container">
            <div className="new-product-info">
              <input type="hidden" value={userInfo.uid} name="member_id" />
              <label className="label-title">제목</label>
              <input
                className="title"
                type="text"
                name="name"
                placeholder="판매할 상품명을 입력해주세요"
              />
              <label className="label-content">상품 내용</label>
              <textarea
                className="content"
                name="description"
                placeholder="해당 상품에 대한 자세한 내용을 작성해 주세요"
              ></textarea>
              <label className="label-price">경매 시작가</label>
              <input
                className="price"
                type="text"
                name="price"
                placeholder="가격을 입력해주세요"
                onChange={handleInputChange}
                value={value}
              />
              
              <label className="label-upload">사진 업로드</label>
              <div className="photo-upload">
                <div className="upload-placeholder">
                  {selectedFiles.length === 0 && (
                      <span
                      className="plus-icon"
                      onClick={() => document.getElementById("file-input").click()}
                      >
                      <img src="icon/svg/sagin.svg" alt="plus" />
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
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="uploaded-image"
                        onClick={() => document.getElementById("file-input").click()}
                      />
                      <button type="button" onClick={() => deleteFile(file)}>X</button>
                    </div>
                  ))}
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
            <div className="product-button">
              <div className="new-product-request" onClick={submitHandle}>
                작성 완료
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;

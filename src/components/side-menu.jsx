import React, { useState } from "react";
import UserInfo from "../components/UI/UserInfo";

const SideMenu = () => {
  const user = sessionStorage.getItem("username");
  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <button
        className="menu-toggle"
        onClick={() => {
          toggleMenu(isOpen, setIsOpen);
        }}
      >
        <img src="svg/exit.svg" />
      </button>
      <div className="searchDivWrap">
        <div className="searchDiv">
          <img
            src="svg/search-icon.svg"
            alt="Search Icon"
            className="search-icon"
          />
          <input placeholder="Search" type="text" />
        </div>
      </div>
      <nav className="menu-items">
        <UserInfo user={user} />
      </nav>
    </div>
  );
};

export default SideMenu;

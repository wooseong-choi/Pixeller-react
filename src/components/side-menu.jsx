import React, { useState } from 'react';

const SideMenu = () => {
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
        <div className="user-info">
        <img
            src="svg/user-icon.svg"
            alt="User Icon"
            className="user-icon"
        />
        <span className="username">류강현</span>
        <span className="status">활동중</span>
        <span className="status-dot on"></span>
        </div>
        <div className="user-info">
        <img
            src="svg/user-icon.svg"
            alt="User Icon"
            className="user-icon"
        />
        <span className="username">류강현</span>
        <span className="status">활동중</span>
        <span className="status-dot on"></span>
        </div>
        <div className="user-info">
        <img
            src="svg/user-icon.svg"
            alt="User Icon"
            className="user-icon"
        />
        <span className="username">류강현</span>
        <span className="status">활동중</span>
        <span className="status-dot on"></span>
        </div>
        <div className="user-info">
        <img
            src="svg/user-icon.svg"
            alt="User Icon"
            className="user-icon"
        />
        <span className="username">류강현</span>
        <span className="status">활동중</span>
        <span className="status-dot on"></span>
        </div>
    </nav>
    </div>
    );
};

export default SideMenu;
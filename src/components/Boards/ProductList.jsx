// SidebarSection.js
import React, { useState } from 'react';
import './PL.css';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const sidebarItems = [
    { id: 'item1', name: '아이폰', sender_name : '류강현' },
    { id: 'item2', name: '갤럭시', sender_name : '류강현'},
    { id: 'item3', name: '아이패드',sender_name : '류강현' },
    { id: 'item4', name: '갤럭시 탭',sender_name : '류강현' },
  ];

  const filteredItems = sidebarItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="item-list">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`item-card ${selectedItem && selectedItem.id === item.id ? 'selected' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
      {selectedItem && (
        <div className="item-details">
          <h3>{selectedItem.name}</h3>
          {/* Add more details about the selected item here */}
        </div>
      )}
    </div>
  );
};

export default ProductList;

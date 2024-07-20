import React, { useState } from "react";
import "../static/css/Tooltip.css";

const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);

  const showTooltip = () => {
    setShow(true);
  };

  const hideTooltip = () => {
    setShow(false);
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {show && <div className="tooltip-text">{text}</div>}
    </div>
  );
};

export default Tooltip;

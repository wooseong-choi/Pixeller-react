import React, { useEffect, useState } from "react";
import "../../static/css/bottom.css";
import Bgm from "./bottommenu/bgm";

const BottomMenu = ({
  closePLModal,
  openPLModal,
  setIsCamOpen,
  setIsMicOpen,
}) => {
  const user = sessionStorage.getItem("user");
  const [bgmRunning, setBgmRunning] = useState(true);

  const clickCameraHandler = (e) => {
    e.preventDefault();
    const camera = e.currentTarget;
    const img = camera.querySelector("img");
    setIsCamOpen();
    if (camera.getAttribute("class").indexOf("off") > -1) {
      camera.setAttribute(
        "class",
        camera.getAttribute("class").replace("off", "")
      );
      img.src = "icon/svg/Camera.svg";
    } else {
      camera.setAttribute("class", camera.getAttribute("class") + " off");
      img.src = "icon/svg/Camera_off.svg";
    }
  };
  const clickMicHandler = (e) => {
    e.preventDefault();
    const mic = e.currentTarget;
    const img = mic.querySelector("img");
    setIsMicOpen();
    if (mic.getAttribute("class").indexOf("off") > -1) {
      mic.setAttribute("class", mic.getAttribute("class").replace("off", ""));
      img.src = "icon/svg/Mic.svg";
    } else {
      mic.setAttribute("class", mic.getAttribute("class") + " off");
      img.src = "icon/svg/Mic_off.svg";
    }
  };
  const clickPauseHandler = (e) => {
    e.preventDefault();
    const mic = e.currentTarget;
    const img = mic.querySelector("img");
    if (mic.getAttribute("class").indexOf("off") > -1) {
      mic.setAttribute("class", mic.getAttribute("class").replace("off", ""));
      img.src = "icon/svg/Pause.svg";
      setBgmRunning(true);
    } else {
      mic.setAttribute("class", mic.getAttribute("class") + " off");
      img.src = "icon/svg/Play.svg";
      setBgmRunning(false);
    }
  };
  const clickItemHandler = (e) => {
    e.preventDefault();
    const mic = e.currentTarget;
    if (mic.getAttribute("class").indexOf("off") > -1) {
      mic.setAttribute("class", mic.getAttribute("class").replace("off", ""));
      openPLModal();
    } else {
      mic.setAttribute("class", mic.getAttribute("class") + " off");
      closePLModal();
    }
  };

  // useEffect(() => {
  //     clickPauseHandler();
  //     return () => {
  //         setBgmRunning(false);
  //     }
  // }, []);

  return (
    <div className="bottom_menu">
      <div className="bottom_menu_item camera" onClick={clickCameraHandler}>
        <img src="icon/svg/Camera.svg" alt="camera" />
      </div>
      <div className="bottom_menu_item mic" onClick={clickMicHandler}>
        <img src="icon/svg/Mic.svg" alt="mic" />
      </div>
      <Bgm clickPauseHandler={clickPauseHandler} bgmRunning={bgmRunning} />
      <div className="bottom_menu_item item off" onClick={clickItemHandler}>
        <img src="icon/svg/Item.svg" alt="item" />
      </div>
    </div>
  );
};

export default BottomMenu;

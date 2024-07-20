import React from "react";

const Bgm = ({clickPauseHandler, bgmRunning}) => {
  
  return (
    <div className="bottom_menu_item pause" onClick={clickPauseHandler}>
        {bgmRunning ? <audio id="audio" src="bgm/Reminiscence_320kbps.mp3" autoPlay loop ></audio> : null}
        <img src="icon/svg/Pause.svg" alt="pause" />
    </div>
  );
}

export default Bgm;
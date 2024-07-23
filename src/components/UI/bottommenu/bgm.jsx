import React from "react";

const Bgm = ({clickPauseHandler, bgmRunning}) => {
  
  return (
    <div className="bottom_menu_item pause" onClick={clickPauseHandler}>
        {bgmRunning ? <audio id="audio" src="bgm/MapleStory_-_Raindrop_Flower.mp3" autoPlay loop ></audio> : null}
        <img src="icon/svg/Pause.svg" alt="pause" />
    </div>
  );
}

export default Bgm;
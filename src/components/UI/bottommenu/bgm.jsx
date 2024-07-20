import React from "react";

const Bgm = ({clickPauseHandler, bgmRunning}) => {
  return (
    <div className="bottom_menu_item pause" onClick={clickPauseHandler}>
        {bgmRunning ? <audio id="audio" src="bgm/Second Run_320kbps.mp3" autoPlay loop></audio> : null}
        <img src="icon/svg/Play.svg" alt="pause" />
    </div>
  );
}

export default Bgm;
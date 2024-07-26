import React, { useEffect, useRef } from "react";

const Bgm = ({clickPauseHandler, bgmRunning, isAuctionOpen}) => {
  const audioRef = useRef(null);
  
  useEffect(() => {
    if (audioRef.current) {
      if (isAuctionOpen) {
        audioRef.current.volume = 0.3; // Auction.mp3의 볼륨을 0.5로 설정
      } else {
        audioRef.current.volume = 0.05; // 다른 BGM의 볼륨은 기본값(1)으로 설정
      }
    }
  }, [bgmRunning, isAuctionOpen]); // bgmRunning 또는 isAuctionOpen이 변경될 때마다 실행

  return (
    <div className="bottom_menu_item pause" onClick={clickPauseHandler}>
        {bgmRunning && (
          <audio 
            ref={audioRef}
            src={isAuctionOpen ? "bgm/Auction.mp3" : "bgm/MapleStory_-_Raindrop_Flower.mp3"}
            autoPlay 
            loop 
          />
        )}
        <img src="icon/svg/Pause.svg" alt="pause" />
    </div>
  );
}

export default Bgm;
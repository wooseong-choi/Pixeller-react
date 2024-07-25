import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import GameScene from "./GameScene";
import _ from "lodash";

const NAVBAR_HEIGHT = 64;

const GameApp = () => {
  const canvasRef = useRef(null);
  const [gameSize, setGameSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight - NAVBAR_HEIGHT,
  });

  const handleResize = _.debounce(() => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight - NAVBAR_HEIGHT;
    setGameSize({ width: newWidth, height: newHeight });
    if (window.game) {
      window.game.scale.resize(newWidth, newHeight);
    }
  }, 300);

  useEffect(() => {
    // Phaser.Game 인스턴스가 여러 번 생성되지 않도록 확인
    if (!window.game) {
      const config = {
        type: Phaser.CANVAS,
        width: gameSize.width,
        height: gameSize.height,
        scene: GameScene,
        backgroundColor: "#2d2d2d",
        parent: "gameMain",
        canvas: canvasRef.current,
        pixelArt: true,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: false,
            fps: 60,
          },
        },
        scale: {
          // mode: Phaser.Scale.FIT,
          // autoCenter: Phaser.Scale.CENTER_BOTH,
          mode: Phaser.Scale.ScaleModes.RESIZE,
          width: window.innerWidth,
          height: window.innerHeight,
        },
      };
      window.game = new Phaser.Game(config);
    }

    // 우클릭 이벤트 방지
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.oncontextmenu = (e) => {
        e.preventDefault();
        return false;
      };
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    // 컴포넌트 언마운트 시 Phaser 게임 정리
    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.game) {
      } else {
        window.game.destroy(true);
        window.game = null;
      }
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        position: "absolute",
        top: `${NAVBAR_HEIGHT}px`,
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", zIndex: 1 }}
      ></canvas>
    </div>
  );
};

export default GameApp;

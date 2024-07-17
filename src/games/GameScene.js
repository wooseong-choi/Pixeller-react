// test
import Phaser from "phaser";
import Player from "./character/Player.ts";
import Scroll from "./scroll/scrollEventHandler.ts";
import io from "socket.io-client";
import OPlayer from "./character/OPlayer.ts";
import { getCookie, setCookie } from "../components/Cookies.ts";
import { axiosInstance } from "../api/axios";

const CHARACTER_WIDTH = 16;
const CHARACTER_HEIGHT = 32;

const chaArray = [
  "./character/reddude.png",
  "./character/cat.png",
  "./character/flower_cat.png",
  "./character/goat.png",
  "./character/pig.png",
  "./character/white_rabbit.png",
];

class GameScene extends Phaser.Scene {
  constructor() {
    super();
    this.uid = null;
    this.players = null;

    this.Player = new Player(this, CHARACTER_WIDTH, CHARACTER_HEIGHT);
    this.scoll = new Scroll(this, this.Map_Width, this.Map_Height, this.Player);

    this.socket = io("//api.pixeller.net/ws", {
      // this.socket = io("ws://192.168.0.96:3333/ws", {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: "Bearer " + sessionStorage.getItem("user"),
          },
        },
      },
      auth: {
        token: sessionStorage.getItem("user"),
      },
    });
    this.OPlayer = {};
    this.temp_OPlayer = {};

    this.x = 32;
    this.y = 32;
    this.syncUserReceived = false;
    this.username = sessionStorage.getItem("username");

    this.socket.on("connect", function (data) {
      console.log(data);
    });

    window.addEventListener("beforeunload", async () => {
      await this.socket.emit("userPosition", {
        position: { x: this.player.x, y: this.player.y },
      });
      await this.socket.disconnect();
    });

    // 메인 통신 로직
    this.socket.on("message", async (data) => {
      // console.log(data);
      switch (data.type) {
        // 채팅 메시지 처리
        case "message":
          console.log(data.message);
          break;

        // 다른 유저들의 새로운 사람 처리
        case "join":
          console.log("New player connected: " + data);
          // console.log(data);
          // if (this.OPlayer[data.user.uid] !== undefined) {
          //   if (this.OPlayer[data.user.uid].clientid !== data.user.clientid) {
          //     this.OPlayer[data.user.uid].Destroy();
          //     this.OPlayer[data.user.uid] = new OPlayer(
          //       this,
          //       data.user.username,
          //       CHARACTER_WIDTH,
          //       CHARACTER_HEIGHT,
          //       data.user.clientid
          //     );
          //     const rand_0_9 = Math.floor(Math.random() * 6);
          //     const oplayer_sprite = this.OPlayer[data.user.uid].Create(
          //       data.user.x,
          //       data.user.y,
          //       "player" + rand_0_9
          //     );
          //     this.players.add(oplayer_sprite);
          //   } else {
          //     this.OPlayer[data.user.uid].clientid = data.user.clientid;
          //     this.OPlayer[data.user.uid].x = data.user.x;
          //     this.OPlayer[data.user.uid].y = data.user.y;
          //   }
          // } else {
          //   this.OPlayer[data.user.uid] = new OPlayer(
          //     this,
          //     data.user.username,
          //     CHARACTER_WIDTH,
          //     CHARACTER_HEIGHT,
          //     data.user.clientid
          //   );
          //   const rand_0_9 = Math.floor(Math.random() * 6);
          //   const oplayer_sprite = this.OPlayer[data.user.uid].Create(
          //     data.user.x,
          //     data.user.y,
          //     "player" + rand_0_9
          //   );
          //   this.players.add(oplayer_sprite);
          // }
          await this.handleJoinEvent(data);
          break;

        // 유저 움직임 처리
        case "move":
          // console.log(data);
          // const user = data.user;

          // // 움직인 유저 정보만 받아와서 갱신해주기
          // if (this.OPlayer[user.uid]) {
          //   const otherPlayer = this.OPlayer[user.uid];
          //   if (otherPlayer.x !== user.x || otherPlayer.y !== user.y) {
          //     otherPlayer.moveTo(user.x, user.y, user.direction);
          //     otherPlayer.setMoving(true);
          //   } else {
          //     otherPlayer.setMoving(false);
          //   }
          // }
          await this.handleMoveEvent(data);
          break;

        // 해당 유저 삭제
        case "leave":
          console.log("Player disconnected: " + data.uid);
          if (this.OPlayer[data.uid]) {
            this.OPlayer[data.uid].Destroy();
            delete this.OPlayer[data.uid];
            delete this.temp_OPlayer[data.uid];
            delete this.players[data.uid]; // <- ?? 검증 필요
          }
          console.log(this.OPlayer);
          break;

        // 유저 동기화
        case "syncUser":
          this.uid = data.uid;
          for (let i = 0; i < data.users.length; i++) {
            const userJson = data.users[i];
            if (!this.OPlayer[userJson.uid]) {
              this.OPlayer[userJson.uid] = new OPlayer(
                this,
                userJson.username,
                CHARACTER_WIDTH,
                CHARACTER_HEIGHT
              );
              this.temp_OPlayer[userJson.uid] = userJson;
            } else {
              // 자기 자신인 경우
              this.x = data.x;
              this.y = data.y;
              this.player.x = data.x;
              this.player.y = data.y;
            }
          }
          this.syncUserReceived = true;
          this.create_OPlayer();
          break;

        case "syncMe":
          this.x = data.x;
          this.y = data.y;
          this.player.x = data.x;
          this.player.y = data.y;
          break;

        // 기타 이벤트 처리
        case "error":

        default:
          console.log("Error!: No msg event on Socket.");
          break;
      }
    });

    // 웹 소켓 끊겼을 때 발생 이벤트
    this.socket.on("disconnecting", function () {
      console.log("Socket.IO disconnected.");
      this.socket.emit("leave");
      sessionStorage.removeItem("username");
    });

    this.socket.on("disconnect", function () {
      console.log("Socket.IO disconnected.");
      this.socket.emit("leave");
      sessionStorage.removeItem("username");
    });

    this.socket.on("error", (error) => {
      if (error.message === "Unauthorized") {
        alert("Session expired. Redirecting to login page.");
        this.socket.disconnect();
        window.location.href = "/";
      } else if (error.message === "Invalid token") {
        console.log("Session expired. Redirecting to login page.");
        const refreshToken = getCookie("refresh_token");
        axiosInstance
          .post(
            "/user/refresh",
            { refreshToken: refreshToken },
            {
              headers: {
                Authorization: "Bearer " + sessionStorage.getItem("user"),
              },
            }
          )
          .then((res) => {
            console.log(res);
            sessionStorage.removeItem("user");
            sessionStorage.setItem("user", res.data.jwt);
            const option = {
              Path: "/",
              HttpOnly: true, // 자바스크립트에서의 접근을 차단
              SameSite: "None", // CORS 설정
              Secure: true, // HTTPS에서만 쿠키 전송
              expires: new Date(
                new Date().getTime() + 60 * 60 * 1000 * 24 * 14
              ), // 14일
            };
            setCookie("refresh_token", res.data.refreshToken, option);

            this.socket.emit("refreshToken", res.data.jwt);
          })
          .catch((err) => {
            console.log(err);
            // alert("Session expired. Redirecting to login page.");
            // Navigate("/");
          });
      }
    });

    setInterval(() => {
      this.socket.emit("userList");
    }, 1000 * 30);

  }

  async handleJoinEvent(data) {
    if (this.OPlayer[data.user.uid] !== undefined) {
      if (this.OPlayer[data.user.uid].clientid !== data.user.clientid) {
        this.OPlayer[data.user.uid].Destroy();
        await this.createAndInitializeOPlayer(data.user);
      } else {
        this.OPlayer[data.user.uid].clientid = data.user.clientid;
        this.OPlayer[data.user.uid].moveToBlock(data.user.x, data.user.y);
      }
    } else {
      await this.createAndInitializeOPlayer(data.user);
    }
  }

  async createAndInitializeOPlayer(user) {
    this.OPlayer[user.uid] = new OPlayer(
      this,
      user.username,
      CHARACTER_WIDTH,
      CHARACTER_HEIGHT,
      user.uid,
      user.clientid
    );
    const rand_0_9 = Math.floor(Math.random() * 6);
    const oplayer_sprite = await this.OPlayer[user.uid].Create(
      user.x,
      user.y,
      "player" + rand_0_9
    );
    if (oplayer_sprite && this.players) {
      this.players.add(oplayer_sprite);
    } else {
      console.error("Failed to create or add OPlayer:", user.uid);
    }
  }

  async handleMoveEvent(data) {
    const user = data.user;
    if (this.OPlayer[user.uid] && this.OPlayer[user.uid].player) {
      const otherPlayer = this.OPlayer[user.uid];
      if (otherPlayer.player.x !== user.x || otherPlayer.player.y !== user.y) {
        await otherPlayer.moveTo(user.x, user.y, user.direction);
        otherPlayer.setMoving(true);
        // 애니메이션 설정 추가
        otherPlayer.playAnimation(user.direction);
      } else {
        otherPlayer.setMoving(false);
        // 애니메이션 정지
        otherPlayer.player.anims.stop();
      }
    }
  }

  /**
   * 게임 시작 전에 필요한 리소스를 미리 로드합니다.
   */
  preload() {
    for (let i = 0; i < chaArray.length; i++) {
      this.Player.Preload("player" + i, chaArray[i], "./meta/move.json");
    }

    this.load.tilemapTiledJSON("map", "./map/map.json");
    this.load.image("object", "./gfx/object.png");
    this.load.image("tile_asset", "./gfx/tile_asset.png");
    this.load.audio("step", "./sounds/move_sound_effect.mp3");
    // this.load.audio("bgm1", "./sounds/market_sound.mp3");
    // this.load.audio("bgm2", "./sounds/store_sound.mp3");

    // bullet
    this.load.image("bullet", "./assets/bullet_02.png");
    this.load.audio("shoot", "./sounds/gun_hand.mp3");

    // font
    this.load.bitmapFont(
      "font",
      "./fonts/MangoByeolbyeol.png",
      "./fonts/MangoByeolbyeol.xml"
    );
  }

  /**
   * 게임이 시작될 때 실행되는 함수입니다.
   * 게임에 필요한 객체들을 생성하고 초기화합니다.
   */
  create() {
    // 서버에 입장 메시지 전송
    this.socket.emit("join");

    // 맵 생성
    var map = this.make.tilemap({ key: "map" });
    var Asset = map.addTilesetImage("object", "object");
    this.add
      .image(0, 0, "tile_asset")
      .setOrigin(0, 0)
      .setDisplaySize(3480, 1280);

    // 레이어 생성
    var metaLayer = map.createLayer("Meta", [Asset], 0, 0);
    metaLayer.setVisible(false);
    var objectLayer1 = map.createLayer("Object Layer 1", [Asset], 0, 0);

    // 화면에 보이는 타일만 렌더링하도록 설정
    metaLayer.setCullPadding(2, 2);
    objectLayer1.setCullPadding(2, 2);

    // 월드 경계 설정
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const rand_0_9 = Math.floor(Math.random() * 6);

    // 사운드 객체 생성
    this.move_soundEffect = this.sound.add("step");
    this.move_soundEffect.playTime = 0.5;
    this.shoot_soundEffect = this.sound.add("shoot");

    // BGM 객체 생성
    // var bgm1 = this.sound.add("bgm1");
    // var bgm2 = this.sound.add("bgm2");

    // 플레이어 생성
    this.players = this.add.group();
    this.player = this.Player.Create(this.x, this.y, "player" + rand_0_9);
    this.players.add(this.player);


    // 캐릭터 이름 생성
    this.player.nameText = this.add.bitmapText(
      this.player.x - 10,
      this.player.y - 15,
      "font",
      this.username,
      12
    ); // or 8

    // 총알 생성
    this.bullets = this.physics.add.group({
      maxSize: 10,
      defaultKey: "bullet",
    });

    // 총알과 플레이어의 충돌 설정
    this.physics.add.overlap(
      this.players,
      this.bullets,
      this.handlePlayerHit,
      null,
      this
    );

    this.player.setCollideWorldBounds(true);

    // 카메라 설정
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // this.cameras.main.setSize(CAMERA_WIDTH, CAMERA_HEIGHT);
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5); // 카메라가 플레이어를 따라다니도록 설정

    // 카메라 데드존 설정
    // this.cameras.main.setDeadzone(100, 100);

    // 스크롤 설정
    this.scoll.create(this, map.widthInPixels, map.heightInPixels);

    // 충돌 레이어, 플레이어와 충돌 설정
    metaLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, metaLayer);

    if (this.syncUserReceived) {
      this.create_OPlayer();
    }

    // 장애물과 플레이어의 충돌 설정
    this.physics.add.collider(
      this.Player,
      this.obstacles,
      this.handleCollision,
      null,
      this
    );

    // this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors = this.input.keyboard.addKeys(
      {
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN,
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      },
      false
    );

    this.qKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Q,
      false
    );
    this.wKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W,
      false
    );
    this.eKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E,
      false
    );
    this.rKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R,
      false
    );
    this.oKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.O,
      false
    );
    // space key: shoot
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.scale.on("resize", this.resize, this);

    this.resize({ width: this.scale.width, height: this.scale.height });

    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const cam = this.cameras.main;
      const oldZoom = cam.zoom;

      // 플레이어 위치를 기준으로 계산
      const playerX = this.player.x;
      const playerY = this.player.y;

      // 줌 레벨 변경
      const newZoom = Phaser.Math.Clamp(oldZoom - deltaY * 0.001, 1.5, 3);
      if (newZoom === oldZoom) {
        return;
      }

      // 카메라 팔로우 일시 중지
      cam.stopFollow();

      // 줌 적용
      cam.setZoom(newZoom);

      // 플레이어 중심으로 카메라 이동
      cam.centerOn(playerX, playerY);

      // 일정 시간 후 카메라 팔로우 재개
      this.time.delayedCall(500, () => {
        cam.startFollow(this.player, true, 0.05, 0.05);
      });
    });

    // bgm1.on("complete", () => {
    //   bgm2.play();
    // });
    // bgm2.on("complete", () => {
    //   bgm1.play();
    // });
    // bgm1.play();
  }

  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    this.cameras.main.setViewport(0, 0, width, height);

    // 맵 크기 가져오기
    const map = this.make.tilemap({ key: "map" });
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    // 화면 크기와 맵 크기를 비교하여 줌 계산
    const zoomX = width / mapWidth;
    const zoomY = height / mapHeight;
    const zoom = Math.min(zoomX, zoomY);

    const minZoom = 1.5;
    this.cameras.main.setZoom(Math.max(zoom, minZoom));
  }

  async create_OPlayer() {

    if (!this.players) {
      console.error("players group is not initialized");
      return;
    }

    // 다른 플레이어들 생성
    for (let key in this.temp_OPlayer) {
      const user = this.temp_OPlayer[key];

      // const rand_0_9 = Math.floor(Math.random() * 6);
      // if (this.OPlayer[key]) {
      //   const oplayer_sprite = this.OPlayer[key].Create(
      //     user.x,
      //    user.y,
      //    "player" + rand_0_9
      //   );
      //   if (oplayer_sprite) {
      //     this.players.add(oplayer_sprite);
      //   } else {
      //     console.error("Failed to create sprite for player", key);
      //   }
      // } else {
      //   console.error("OPlayer not found for key", key);
      // }
      await this.createAndInitializeOPlayer(user);
    }

    // 다른 플레이어들을 players 그룹에 추가하여 충돌 판정 관리
    // for (let key in this.OPlayer) {
    //   this.players.add(this.OPlayer[key].sprite);
    // }
  }

  handlePlayerHit(player, bullet) {
    if (player && player.hit) {
      player.hit(bullet);
    } else if (player) {
      // OPlayer의 경우
      const angle = Phaser.Math.Angle.Between(
        bullet.x,
        bullet.y,
        player.x,
        player.y
      );
      const offsetX = Math.cos(angle) * 10; // 밀려나는 거리 조절
      const offsetY = Math.sin(angle) * 10; // 밀려나는 거리 조절

      this.tweens.add({
        targets: player,
        x: player.x + offsetX,
        y: player.y + offsetY,
        duration: 100,
        yoyo: true,
      });
    }

    // 서버로 피격 정보 전송
    // this.socket.emit("hit", {
    //   uid: this.uid,
    //   username: this.username,
    //   target: player.uid,
    // });

    if (bullet) {
      bullet.setActive(false).setVisible(false);
    }
  }

  /**
   * 게임이 실행되는 동안 계속 호출되는 함수입니다.
   * 게임의 주된 로직이 여기에 들어갑니다.
   * 이 함수는 1초에 60번 호출됩니다.
   * @param {number} time 현재 시간
   * @param {number} delta 이전 프레임에서 현재 프레임까지의 시간 간격
   */
  update(time, delta) {
    // 플레이어 이동
    // this.Player.Move(this.cursors, this.move_soundEffect);
    this.Player.Move_(this.input.keyboard, this.move_soundEffect);

    this.player.nameText.x = this.player.x - 10;
    this.player.nameText.y = this.player.y - 30;

    if (!this.lastPositionUpdateTime) {
      this.lastPositionUpdateTime = time;
    }

    if (
      time > this.lastPositionUpdateTime + 10 &&
      this.Player.oldPosition &&
      (this.player.x !== this.Player.oldPosition.x ||
        this.player.y !== this.Player.oldPosition.y)
    ) {
      const user = {
        uid: this.username,
        username: this.username,
        x: Math.round(this.player.x),
        y: Math.round(this.player.y),
        direction: this.Player.direction,
      };

      this.Player.oldPosition = { x: this.player.x, y: this.player.y };
      this.socket.emit("move", user);

      this.lastPositionUpdateTime = time;
    }

    // bullets
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      const pointer = this.input.activePointer;
      const bullet = this.bullets.get(this.player.x, this.player.y);
      if (bullet) {
        bullet.setActive(true).setVisible(true);

        // 총알 각도 설정
        const angle = Phaser.Math.Angle.Between(
          this.player.x,
          this.player.y,
          pointer.worldX,
          pointer.worldY
        );
        bullet.setRotation(angle).setScale(0.3, 0.3);

        this.physics.moveTo(bullet, pointer.x, pointer.y, 2000);
        // bullet.body.setVelocityY(-300);
        // bullet.body.velocity.y = -300;
        this.shoot_soundEffect.play({
          volume: 0.5,
        });
      }
    }

    this.bullets.children.each((bullet) => {
      if (
        bullet.active &&
        (bullet.y < 0 ||
          bullet.y > 1280 || // map height로 변경할 것
          bullet.x < 0 ||
          bullet.x > 3480) // map width로 변경할 것
      ) {
        bullet.setActive(false).setVisible(false);
      }
    }, this);

    // 'Q' 키가 눌렸을 때 실행할 코드
    // if (Phaser.Input.Keyboard.JustDown(this.qKey)) {
    // this.Player.moveTo(600, 320);
    // }
    //
    // if (Phaser.Input.Keyboard.JustDown(this.wKey)) {
    // this.Player.moveTo(1400, 320);
    // }
    //
    // if (Phaser.Input.Keyboard.JustDown(this.eKey)) {
    // this.Player.moveTo(2200, 320);
    // }
    //
    // if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
    // this.Player.moveTo(3000, 320);
    // }

    if (Phaser.Input.Keyboard.JustDown(this.oKey)) {
      window.dispatchEvent(
        new CustomEvent("start-video", {
          detail: {
            uid: this.uid,
            unsername: this.username,
          },
        })
      );
    }

    // if( Phaser.Input.Keyboard.JustDown(this.cursors.space)){
    //   console.log("space key down");
    // }
  }

  handleCollision(player, obstacle) {
    // 충돌 시 실행할 코드
    console.log("플레이어와 장애물이 충돌했습니다!");
  }
}

export default GameScene;

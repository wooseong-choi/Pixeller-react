import Phaser, { Game, GameObjects } from "phaser";

interface iChara {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  obj: globalThis.Phaser.Scene;
  width: number;
  height: number;
  speed: number;
  name: string;
  oldPosition: { x: number; y: number };
  direction: string;
  uid: number;
  onMove: boolean;

  Preload(
    key: string,
    url?: string,
    xhrSettings?: Phaser.Types.Loader.XHRSettingsObject
  ): void;

  Create(
    x: number,
    y: number,
    preset: string
  ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null;
  

  Move(cursor: Phaser.Types.Input.Keyboard.CursorKeys): void;
  Effect(): void;
  Destroy(): void;
}

class OPlayer implements iChara {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  obj: globalThis.Phaser.Scene;
  width: number;
  height: number;
  speed: number;
  name: string;
  oldPosition: { x: number; y: number };
  direction: string;
  uid: number;
  onMove: boolean;
  targetX: number;
  targetY: number;
  client_id: string;
  nameText: GameObjects.BitmapText;
  nameTextT: Phaser.GameObjects.Text;
  preset: string;

  constructor(
    obj: globalThis.Phaser.Scene,
    name: string,
    width: number,
    height: number,
    uid: number,
    client_id: string
  ) {
    this.obj = obj;
    this.width = width;
    this.height = height;
    this.speed = 200;
    this.name = name;
    this.direction = "down";
    this.uid = uid;
    this.onMove = false;
    this.client_id = client_id;
  }

  Preload(
    key: string,
    url?: string,
    xhrSettings?: Phaser.Types.Loader.XHRSettingsObject
  ) {
    this.obj.load.atlas(key, url, xhrSettings);
  }

  Create(
    x: number,
    y: number,
    preset: string
  ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    this.preset = preset;
    const playerWorkDConfig = {
      key: preset + "_walk_down",
      frames: this.obj.anims.generateFrameNames(preset, {
        start: 0,
        end: 3,
        prefix: "frame_0_",
      }),
      frameRate: 10,
      repeat: -1,
    };
    const playerWorkLConfig = {
      key: preset + "_walk_left",
      frames: this.obj.anims.generateFrameNames(preset, {
        start: 0,
        end: 3,
        prefix: "frame_1_",
      }),
      frameRate: 10,
      repeat: -1,
    };
    const playerWorkRConfig = {
      key: preset + "_walk_right",
      frames: this.obj.anims.generateFrameNames(preset, {
        start: 0,
        end: 3,
        prefix: "frame_2_",
      }),
      frameRate: 10,
      repeat: -1,
    };
    const playerWorkUConfig = {
      key: preset + "_walk_up",
      frames: this.obj.anims.generateFrameNames(preset, {
        start: 0,
        end: 3,
        prefix: "frame_3_",
      }),
      frameRate: 10,
      repeat: -1,
    };

    this.obj.anims.create(playerWorkDConfig);
    this.obj.anims.create(playerWorkLConfig);
    this.obj.anims.create(playerWorkRConfig);
    this.obj.anims.create(playerWorkUConfig);

    this.player = this.obj.physics.add.sprite(x, y, preset).setScale(0.8, 0.8);

    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.width, this.height, true);
    this.oldPosition = { x: x, y: y };

    // this.OPlayer[key].nameText = this.add.bitmapText(this.OPlayer[key].x - 10,this.OPlayer[key].y - 30,"font",user.username,12); // or 8
    this.nameText = this.obj.add.bitmapText(
      this.player.x - 10,
      this.player.y - 30,
      "font",
      this.name,
      12
    );

    return this.player;
  }

  Move(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    // deprecated method
  }

  setMoving(isMoving: boolean) {
    if (!this.player){
      console.error("Player not initialized");
      return;
    }
    this.onMove = isMoving;
    if (this.player && this.player.anims) {
      if (!isMoving) {
        this.player.anims.pause();
      } else {
        this.player.anims.resume();
      }
    }
  }

  // playAnimation(direction: string) {
  //   if (!this.player || !this.player.anims) {
  //     console.error("Player or animations not initialized");
  //     return;
  //   }
  //   const animationKey = `${this.preset}_walk_${direction}`;
    
  //   if (this.player.anims.exists(animationKey)) {
  //     this.player.play(animationKey, true);
  //   } else {
  //     console.warn(`Animation ${animationKey} not found`);
  //   }
  // }

  async moveTo(x: number, y: number, direction: string) {
    // Calculate the distance to the target
    const dx = x - this.player.x;
    const dy = y - this.player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.direction = direction;

    // Calculate the duration for the tween based on the distance to the target
    const duration = (distance / this.speed) * 10; // speed is in pixels per second, so multiply by 1000 to get duration in milliseconds

    // Create a tween that updates the player's position
    return new Promise<void>((resolve) => {
      this.obj.tweens.add({
        targets: [this.nameText],
        x: x - 10,
        y: y - 30,
        duration: duration,
        ease: "Linear",
        onComplete: () => {
          resolve();
        },
      });
      this.obj.tweens.add({
        targets: [this.player],
        x: x,
        y: y,
        duration: duration,
        ease: "Linear",
        onComplete: () => {
          this.onMove = false;
          if (this.player.anims) this.player.anims.pause();
          resolve();
        },
      });

      if (this.onMove) {
        this.player.anims.play(`${this.preset}_${direction}`, true);
      }
    });
  }

  moveToBlock(x: number, y: number) {
    if (!this.player) {
      console.error("Player not initialized");
      return;
    }
    const BLOCK_SIZE = 32;
    const targetX = Math.round(x / BLOCK_SIZE) * BLOCK_SIZE;
    const targetY = Math.round(y / BLOCK_SIZE) * BLOCK_SIZE;

    this.player.x = targetX;
    this.player.y = targetY;
  }

  hit(bullet) {
    if (!this.player) {
      console.error("Player not initialized");
      return;
    }
    const angle = Phaser.Math.Angle.Between(
      bullet.x,
      bullet.y,
      this.player.x,
      this.player.y
    );
    const offsetX = Math.cos(angle) * 10;
    const offsetY = Math.sin(angle) * 10;

    this.obj.tweens.add({
      targets: this.player,
      x: this.player.x + offsetX,
      y: this.player.y + offsetY,
      duration: 100,
      ease: "Linear",
      yoyo: true,
    });
  }

  Effect() {}

  Destroy() {
    if (this.player) {
      this.player.destroy();
    }
    if (this.nameText) {
      this.nameText.destroy();
    }
  }
}

export default OPlayer;
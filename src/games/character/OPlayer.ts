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
    this.speed = 160;
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
  ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null {
    this.preset = preset;
    const directions = ['down', 'left', 'right', 'up'];
    const frameIndexes = ['0', '1', '2', '3'];

    directions.forEach((dir, index) => {
      const config = {
        key: `${preset}_walk_${dir}`,
        frames: this.obj.anims.generateFrameNames(preset, {
          start: 0,
          end: 3,
          prefix: `frame_${frameIndexes[index]}_`,
        }),
        frameRate: 10,
        repeat: -1,
        duration: 400 // 40프레임 * (1초 / 10프레임) = 400ms
      };
      this.obj.anims.create(config);
    });

    this.player = this.obj.physics.add.sprite(x, y, preset).setScale(0.8, 0.8);

    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.width, this.height, true);
    this.oldPosition = { x: x, y: y };

    this.nameText = this.obj.add.bitmapText(
      this.player.x - 10,
      this.player.y - 30,
      "font",
      this.name,
      12
    );

    // 애니메이션 로드 확인
    directions.forEach(dir => {
      if (!this.obj.anims.exists(`${preset}_walk_${dir}`)) {
        // console.error(`Animation ${preset}_walk_${dir} not found`);
      }
    });

    if (!this.player.anims) {
      console.error('Animation component not initialized');
      return null;
    }

    return this.player;
  }

  Move(cursor: Phaser.Types.Input.Keyboard.CursorKeys) {
    // deprecated method
  }

  setMoving(isMoving: boolean) {
    this.onMove = isMoving;
    if (!isMoving) {
      this.player.anims.pause();
    } else {
      this.player.anims.resume();
    }
  }

  playAnimation(direction: string) {
    if (this.player.anims && this.player.anims.exists(`${this.preset}_walk_${direction}`)) {
      this.player.anims.play(`${this.preset}_walk_${direction}`, true);
    } else {
      // console.error(`Animation ${this.preset}_walk_${direction} not found`);
    }
  }

  async moveTo(x: number, y: number, direction: string) {
    try {
      const dx = x - this.player.x;
      const dy = y - this.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      this.direction = direction;

      const duration = (distance / this.speed) * 10;

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
          onUpdate: () => {
            this.playAnimation(direction);
          },
          onComplete: () => {
            this.onMove = false;
            if (this.player.anims) this.player.anims.stop();
            resolve();
          },
        });
      });
    } catch (error) {
      console.error('Error in moveTo:', error);
      console.log('Player object:', this.player);
      console.log('Animation state:', this.player.anims);
    }
  }

  moveToBlock(x: number, y: number) {
    const BLOCK_SIZE = 32;
    const targetX = Math.round(x / BLOCK_SIZE) * BLOCK_SIZE;
    const targetY = Math.round(y / BLOCK_SIZE) * BLOCK_SIZE;

    this.player.x = targetX;
    this.player.y = targetY;
  }

  Effect() {}

  Destroy() {
    this.player.destroy();
    this.nameText.destroy();
  }
}

export default OPlayer;
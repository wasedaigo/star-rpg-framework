/// <reference path='../collision/CollisionObject.ts' />
/// <reference path='../game/Game.ts' />
/// <reference path='../game/ResourcePreloader.ts' />
/// <reference path='./DatabaseManager.ts' />
/// <reference path='./Map.ts' />
/// <reference path='./MapCharacterChipset.ts' />
/// <reference path='./AnalogInputController.ts' />

module ebi.rpg {
    export class MapCharacter {
        private switchFrameDir_: number = 1;
        private frameNo_: number = 1;
        private dir_: number = 0;
        private timer_: number = 0;
        private sprite_: ebi.game.Sprite = null;
        private charaChipset_: MapCharacterChipset;
        private x_: number = 0;
        private y_: number = 0;
        private vx_: number;
        private vy_: number;
        private map_: Map;
        private collisionObject_: ebi.collision.CollisionObject;
        private controlable_: bool;
        private speed_: number;

        constructor(id: number, map: Map) {
            this.charaChipset_ = DatabaseManager.getCharaChipsetData(id);
            var image = ebi.game.ResourcePreloader.getImage(this.charaChipset_.src);
            this.frameNo_ = this.charaChipset_.defaultFrameNo;
            this.dir_ = 0;
            this.map_ = map;
            this.speed_ = 3;
            this.sprite_ = new ebi.game.Sprite(image);
            this.sprite_.srcX      = 0;
            this.sprite_.srcY      = 0;
            this.sprite_.srcWidth  = this.charaChipset_.size[0];
            this.sprite_.srcHeight = this.charaChipset_.size[1];
            this.collisionObject_ = ebi.collision.CollisionSystem.createCollisionCircle(
                this.charaChipset_.hitRect[0],
                this.charaChipset_.hitRect[1],
                this.charaChipset_.hitRect[2]
            );
            this.updateVisual(); 
        }

        public dispose(): void {
            this.collisionObject_.dispose();
        }

        public setPosition(x: number, y: number): void {
            this.collisionObject_.setPos(x, y);
        }

        public get width(): number {
            return this.sprite_.srcWidth;
        }

        public get height(): number {
            return this.sprite_.srcHeight;
        }

        public get screenX(): number {
            return this.collisionObject_.x;
        }

        public get screenY(): number {
            return this.collisionObject_.y;
        }

        public get controlable(): bool {
            return this.controlable_;
        }

        public set controlable(value: bool) {
            this.controlable_ = value;
        }

        public update(): void {
            // Save previous moving state
            var wasMoving: bool = this.isMoving;

            // Setup velocity
            this.vx_ = 0;
            this.vy_ = 0;
            if (this.controlable) {
                this.setVelocity(this.speed_ * AnalogInputController.inputDx, this.speed_ * AnalogInputController.inputDy);
            } else {
                this.setVelocity(0, 0);
            }

            this.updateDir();

            // Detect move stop event
            if (!this.isMoving && wasMoving) {
                this.onMoveStop();
            }

            // Update character state
            
            this.updateFrame();
            this.updateVisual();
        }

        private onMoveStop(): void {
            this.frameNo_ = this.charaChipset_.defaultFrameNo;
        }

        private get isMoving(): bool {
            return (this.vx_ !== 0 || this.vy_ !== 0);
        }

        private setVelocity(vx: number, vy: number): void {
            this.vx_ = vx;
            this.vy_ = vy;
            this.collisionObject_.setVelocity(vx * 32, vy * 32);
        }

        private updateDir(): void {
            if (!this.isMoving) {
                return;
            }

            var t = Math.atan2(this.vy_, this.vx_) / Math.PI; // -1.0 ~ 1.0
            // Match the angle with chipset image format
            var angle = 1.0 - (0.5 * t + 0.75 - (1 / (2 * this.charaChipset_.dirCount))) % 1.0; // 0.0 ~ 1.0
            this.dir_ = Math.floor(angle * this.charaChipset_.dirCount) % this.charaChipset_.dirCount;
        }

        private updateFrame(): void {
            if (!this.isMoving) {
                return;
            }

            this.timer_++;
            if (this.timer_ > 10) {
                this.timer_ = 0;
                this.frameNo_ += this.switchFrameDir_;

                // ----> switching the animation to the right
                if (this.frameNo_ >= this.charaChipset_.frameCount - 1) {
                    this.frameNo_ = this.charaChipset_.frameCount - 1;
                    this.switchFrameDir_ = -1;
                }

                // <---- switching the animation to the left
                if (this.frameNo_ <= 0) {
                    this.frameNo_ = 0;
                    this.switchFrameDir_ = 1;
                }
            }
        }

        private updateVisual(): void {
            // Update animation frame
            this.sprite_.srcX = (this.charaChipset_.srcIndex[0] * this.charaChipset_.frameCount + this.frameNo_) * this.charaChipset_.size[0];
            // Update animation dir
            this.sprite_.srcY = (this.charaChipset_.srcIndex[1] * this.charaChipset_.dirCount + this.dir_) * this.charaChipset_.size[1];

            this.sprite_.x = this.collisionObject_.x;
            this.sprite_.y = this.collisionObject_.y;
        }
    }
}

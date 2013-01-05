/// <reference path='../game/Game.ts' />
/// <reference path='./DatabaseManager.ts' />
/// <reference path='./ResourceManager.ts' />
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
        private vx_: number;
        private vy_: number;
        public controlable: bool;

        constructor(id: number) {
            this.charaChipset_ = DatabaseManager.getCharaChipsetData(id);
            var image = ResourceManager.getImage(this.charaChipset_.src);
            this.frameNo_ = this.charaChipset_.defaultFrameNo;
            this.dir_ = 0;
            this.sprite_ = new ebi.game.Sprite(image);
            this.sprite_.srcX      = 0;
            this.sprite_.srcY      = 0;
            this.sprite_.srcWidth  = this.charaChipset_.sizeX;
            this.sprite_.srcHeight = this.charaChipset_.sizeY;
            this.updateVisual();   
        }
        
        // x
        public get x(): number {
            return this.sprite_.x;
        }
        public set x(value: number) {
            this.sprite_.x = value;
        }

        // y
        public get y(): number {
            return this.sprite_.y;
        }
        public set y(value: number) {
            this.sprite_.y = value;
        }

        public update(): void {
            // Save previous moving state
            var wasMoving: bool = this.isMoving;

            // Setup velocity
            this.vx_ = 0;
            this.vy_ = 0;
            if (this.controlable) {
                this.setVelocity(AnalogInputController.inputDx, AnalogInputController.inputDy);
            }

            // Detect move stop event
            if (!this.isMoving && wasMoving) {
                this.onMoveStop();
            }

            // TODO: collision with map / characters

            // Update character state
            this.updateDir();
            this.updateFrame();
            this.updatePosition();
            this.updateVisual();
        }

        private onMoveStop(): void {
            this.frameNo_ = this.charaChipset_.defaultFrameNo;
        }

        private get isMoving(): bool {
            return (this.vx_ !== 0 || this.vy_ !== 0);
        }

        private setVelocity(vx: number, vy: number): void {
            this.vx_ = AnalogInputController.inputDx;
            this.vy_ = AnalogInputController.inputDy;
        }

        private updatePosition(): void {
            this.sprite_.x += this.vx_;
            this.sprite_.y += this.vy_;
        }

        private updateDir(): void {
            if (!this.isMoving) {
                return;
            }

            var t = Math.atan2(this.vy_, this.vx_) / Math.PI; // -1.0 ~ 1.0
            // Match the angle with chipset image format
            var angle = (0.5 * t + 1.5 - (1 / (2 * this.charaChipset_.dirCount))) % 1.0; // 0.0 ~ 1.0
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
            this.sprite_.srcX = (this.charaChipset_.indexW * this.charaChipset_.frameCount + this.frameNo_) * this.charaChipset_.sizeX;
            // Update animation dir
            this.sprite_.srcY = (this.charaChipset_.indexH * this.charaChipset_.dirCount + this.dir_) * this.charaChipset_.sizeY;
        }
    }
}

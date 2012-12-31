/// <reference path='../game/Game.ts' />
/// <reference path='./DatabaseManager.ts' />
/// <reference path='./ResourceManager.ts' />
/// <reference path='./MapCharacterChipset.ts' />
/// <reference path='./AnalogInputController.ts' />

module ebi.rpg {
    export class MapCharacter {
        // TODO: Rename it
        private a_: number = 1;
        private frameNo_: number = 1;
        private dir_: number = 0;
        private timer_: number = 0;
        private sprite_: ebi.game.Sprite = null;
        private charaChipset_: MapCharacterChipset;

        constructor(id: number) {
            this.charaChipset_ = DatabaseManager.getCharaChipsetData(id);
            var image = ResourceManager.getImage(this.charaChipset_.src);
            this.frameNo_ = this.charaChipset_.defaultFrameNo;
            this.dir_ = 0;
            this.sprite_ = new ebi.game.Sprite(image);
            this.sprite_.srcX      = (this.charaChipset_.indexW * this.charaChipset_.frameCount + this.frameNo_) * this.charaChipset_.sizeX;
            this.sprite_.srcY      = (this.charaChipset_.indexH * this.charaChipset_.dirCount + this.dir_) * this.charaChipset_.sizeY;
            this.sprite_.srcWidth  = this.charaChipset_.sizeX;
            this.sprite_.srcHeight = this.charaChipset_.sizeY;
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
            if (!AnalogInputController.hasInput) {
                return;
            }

            this.sprite_.x += AnalogInputController.inputDx;
            this.sprite_.y += AnalogInputController.inputDy;

            this.timer_++;
            if (this.timer_ > 10) {
                this.timer_ = 0;
                this.frameNo_ += this.a_;

                // ----> switching the animation to the right
                if (this.frameNo_ >= this.charaChipset_.frameCount - 1) {
                    this.frameNo_ = this.charaChipset_.frameCount - 1;
                    this.a_ = -1;
                }

                // <---- switching the animation to the left
                if (this.frameNo_ <= 0) {
                    this.frameNo_ = 0;
                    this.a_ = 1;
                }
            }
            
            // Update animation frame
            this.sprite_.srcX = (this.charaChipset_.indexW * this.charaChipset_.frameCount + this.frameNo_) * this.charaChipset_.sizeX;

            // Update animation dir
            this.sprite_.srcY = (this.charaChipset_.indexH * this.charaChipset_.dirCount + this.dir_) * this.charaChipset_.sizeY;
        }
    }
}

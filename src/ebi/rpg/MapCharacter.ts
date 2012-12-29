/// <reference path='../game/Game.ts' />
module ebi.rpg {
        export class MapCharacter {

        private a_: number = 1;
        private frameCount_: number = 1;
        private timer_: number = 0;
        private sprite_: ebi.game.Sprite = null;        
        public isPreloaded: bool;

        constructor(image: ebi.game.Image) {
            this.sprite_ = new ebi.game.Sprite(image, {srcX:32, srcY:48, srcWidth:32, srcHeight:48});
        }

        public update(): void {
            this.sprite_.x += 1;

            this.timer_++;
            if (this.timer_ > 10) {
                this.timer_ = 0;
                this.frameCount_ += this.a_;
                if (this.frameCount_ === 2 || this.frameCount_ === 0) {
                    this.a_ *= -1;
                }
            }

            this.sprite_.srcX = 32 * this.frameCount_;
        }
    }
}

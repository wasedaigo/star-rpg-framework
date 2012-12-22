/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='./Image.ts' />

module ebi.game {

    /*
     * Sprite
     *
     * I'll make a layer which holds multiple sprites later.
     */
    export class Sprite {

        private static ids_: number = 0;
        private static sprites_: Object = {};

        private ccSprite_: cc.Sprite;
        private image_: Image;

        public static get sprites(): Sprite[] {
            return Object.keys(sprites_).map((id) => {
                return sprites_[id];
            });
        }

        constructor(image: Image) {
            Sprite.ids_++;
            var id = Sprite.ids_;
            Sprite.sprites_[id.toString()] = this;

            this.image_ = image;
            var rect = new cc.Rect(0, 0, image.width, image.height);
            this.ccSprite_ = cc.Sprite.createWithTexture(image.innerImage, rect);
            this.ccSprite_.setAnchorPoint(new cc.Point(0, 0));
            this.ccSprite_.setTag(id);
        }

        private get id(): number {
            return this.ccSprite_.getTag();
        }

        public get image(): Image { return this.image_; }

        public get x(): number {
            return this.ccSprite_.getPositionX();
        }
        public set x(x: number) {
            this.ccSprite_.setPositionX(x);
        }

        public get y(): number {
            return this.ccSprite_.getPositionY();;
        }
        public set y(y: number) {
            this.ccSprite_.setPositionY(y);
        }

        public dispose(): void {
            delete Sprite.sprites_[this.id.toString()];
        }

        public get innerSprite(): cc.Sprite {
            return this.ccSprite_;
        }

    }

}

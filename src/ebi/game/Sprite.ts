/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='./IDrawable.ts' />
/// <reference path='./Image.ts' />

module ebi.game {

    /*
     * Sprite
     *
     * I'll make a layer which holds multiple sprites later.
     */
    export class Sprite implements IDrawable {

        private static ids_: number = 0;
        private static sprites_: Object = {};

        private ccSprite_: cc.Sprite;
        private image_: Image;

        private z_: number = 0;
        private srcX_: number;
        private srcY_: number;
        private srcWidth_: number;
        private srcHeight_: number;

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
            var rect = new cc.Rect(this.srcX_, this.srcY_, this.srcWidth_, this.srcHeight_);
            this.ccSprite_ = cc.Sprite.createWithTexture(image.innerImage, rect);
            this.ccSprite_.setAnchorPoint(new cc.Point(0, 1));
            // TODO: Replace the magic number. This should be unique in the global.
            this.ccSprite_.setTag(id + 1000000);
            this.x = 0;
            this.y = 0;
            this.srcX = 0;
            this.srcY = 0;
            this.srcWidth = image.width;
            this.srcHeight = image.height;
        }

        public get id(): number {
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
            // TODO: Replace the magic number
            return 480 - this.ccSprite_.getPositionY();;
        }
        public set y(y: number) {
            // TODO: Replace the magic number
            this.ccSprite_.setPositionY(480 - y);
        }

        public get z(): number {
            return this.z_;
        }

        public set z(z) {
            this.z_ = z;
        }

        // srcX
        public get srcX(): number {
            return this.srcX_;
        }
        public set srcX(value: number) {
            this.srcX_ = value;
            this.updateSrcRect();
        }

        // srcY
        public get srcY(): number {
            return this.srcY_;
        }
        public set srcY(value: number) {
            this.srcY_ = value;
            this.updateSrcRect();
        }

        // srcWidth
        public get srcWidth(): number {
            return this.srcWidth_;
        }
        public set srcWidth(value: number) {
            this.srcWidth_ = value;
            this.updateSrcRect();
        }

        // srcHeight
        public get srcHeight(): number {
            return this.srcHeight_;
        }
        public set srcHeight(value: number) {
            this.srcHeight_ = value;
            this.updateSrcRect();
        }

        public dispose(): void {
            delete Sprite.sprites_[this.id.toString()];
        }

        public get innerObject(): cc.Sprite {
            return this.ccSprite_;
        }

        private updateSrcRect(): void {
            this.ccSprite_.setTextureRect(new cc.Rect(this.srcX_, this.srcY_, this.srcWidth_, this.srcHeight_));
        }

    }

}

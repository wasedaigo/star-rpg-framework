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

        private srcX_: number;
        private srcY_: number;
        private srcWidth_: number;
        private srcHeight_: number;

        public static get sprites(): Sprite[] {
            return Object.keys(sprites_).map((id) => {
                return sprites_[id];
            });
        }

        constructor(image: Image, 
                    options?: {
                        srcX?:number;
                        srcY?:number;
                        srcWidth?:number;
                        srcHeight?:number;
                    }) {

            if (options) {
                this.srcX_ = options.srcX ? options.srcX : 0;
                this.srcY_ = options.srcY ? options.srcY : 0;
                this.srcWidth_ = options.srcWidth ? options.srcWidth : image.width;
                this.srcHeight_ = options.srcHeight ? options.srcHeight : image.height;
            }
            
            Sprite.ids_++;
            var id = Sprite.ids_;
            Sprite.sprites_[id.toString()] = this;

            this.image_ = image;
            var rect = new cc.Rect(this.srcX_, this.srcY_, this.srcWidth_, this.srcHeight_);
            this.ccSprite_ = cc.Sprite.createWithTexture(image.innerImage, rect);
            this.ccSprite_.setAnchorPoint(new cc.Point(0, 1));
            this.ccSprite_.setTag(id);
            this.x = 0;
            this.y = 0;
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
            // TODO: Replace the magic number
            return 480 - this.ccSprite_.getPositionY();;
        }
        public set y(y: number) {
            // TODO: Replace the magic number
            this.ccSprite_.setPositionY(480 - y);
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

        public get innerSprite(): cc.Sprite {
            return this.ccSprite_;
        }

        private updateSrcRect(): void {
            this.ccSprite_.setTextureRect(new cc.Rect(this.srcX_, this.srcY_, this.srcWidth_, this.srcHeight_));
        }

    }

}

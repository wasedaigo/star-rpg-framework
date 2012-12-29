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

        public srcX: number;
        public srcY: number;
        public srcWidth: number;
        public srcHeight: number;

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
                this.srcX = options.srcX ? options.srcX : 0;
                this.srcY = options.srcY ? options.srcY : 0;
                this.srcWidth = options.srcWidth ? options.srcWidth : image.width;
                this.srcHeight = options.srcHeight ? options.srcHeight : image.height;
            }
            
            Sprite.ids_++;
            var id = Sprite.ids_;
            Sprite.sprites_[id.toString()] = this;

            this.image_ = image;
            var rect = new cc.Rect(this.srcX, this.srcY, this.srcWidth, this.srcHeight);
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

        public dispose(): void {
            delete Sprite.sprites_[this.id.toString()];
        }

        public get innerSprite(): cc.Sprite {
            return this.ccSprite_;
        }

    }

}

/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='./DisplayObjects.ts' />
/// <reference path='./IDrawable.ts' />
/// <reference path='./Image.ts' />

module ebi.game {

    /*
     * Sprite
     *
     * I'll make a layer which holds multiple sprites later.
     */
    export class Sprite implements IDrawable {

        private ccSprite_: cc.Sprite;
        private image_: Image;

        private z_: number = 0;
        private srcX_: number;
        private srcY_: number;
        private srcWidth_: number;
        private srcHeight_: number;

        constructor(image: Image) {
            var id = DisplayObjects.add(this);
            this.image_ = image;
            var rect = new cc.Rect(this.srcX_, this.srcY_, this.srcWidth_, this.srcHeight_);
            this.ccSprite_ = cc.Sprite.createWithTexture(image.innerImage, rect);
            this.ccSprite_.setAnchorPoint(new cc.Point(0, 0));
            this.ccSprite_.setTag(id);
            this.srcX_ = 0;
            this.srcY_ = 0;
            this.srcWidth_ = image.width;
            this.srcHeight_ = image.height;
        }

        public get image(): Image {
            return this.image_;
        }

        public get x(): number {
            return this.ccSprite_.getPositionX();
        }
        public set x(newX: number) {
            this.ccSprite_.setPositionX(newX);
        }

        // This is workaround for TypeScript issue not being able to call baseclass accessor
        public setX(newX: number) {
            this.ccSprite_.setPositionX(newX);
        }

        public get y(): number {
            return this.ccSprite_.getPositionY();
        }
        public set y(newY: number) {
            this.ccSprite_.setPositionY(newY);
        }

        // This is workaround for TypeScript issue not being able to call baseclass accessor
        public setY(newY: number) {
            this.ccSprite_.setPositionY(newY);
        }

        public get z(): number {
            return this.z_;
        }

        public set z(newZ: number) {
            if (this.z_ !== newZ) {
                this.z_ = newZ;
                DisplayObjects.addDrawableToReorder(this);
            }
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

        // content width
        public get width(): number {
            return this.ccSprite_.getContentSize().width;
        }
        public set width(value: number) {
            var scaleX = value / this.ccSprite_.getContentSize().width;
            this.ccSprite_.setScaleX(scaleX);
        }

        // content height
        public get height(): number {
            return this.ccSprite_.getContentSize().height;
        }
        public set height(value: number) {
            var scaleY = value / this.ccSprite_.getContentSize().height;
            this.ccSprite_.setScaleY(scaleY);
        }

        public setVisible(isVisible: bool): void {
            this.ccSprite_.setVisible(isVisible);
        }

        public dispose(): void {
            DisplayObjects.remove(this);
        }

        public get innerObject(): cc.Sprite {
            return this.ccSprite_;
        }

        private updateSrcRect(): void {
            var rect = new cc.Rect(this.srcX_, this.srcY_, this.srcWidth_, this.srcHeight_);
            this.ccSprite_.setTextureRect(rect);
        }

    }

}

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
    export class Text implements IDrawable {

        private ccLabelTTF_: cc.LabelTTF;
        private z_: number = 0;
        
        constructor() {
            var id = DisplayObjects.add(this);

            this.ccLabelTTF_ = new cc.LabelTTF();
            this.ccLabelTTF_.setTag(id);

            this.ccLabelTTF_.setFontName("Arial");
            this.ccLabelTTF_.setFontSize(16);
            this.ccLabelTTF_.setColor(new cc.Color3B(0, 0, 0));
        }

        public get text(): string {
            return this.ccLabelTTF_.getString();
        }
        public set text(newText: string) {
            this.ccLabelTTF_.setString(newText);
        }

        public get x(): number {
            return this.ccLabelTTF_.getPositionX();
        }
        public set x(newX: number) {
            this.ccLabelTTF_.setPositionX(newX);
        }

        public get y(): number {
            return this.ccLabelTTF_.getPositionY();;
        }
        public set y(newY: number) {
            this.ccLabelTTF_.setPositionY(newY);
        }

        // content width
        public get width(): number {
            return this.ccLabelTTF_.getDimensions().width;
        }
        public set width(value: number) {
            this.ccLabelTTF_.setDimensions(new cc.Size(value, this.height));
        }

        // content height
        public get height(): number {
            return this.ccLabelTTF_.getDimensions().height;
        }
        public set height(value: number) {
            this.ccLabelTTF_.setDimensions(new cc.Size(this.width, value));
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

        public setVisible(isVisible: bool): void {
            this.ccLabelTTF_.setVisible(isVisible);
        }

        public dispose(): void {
            DisplayObjects.remove(this);
        }

        public get innerObject(): cc.LabelTTF {
            return this.ccLabelTTF_;
        }
    }

}

///<reference path='../cocos2d.d.ts'/>
module ebi {

    // TODO: Use 'Member Accessor Declarations'

    /*
     * Audio
     */
    class Audio {
        static playBgm(): void {
        }
        static stopBgm(): void {
        }
        static playSE(): void {
        }
        static stopAllSEs(): void {
        }
    }

    /*
     * Color
     */
    class Color {
        constructor(public red:   number,
                    public green: number,
                    public blue:  number,
                    public alpha: number) {
        }
    }

    /*
     * Font
     */
    class Font {
        constructor(public name:     string,
                    public size:     number,
                    public isBold:   bool,
                    public isItalic: bool,
                    public color:    Color) {
        }
    }

    /*
     * Graphics
     */
    class Graphics {
    }

    /*
     * An image.
     * The Image object is immutable.
     */
    class Image {
        isDisposed_: bool;
        constructor(public width:  number,
                    public height: number) {
        }
        dispose(): void {
        }
        isDisposed(): bool {
            return this.isDisposed_;
        }
        rect(): Rect {
            return null;
        }
        // TODO: How to draw a text?
        static load(path: string): Image {
            // URL? File?
            return null;
        }
    }

    /*
     * Input
     */
    class Input {
    }

    /*
     * Layer
     */
    class Layer {
        constructor(public x:      number,
                    public y:      number,
                    public width:  number,
                    public height: number,
                    public scaleX: number,
                    public scaleY: number,
                    public angle:  number,
                    public alpha:  number) {
            // TODO: tone
        }
        // Tiles
    }

    /*
     * Sprite
     */
    class Sprite {
        constructor(public layer:   Layer,
                    public image:   Image,
                    public x:       number,
                    public y:       number,
                    public srcRect: Rect,
                    public scaleX:  number,
                    public scaleY:  number,
                    public angle:   number,
                    public alpha:   number) { // TODO: tone
        }
        dispose(): void {
        }
        isDisposed(): bool {
            return false;
        }
        flash() {
            /* is this needed? */
        }
        // TODO: Use Matrix?
    }

    /*
     * Rect
     */
    class Rect {
        constructor(public x:      number,
                    public y:      number,
                    public width:  number,
                    public height: number) {
        }
    }

    /*
     * Internal implementation for catching input-event
     */
    class InputLayer extends cc.Layer {
        private onTouchBegan(touch, event) {
            console.log("onTouchBegan");
        }

        private onTouchMoved(touch, event) {
            console.log("onTouchMoved");
        }

        private onTouchEnded(touch, event) {
            console.log("onTouchEnded");
        }

        private onTouchesBegan(touches, event) {
            console.log("onTouchesBegan");
        }

        private onTouchesMoved(touches, event) {
            console.log("onTouchesMoved" + JSON.stringify(touches[0]));
        }

        private onTouchesEnded(touches, event) {
            console.log("onTouchesEnded");
        }
    }

    /*
     * Scene
     */
    export class Scene extends cc.Scene {
        public start(): void {}
        public terminate(): void {}

        public onEnter(): void {
            super.onEnter();
            this.scheduleUpdate();
            this.start();

            var layer = new InputLayer();
            layer.init();
            layer.setTouchEnabled(true);
            this.addChild(layer);
        }

        public onExit(): void {
            super.onExit();
            this.terminate();
        }

        public update(dt:number): void {}
    }
}

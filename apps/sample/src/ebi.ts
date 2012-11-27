///<reference path='../cocos2d.d.ts'/>
module ebi {

    // TODO: Use 'Member Accessor Declarations'

    /*
     * An immutable image
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
     * Layer
     */
    class Layer {
        constructor(public x:      number,
                    public y:      number,
                    public width:  number,
                    public height: number,
                    public scaleX: number,
                    public scaleY: number,
                    public angle:  number) {
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
     * Scene
     */
    export class Scene extends cc.Scene {
        public start(): void {}
        public terminate(): void {}

        public onEnter(): void {
            super.onEnter();
            this.scheduleUpdate();
            this.start();
        }

        public onExit(): void {
            super.onExit();
            this.terminate();
        }

        public update(dt:number): void {}
    }
}

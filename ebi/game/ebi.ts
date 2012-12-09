/// <reference path='./cocos2d.d.ts' />

module ebi {

    export module game {

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
         * Tone
         */
        export class Tone {
            constructor(public red:   number = 0,
                        public green: number = 0,
                        public blue:  number = 0,
                        public gray: number = 0) {
            }

            public clone(): Tone {
                //TODO
                return null;
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
        export class Graphics {
            public static update(): void {}
            public static freeze(): void {}
            public static transition(duration:number): void {}
            public static get width(): number {
                return 0; // TODO
            }

            public static get height(): number {
                return 0; // TODO
            }
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
         * Point
         */
        export class Point {
            constructor(public x:      number,
                        public y:      number) {
            }
        }

        /*
         * Rect
         */
        export class Rect {
            constructor(public x:      number,
                        public y:      number,
                        public width:  number,
                        public height: number) {
            }
        }

    }

}

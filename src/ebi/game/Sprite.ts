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

        private id_: number = 0;
        private image_: Image;
        private x_: number = 0;
        private y_: number = 0;

        public static get sprites(): Sprite[] {
            return Object.keys(sprites_).map(function (id) {
                return sprites_[id];
            });
        }

        constructor() {
            Sprite.ids_++;
            this.id_ = Sprite.ids_;
            Sprite.sprites_[this.id_.toString()] = this;
        }

        public get image(): Image { return this.image_; }
        public set image(image: Image) { this.image_ = image; }

        public get x(): number { return this.x_; }
        public set x(x: number) { this.x_ = x; }

        public get y(): number { return this.y_; }
        public set y(y: number) { this.y_ = y; }

        public dispose(): void {
            delete Sprite.sprites_[this.id_.toString()];
        }

    }

}

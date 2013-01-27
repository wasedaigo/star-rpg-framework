/// <reference path='../../game/Sprite.ts' />
/// <reference path='../../game/Image.ts' />
/// <reference path='./Map.ts' />

module ebi.rpg.map {
    export class MapSprite extends ebi.game.Sprite {
        public relativeMultiplierX: number = 1;
        public relativeMultiplierY: number = 1;
        public relativeY: number = 0;
        private sprite_: ebi.game.Sprite;
        private x_: number = 0;
        private y_: number = 0;
        private map_: Map;

        constructor(image: ebi.game.Image, map: Map) {
            super(image);
            this.map_ = map;
        }

        public get x(): number {
            return this.x_;
        }
        public set x(newX: number) {
            this.x_ = newX;
            super.setX(this.x_ + this.map_.scrollX * this.relativeMultiplierX)
        }

        public get y(): number {
            return this.y_;
        }
        public set y(newY: number) {
            this.y_ = newY;
            super.setY(this.y_ + this.map_.scrollY * this.relativeMultiplierY)
        }
    }
}

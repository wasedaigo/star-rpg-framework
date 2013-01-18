/// <reference path='./Map.ts' />
/// <reference path='./MapCharacter.ts' />
/// <reference path='../game/Camera.ts' />

module ebi.rpg {
    export class MapCamera {
        private focusX_: number;
        private focusY_: number;
        private map_: Map;
        public focusTarget: MapCharacter;

        constructor(map: Map) {
            this.map_ = map;
        }

        public update(): void {
            if (this.focusTarget) {
                this.focusX_ = this.focusTarget.screenX;
                this.focusY_ = this.focusTarget.screenY;

                var halfScreenWidth = 160;//TODO magic number
                var halfScreenHeight = 240;//TODO magic number
                
                var sx = halfScreenWidth;
                var sy = halfScreenHeight;
                var ex = Math.max(0, this.map_.width - halfScreenWidth);
                var ey = Math.max(0, this.map_.height - halfScreenHeight); 

                this.focusX_ = Math.min(Math.max(sx, this.focusX_), ex);
                this.focusY_ = Math.min(Math.max(sy, this.focusY_), ey);

                game.Camera.x = halfScreenWidth - this.focusX_; 
                game.Camera.y = halfScreenHeight - this.focusY_; 
            }
        }

        public get focusX(): number {
            return this.focusX_;
        }

        public get focusY(): number {
            return this.focusY_;
        }
    }
}

/// <reference path='./Map.ts' />
/// <reference path='./MapCharacter.ts' />
/// <reference path='../game/Camera.ts' />

module ebi.rpg.map {
    export class MapCamera {
        private focusX_: number;
        private focusY_: number;
        private map_: Map;
        public focusTarget: MapCharacter;

        constructor(map: Map) {
            this.map_ = map;
            ebi.game.Camera.scaleX = 1;
            ebi.game.Camera.scaleY = 1;
        }

        public update(): void {
            if (this.focusTarget) {


                //TODO magic number, we need to get logical screen width
                var halfScreenWidth = 160 / ebi.game.Camera.scaleX;

                //TODO magic number, we need to get logical screen height
                var halfScreenHeight = 240 / ebi.game.Camera.scaleY; 
                
                var sx = halfScreenWidth;
                var sy = halfScreenHeight;
                var ex = Math.max(0, this.map_.width - halfScreenWidth);
                var ey = Math.max(0, this.map_.height - halfScreenHeight); 

                var tx = this.focusTarget.screenX + this.focusTarget.width / 2;
                this.focusX_ = Math.min(Math.max(sx, tx), ex);

                var ty = this.focusTarget.screenY + this.focusTarget.height / 2;
                this.focusY_ = Math.min(Math.max(sy, ty), ey);

                ebi.game.Camera.x = (halfScreenWidth - this.focusX_) * ebi.game.Camera.scaleX; 
                ebi.game.Camera.y = (halfScreenHeight - this.focusY_) * ebi.game.Camera.scaleY; 
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

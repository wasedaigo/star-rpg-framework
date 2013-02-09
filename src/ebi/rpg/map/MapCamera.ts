/// <reference path='../Const.ts' />
/// <reference path='./Map.ts' />
/// <reference path='./MapCharacter.ts' />

module ebi.rpg.map {
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
                //TODO magic number, we need to get logical screen width
                var halfScreenWidth = ebi.Const.ScreenWidth / 2;

                //TODO magic number, we need to get logical screen height
                var halfScreenHeight = ebi.Const.ScreenHeight / 2;
                
                var sx = halfScreenWidth;
                var sy = halfScreenHeight;
                var ex = Math.max(0, this.map_.width - halfScreenWidth);
                var ey = Math.max(0, this.map_.height - halfScreenHeight); 

                var tx = this.focusTarget.screenX + this.focusTarget.width / 2;
                this.focusX_ = Math.min(Math.max(sx, tx), ex);

                var ty = this.focusTarget.screenY + this.focusTarget.height / 2;
                this.focusY_ = Math.min(Math.max(sy, ty), ey);

                this.map_.scrollX = (halfScreenWidth - this.focusX_); 
                this.map_.scrollY = (halfScreenHeight - this.focusY_); 
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

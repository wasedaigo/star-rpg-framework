/// <reference path='../game/TmxTiledMap.ts' />
module ebi.rpg {
    export class Map {
        private tmxTiledMap_: ebi.game.TmxTiledMap;

        constructor() {
            this.tmxTiledMap_ = new ebi.game.TmxTiledMap('sample');

            // TODO Confirm preloading is working properly
            this.tmxTiledMap_.setLayerZ('bottom', 0);
            this.tmxTiledMap_.setLayerZ('middle', 0);
            this.tmxTiledMap_.setLayerZ('top',    1);
        }

        public get gridSizeX(): number {
            return 32;
        }

        public get gridSizeY(): number {
            return 32;
        }

        public get mapWidth(): number {
            return this.tmxTiledMap_.mapWidth;
        }

        public get mapHeight(): number {
            return this.tmxTiledMap_.mapHeight;
        }

        public getCollisionAt(x: number, y: number): number {
            return this.tmxTiledMap_.getCollisionAt(x, y);
        }
    }
}

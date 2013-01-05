/// <reference path='../game/TmxTiledMap.ts' />
module ebi.rpg {
    export class Map {
        private tmxTiledMap_: ebi.game.TmxTiledMap;

        constructor() {
            this.tmxTiledMap_ = new ebi.game.TmxTiledMap();

            // TODO Confirm preloading is working properly
            this.tmxTiledMap_.loadMap('sample', ['bottom', 'middle', 'top']);
            this.tmxTiledMap_.setLayerZ('bottom', 0);
            this.tmxTiledMap_.setLayerZ('middle', 0);
            this.tmxTiledMap_.setLayerZ('top',    1);


            // Test for getting collision data
            /*
            for (var i = 0; i < map_.mapWidth; i++) {
                for (var j = 0; j < map_.mapHeight; j++) {
                    var collision = map_.getCollisionAt(i, j);
                    console.log(i + "," + j + " = " + collision);
                }
            }
            */
        }
    }
}

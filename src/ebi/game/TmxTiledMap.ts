/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='./TmxLayer.ts' />

module ebi.game {

    export class TmxTiledMap {

        private static prefix_: string = 'res/tmx/';
        private static ccTMXTiledMap_: cc.TMXTiledMap = null;
        private static tmxLayers_: {[s: string]: TmxLayer;} = {};

        // TODO: Make it async
        public static loadMap(id: string, layerInfo: {[s: string]: number;}) {
            ccTMXTiledMap_ = cc.TMXTiledMap.create(TmxTiledMap.prefix_ + id + '.tmx');

            for (var layerName in layerInfo) {
                var z = layerInfo[layerName];
                var layer = ccTMXTiledMap_.getLayer(layerName);
                ccTMXTiledMap_.removeChild(layer, false);
                tmxLayers_[layerName] = new TmxLayer(layer);
                tmxLayers_[layerName].z = z;
            }
        }

        public static get isMapLoaded(): bool {
            return !!ccTMXTiledMap_;
        }

        public static get mapWidth(): number {
            var size = ccTMXTiledMap_.getMapSize();
            return size.width;
        }

        public static get mapHeight(): number {
            var size = ccTMXTiledMap_.getMapSize();
            return size.height;
        }

        public static getProperties(layerName: string, key: string): any[] {
            var layer = ccTMXTiledMap_.getLayer(layerName);
            
            var result = [];
            if (layer) {
                var tiles = layer.getTiles();
                tiles.forEach((gid) => {
                    var properties = ccTMXTiledMap_.propertiesForGID(gid);
                    if (properties) {
                        var property = properties[key];
                        result.push(property);
                    } else {
                        result.push(null);
                    }
                })
            } else {
                console.log("No layer defined for layerName = " + layerName);
            }
            return result;
        }
    }

}

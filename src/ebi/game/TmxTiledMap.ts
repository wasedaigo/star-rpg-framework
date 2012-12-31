/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../IDrawable.ts' />

module ebi.game {

    export class TmxTiledMap implements IDrawable {

        private static ids_: number = 0;
        private static tmxTiledMaps_: Object = {};
        private static prefix_: string = 'res/tmx/';

        private ccTMXTiledMap_: cc.TMXTiledMap = null;
        private z_: number = 0;

        public static get tmxTiledMaps(): TmxTiledMap[] {
            return Object.keys(tmxTiledMaps_).map((id) => tmxTiledMaps_[id]);
        }

        constructor() {
            TmxTiledMap.ids_++;
            var id = TmxTiledMap.ids_;
            TmxTiledMap.tmxTiledMaps_[id.toString()] = this;
            this.z = 0;
        }

        // TODO: Make it async
        public loadMap(id: string) {
            this.ccTMXTiledMap_ = cc.TMXTiledMap.create(TmxTiledMap.prefix_ + id + '.tmx');
            // TODO: Replace the magic number. This should be unique in the global.
            this.ccTMXTiledMap_.setTag(1 + 2000000);
        }

        public get isMapLoaded(): bool {
            return !!this.ccTMXTiledMap_;
        }

        public get z(): number {
            return this.z_;
        }

        public set z(z) {
            this.z_ = z;
        }

        public get innerObject(): cc.TMXTiledMap {
            return this.ccTMXTiledMap_;
        }

        public get mapWidth(): number {
            var size = this.ccTMXTiledMap_.getMapSize();
            return size.width;
        }

        public get mapHeight(): number {
            var size = this.ccTMXTiledMap_.getMapSize();
            return size.height;
        }

        public getProperties(layerName: string, key: string): any[] {
            var layer = this.ccTMXTiledMap_.getLayer(layerName);
            
            var result = [];
            if (layer) {
                var tiles = layer.getTiles();
                tiles.forEach((gid)=>{
                    var properties = this.ccTMXTiledMap_.propertiesForGID(gid);
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

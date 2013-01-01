/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../IDrawable.ts' />

module ebi.game {

    export class TmxTiledMap implements IDrawable {

        private static prefix_: string = 'res/tmx/';

        private ccTMXTiledMap_: cc.TMXTiledMap = null;
        private id_: number;
        private z_: number = 0;

        constructor() {
            var id = DisplayObjects.add(this);
            this.id_ = id;
            this.z = 0;
        }

        // TODO: Make it async
        public loadMap(id: string) {
            this.ccTMXTiledMap_ = cc.TMXTiledMap.create(TmxTiledMap.prefix_ + id + '.tmx');
            this.ccTMXTiledMap_.setTag(this.id_);
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
                tiles.forEach((gid) => {
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
        
        public dispose(): void {
            DisplayObjects.remove(this);
        }
    }

}

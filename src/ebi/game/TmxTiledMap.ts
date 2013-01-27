/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../IDrawable.ts' />

module ebi.game {

    class TmxLayer implements IDrawable {

        private ccTMXLayer_: cc.TMXLayer;
        private z_: number = 0;
        private firstGid_: number = 0;

        constructor(ccTMXLayer: cc.TMXLayer) {
            var id = DisplayObjects.add(this);
            this.ccTMXLayer_ = ccTMXLayer;
            this.ccTMXLayer_.setTag(id);
            this.firstGid_ = this.ccTMXLayer_.getTileSet().firstGid;
            this.z = 0;
        }

        public set x(value: number) {
            this.ccTMXLayer_.setPositionX(value);
        }

        public get x(): number {
            return this.ccTMXLayer_.getPositionX();
        }  

        public set y(value: number) {
            this.ccTMXLayer_.setPositionY(value);
        }

        public get y(): number {
            return this.ccTMXLayer_.getPositionY();
        } 

        public get z(): number {
            return this.z_;
        }

        public set z(tz: number) {
            if (this.z_ !== tz) {
                this.z_ = tz;
                DisplayObjects.addDrawableToReorder(this);
            }
        }
        
        public get innerObject(): cc.Node {
            return this.ccTMXLayer_;
        }

        public getTileIdAt(x: number, y: number): number {
            var gid = this.ccTMXLayer_.getTileGIDAt(new cc.Point(x, y));

            // The position of tile in tileset defines its id
            var id = gid - this.firstGid_;
            if (id < 0) {
                id = -1;
            }

            return id;
        }

        public dispose(): void {
            DisplayObjects.remove(this);
        }
    }

    export class TmxTiledMap {

        private static prefix_: string = 'res/tmx/';

        private ccTMXTiledMap_: cc.TMXTiledMap = null;
        private layers_: Object = {};
        private mapSize_: cc.Size;

        /*
         * NOTICE: If the resource is not loaded by ResourcePreloader, this constructor will fail.
         */
        constructor(id: string) {
            this.ccTMXTiledMap_ = cc.TMXTiledMap.create(TmxTiledMap.prefix_ + id + '.tmx');
            var layerNames = this.ccTMXTiledMap_.getChildren().filter((node: cc.Node) => {
                return node instanceof cc.TMXLayer;
            }).map((node: cc.Node): string => {
                var layer = <cc.TMXLayer>node;
                return layer.getLayerName();
            });
            layerNames.forEach((layerName: string) => {
                var layer = this.ccTMXTiledMap_.getLayer(layerName);
                this.ccTMXTiledMap_.removeChild(layer, false);
                this.layers_[layerName] = new TmxLayer(layer);
            });
            this.mapSize_ = this.ccTMXTiledMap_.getMapSize();
        }

        public set x(value: number) {
            Object.keys(this.layers_).forEach((layerName) => {
                var layer = this.layers_[layerName];
                layer.x = value;
            });
        }

        public set y(value: number) {
            Object.keys(this.layers_).forEach((layerName) => {
                var layer = this.layers_[layerName];
                layer.y = value;
            });
        }      

        public setLayerZ(layerName: string, z: number) {
            this.layers_[layerName].z = z;
        }

        public get isMapLoaded(): bool {
            return !!this.ccTMXTiledMap_;
        }

        public get innerObject(): cc.TMXTiledMap {
            return this.ccTMXTiledMap_;
        }

        public get xCount(): number {
            return this.mapSize_.width;
        }

        public get yCount(): number {
            return this.mapSize_.height;
        }

        // Get collision at specific location (grid)
        // We are assuming collision layer is defined
        public getTileId(x: number, y: number, layerName: string): number {
            // If it is trying to get collision outside of map,
            // it returns collidable flag
            if (x < 0 || x >= this.xCount || y < 0 || y >= this.yCount) {
                return -1;
            }
            var layer = this.layers_[layerName];
            var id = layer.getTileIdAt(x, this.yCount - y - 1);

            return id;
        }
        
        public dispose(): void {
            Object.keys(this.layers_).forEach((layerName) => {
                var layer = this.layers_[layerName];
                layer.dispose();
                delete this.layers_[layerName];
            });
        }
    }

}

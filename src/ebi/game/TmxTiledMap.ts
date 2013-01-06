/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../IDrawable.ts' />

module ebi.game {

    class TmxLayer implements IDrawable {

        private ccTMXLayer_: cc.TMXLayer;
        private z_: number = 0;

        constructor(ccTMXLayer: cc.TMXLayer) {
            var id = DisplayObjects.add(this);
            this.ccTMXLayer_ = ccTMXLayer;
            this.ccTMXLayer_.setTag(id);
            this.z = 0;
        }

        public get z(): number {
            return this.z_;
        }

        public set z(z) {
            if (this.z_ !== z) {
                this.z_ = z;
                DisplayObjects.addDrawableToReorder(this);
            }
        }
        
        public get innerObject(): cc.Node {
            return this.ccTMXLayer_;
        }

        public dispose(): void {
            DisplayObjects.remove(this);
        }

    }

    export class TmxTiledMap {

        private static prefix_: string = 'res/tmx/';

        private ccTMXTiledMap_: cc.TMXTiledMap = null;
        //private layers_: {[name: string]: TmxLayer;} = {};
        private layers_: Object = {};

        // TODO: Make it async
        public loadMap(id: string) {
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

        public get mapWidth(): number {
            var size = this.ccTMXTiledMap_.getMapSize();
            return size.width;
        }

        public get mapHeight(): number {
            var size = this.ccTMXTiledMap_.getMapSize();
            return size.height;
        }

        // Get collision at specific location
        // We are assuming collision layer is defined
        public getCollisionAt(x: number, y: number): number {
            // TODO: Getting firstGid each time is not optimal
            var layer = this.ccTMXTiledMap_.getLayer('collision');
            var tileset = layer.getTileSet();
            var gid = layer.getTileGIDAt(new cc.Point(x, y));
            // The position of tile in tileset defines its collision attribute
            var d = gid - tileset.firstGid;
            if (d < 0) {
                d = -1;
            }

            return d;
        }
        
        public dispose(): void {
            var keys = Object.keys(this.layers_);
            keys.forEach((layerName) => {
                var layer = this.layers_[layerName];
                layer.dispose();
                delete this.layers_[layerName];
            });
        }
    }

}

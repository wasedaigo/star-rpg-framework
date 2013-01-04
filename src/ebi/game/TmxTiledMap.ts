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
            if (this.z_ !== z) {
                this.z_ = z;
                DisplayObjects.addDrawableToReorder(this);
            }
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
            var layer = this.ccTMXTiledMap_.getLayer("collision");
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
            DisplayObjects.remove(this);
        }
    }

}

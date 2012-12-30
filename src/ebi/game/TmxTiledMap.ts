/// <reference path='../../cc/cocos2d.d.ts' />

module ebi.game {

    export class TmxTiledMap {

        private static ccTMXTiledMap_: cc.TMXTiledMap = null;
        private static prefix_: string = 'res/tmx/';

        // TODO: Make it async
        public static loadMap(id: string) {
            ccTMXTiledMap_ = cc.TMXTiledMap.create(prefix_ + id + '.tmx');
            // TODO: Replace the magic number. This should be unique in the global.
            ccTMXTiledMap_.setTag(1 + 2000000);
        }

        public static get isMapLoaded(): bool {
            return !!ccTMXTiledMap_;
        }

        public static get innerTmxTiledMap(): cc.TMXTiledMap {
            return ccTMXTiledMap_;
        }

        public static get bottomLayer(): cc.Node {
            return ccTMXTiledMap_.getLayer('bottom');
        }

        public static get middleLayer(): cc.Node {
            return ccTMXTiledMap_.getLayer('middle');
        }

        public static get topLayer(): cc.Node {
            return ccTMXTiledMap_.getLayer('top');
        }

        // TODO: ???
        public static disposeMap(): void {
            delete ccTMXTiledMap_;
        }
    }

}

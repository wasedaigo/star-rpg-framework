/// <reference path='../../cc/cocos2d.d.ts' />

module ebi.game {

    export class TmxTiledMap {

        private static ids_: number = 0;
        private static tmxTiledMaps_: Object = {};
        private static prefix_: string = 'res/tmx/';

        private ccTMXTiledMap_: cc.TMXTiledMap = null;

        public static get tmxTiledMaps(): TmxTiledMap[] {
            return Object.keys(tmxTiledMaps_).map((id) => tmxTiledMaps_[id]);
        }

        constructor() {
            TmxTiledMap.ids_++;
            var id = TmxTiledMap.ids_;
            TmxTiledMap.tmxTiledMaps_[id.toString()] = this;
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

        public get innerTmxTiledMap(): cc.TMXTiledMap {
            return this.ccTMXTiledMap_;
        }

        public get bottomLayer(): cc.Node {
            return this.ccTMXTiledMap_.getLayer('bottom');
        }

        public get middleLayer(): cc.Node {
            return this.ccTMXTiledMap_.getLayer('middle');
        }

        public get topLayer(): cc.Node {
            return this.ccTMXTiledMap_.getLayer('top');
        }

    }

}

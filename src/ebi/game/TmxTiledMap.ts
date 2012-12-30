/// <reference path='../../cc/cocos2d.d.ts' />
module ebi.game {

    export class TmxTiledMap {
        private static mapObject_: cc.TMXTiledMap = null;
        private static prefix_: string = "res/tmx/";

        public static loadMap(id: string) {
        	mapObject_ = cc.TMXTiledMap.create(prefix_ + id + ".tmx");
        }

        public static get isMapLoaded(): bool {
        	return !!mapObject_;
        }

        public static get mapObject(): cc.TMXTiledMap {
            return mapObject_;
        }

        public static get bottomLayer(): cc.Node {
            return mapObject_.getLayer("bottom");
        }

        public static get middleLayer(): cc.Node {
            return mapObject_.getLayer("middle");
        }

        public static get topLayer(): cc.Node {
            return mapObject_.getLayer("top");
        }

        public static disposeMap(): void {
            delete mapObject_;
        }
    }

}

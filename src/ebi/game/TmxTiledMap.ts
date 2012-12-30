/// <reference path='../../cc/cocos2d.d.ts' />
module ebi.game {

    export class TmxTiledMap {
        private static mapObject: cc.TMXTiledMap = null;
        private static prefix: string = "res/tmx/";

        public static loadMap(id: string) {
        	mapObject = cc.TMXTiledMap.create(prefix + id + ".tmx");
        }

        public static get innerDisplayObject(): cc.TMXTiledMap {
            return mapObject;
        }

        public static disposeMap(): void {
            delete mapObject;
        }
    }

}

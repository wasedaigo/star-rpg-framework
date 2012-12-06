/// <reference path='./cocos2d.d.ts' />
/// <reference path='./ebi.ts' />

module ebi {

    export module game {

        /*
         * TextureCache
         */
        export class TextureCache {

            public static addImage(path:string): void {
                cc.TextureCache.getInstance().addImage(path);
            }

            public static getTexture(path:string): any {
                return cc.TextureCache.getInstance().textureForKey(path);
            }
        }

    }

}

/// <reference path='./cocos2d.d.ts' />
/// <reference path='./ebi.ts' />

module ebi {

    module game {

        /*
         * TextureCache: Singleton class
         */
        export class TextureCache {
            private static _instance: TextureCache = null;

            constructor() {}

            public static get instance():TextureCache {
                if (!TextureCache._instance) {
                    TextureCache._instance = new TextureCache();
                }
                return TextureCache._instance;
            }

            public addImage(path:string): void {
                cc.TextureCache.getInstance().addImage(path);
            }

            public getTexture(path:string): any {
                return cc.TextureCache.getInstance().textureForKey(path);
            }
        }

    }

}

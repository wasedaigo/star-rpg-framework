/// <reference path='../../cc/cocos2d.d.ts' />

module ebi.game {

    export class Image {

        public static load(path:string, callback: (Image) => void): void {
            // The 2nd arguemnt should not be null.
            cc.TextureCache.getInstance().addImageAsync(path, this, () => {
                var ccImage = cc.TextureCache.getInstance().textureForKey(path);
                callback(new Image(ccImage));
            });
        }

        private ccImage_: cc.Image;

        // This should be private.
        constructor(ccImage: cc.Image) {
            this.ccImage_ = ccImage;
        }

    }

}
